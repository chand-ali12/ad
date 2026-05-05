import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  writeBatch,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { uploadImage as uploadImageApi } from "./uploadService";
import { MEDIA_BASE_URL } from "../config/env";

/** Matches Firestore dev collection for message threads */
const CONVERSATIONS_COL = "ExpeditedConversations_Dev";
/** Recents: ExpeditedRecent_Dev / Users / {userEmail} / {firebaseChatId} */
const RECENTS_COL = "ExpeditedRecent_Dev";
const RECENTS_USERS_DOC = "Users";

/** Firestore subcollection under Users is the inbox key — stable casing avoids duplicate inboxes. */
function normalizeInboxEmail(email) {
  return (email || "").trim().toLowerCase();
}

function newFirebaseChatId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function messagesCollectionRef(firebaseChatId) {
  return collection(db, CONVERSATIONS_COL, firebaseChatId, firebaseChatId);
}

function recentDocRef(userEmail, firebaseChatId) {
  const e = normalizeInboxEmail(userEmail);
  return doc(db, RECENTS_COL, RECENTS_USERS_DOC, e, firebaseChatId);
}

function senderEmailsFromMessageList(recentMessages) {
  const senders = new Set();
  for (const m of recentMessages || []) {
    if (String(m?.senderID ?? "") === "system") continue;
    const se = normalizeInboxEmail(m?.senderEmail);
    if (se) senders.add(se);
  }
  return senders;
}

/** Any message sender in the thread who is not the viewer (counterparty inbox path). */
function counterpartyEmailFromMessages(viewerNorm, recentMessages) {
  for (const se of senderEmailsFromMessageList(recentMessages)) {
    if (se !== viewerNorm) return se;
  }
  return "";
}

async function fetchThreadSenderEmails(firebaseChatId, maxDocs = 50) {
  const messagesRef = messagesCollectionRef(firebaseChatId);
  const q = query(messagesRef, orderBy("time", "desc"), limit(maxDocs));
  const snapshot = await getDocs(q);
  const emails = new Set();
  for (const d of snapshot.docs) {
    const data = d.data();
    if (String(data.senderID ?? "") === "system") continue;
    const se = normalizeInboxEmail(data.senderEmail);
    if (se) emails.add(se);
  }
  return emails;
}

async function getOrderIdFromExistingRecents(chatId, emails) {
  for (const raw of emails || []) {
    const e = normalizeInboxEmail(raw);
    if (!e) continue;
    const s = await getDoc(recentDocRef(e, chatId));
    if (s.exists()) {
      const oid = s.data().orderId;
      if (oid) return String(oid);
    }
  }
  return "";
}

/** UTC ISO-8601 for `time` fields — always `…Z` (true UTC, not local wall clock). */
function messageTimeString() {
  const d = new Date();
  const p = (n, len = 2) => String(n).padStart(len, "0");
  const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${ms}Z`;
}

/** Normalize Firestore timestamp or ISO string to Date */
function parseMessageTime(value) {
  if (value == null) return null;
  if (typeof value === "string") {
    let s = value.trim();
    if (
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(s) &&
      /\bUTC$/i.test(s)
    ) {
      s = s.replace(/\s+UTC$/i, "Z").replace(" ", "T");
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value.toDate === "function") return value.toDate();
  return null;
}

function mapMessageDoc(d) {
  const data = d.data();
  const time = parseMessageTime(data.time);
  return {
    id: d.id,
    ...data,
    senderId: data.senderID ?? data.senderId,
    is_media: data.isMedia ?? data.is_media,
    media_url: data.mediaUrl ?? data.media_url,
    time,
  };
}

function mapRecentDoc(d) {
  const data = d.data();
  const last = data.lastMessage || {};
  const lastTime = parseMessageTime(last.time);
  const firebaseChatId = data.firebaseChatId || d.id;
  return {
    id: d.id,
    roomId: firebaseChatId,
    firebaseChatId,
    orderId: data.orderId ?? "",
    authenticators: data.authenticators ?? [],
    clientInfo: data.clientInfo ?? {},
    client_info: data.clientInfo ?? {},
    lastMessage: data.lastMessage ?? {},
    isSeen: data.isSeen ?? true,
    is_seen: data.isSeen ?? true,
    last_message: last.message ?? "",
    last_message_time: lastTime,
    status: data.status ?? "",
  };
}

function buildLastMessagePatch({
  previewText,
  senderId,
  senderEmail,
  isMedia,
  mediaUrl,
  senderBusinessID = "",
  timeUtc,
}) {
  return {
    isMedia: !!isMedia,
    mediaUrl: mediaUrl || "",
    message: previewText,
    senderBusinessID: senderBusinessID || "",
    senderEmail: senderEmail || "",
    senderID: String(senderId ?? ""),
    time: timeUtc ?? messageTimeString(),
  };
}

function buildMessagePayload({
  message,
  senderId,
  senderEmail,
  isMedia,
  mediaUrl,
  senderBusinessID = "",
  timeUtc,
}) {
  return {
    message: message ?? "",
    senderID: String(senderId ?? ""),
    senderEmail: senderEmail || "",
    senderBusinessID: senderBusinessID || "",
    time: timeUtc ?? messageTimeString(),
    isMedia: !!isMedia,
    mediaUrl: mediaUrl || "",
  };
}

/** Empty lastMessage snapshot for newly created threads (no auto "chat started" line). */
function initialEmptyLastMessage() {
  return buildLastMessagePatch({
    previewText: "",
    senderId: "",
    senderEmail: "",
    isMedia: false,
    mediaUrl: "",
  });
}

/**
 * Create a new expedited chat room.
 *
 * @param {string} orderId
 * @param {{ id: string, name: string, image: string, email: string }} clientInfo
 * @param {{ id: string, name: string, image: string, email: string }|null|undefined} [authenticatorInfo] — optional; omitted or null when no claim yet
 * @returns {Promise<string>} firebaseChatId
 */
export async function createRoom(orderId, clientInfo, authenticatorInfo) {
  const clientEmail = normalizeInboxEmail(clientInfo.email);
  if (!clientEmail) {
    throw new Error("Client email is required for chat recents.");
  }

  const auth =
    authenticatorInfo && normalizeInboxEmail(authenticatorInfo.email)
      ? authenticatorInfo
      : null;
  const authEmail = auth ? normalizeInboxEmail(auth.email) : "";

  const firebaseChatId = newFirebaseChatId();
  const batch = writeBatch(db);

  const emptyLast = initialEmptyLastMessage();

  const clientPayload = { ...clientInfo, email: clientEmail };
  const authenticatorsList = auth ? [{ ...auth, email: authEmail }] : [];

  const clientRecent = {
    authenticators: authenticatorsList,
    clientInfo: clientPayload,
    firebaseChatId,
    isSeen: false,
    lastMessage: emptyLast,
    orderId,
    status: "active",
  };

  batch.set(recentDocRef(clientEmail, firebaseChatId), clientRecent);

  if (authEmail) {
    const authRecent = {
      authenticators: authenticatorsList,
      clientInfo: clientPayload,
      firebaseChatId,
      isSeen: true,
      lastMessage: emptyLast,
      orderId,
      status: "active",
    };
    batch.set(recentDocRef(authEmail, firebaseChatId), authRecent);
  }

  await batch.commit();
  return firebaseChatId;
}

/**
 * When the API already has {@link authenticate_query.firebase_chat_id} but Firestore may not
 * have our recents/conversation parent doc yet, create only what's missing. No initial thread message.
 *
 * @returns {Promise<string>} same firebaseChatId
 */
export async function ensureExpeditedChatRoom(
  firebaseChatId,
  orderId,
  clientInfo,
  authenticatorInfo,
) {
  const id = String(firebaseChatId || "").trim();
  if (!id) throw new Error("firebaseChatId is required");

  const clientEmail = normalizeInboxEmail(clientInfo.email);
  if (!clientEmail)
    throw new Error("Client email is required for chat recents.");

  const auth =
    authenticatorInfo && normalizeInboxEmail(authenticatorInfo.email)
      ? authenticatorInfo
      : null;
  const authEmail = auth ? normalizeInboxEmail(auth.email) : "";

  const clientRecentRef = recentDocRef(clientEmail, id);
  const clientRecentSnap = await getDoc(clientRecentRef);

  let authRecentRef = null;
  let authRecentSnap = null;
  if (authEmail) {
    authRecentRef = recentDocRef(authEmail, id);
    authRecentSnap = await getDoc(authRecentRef);
  }

  const batch = writeBatch(db);
  let hasWrites = false;

  const emptyLast = initialEmptyLastMessage();

  const clientPayload = { ...clientInfo, email: clientEmail };
  const authenticatorsList = auth ? [{ ...auth, email: authEmail }] : [];

  if (!clientRecentSnap.exists()) {
    batch.set(clientRecentRef, {
      authenticators: authenticatorsList,
      clientInfo: clientPayload,
      firebaseChatId: id,
      isSeen: false,
      lastMessage: emptyLast,
      orderId,
      status: "active",
    });
    hasWrites = true;
  }

  if (
    authEmail &&
    authRecentRef &&
    authRecentSnap &&
    !authRecentSnap.exists()
  ) {
    batch.set(authRecentRef, {
      authenticators: authenticatorsList,
      clientInfo: clientPayload,
      firebaseChatId: id,
      isSeen: true,
      lastMessage: emptyLast,
      orderId,
      status: "active",
    });
    hasWrites = true;
  }

  if (hasWrites) await batch.commit();
  return id;
}

/**
 * Provision Firestore inbox docs on first send (certificate “open chat” no longer creates rows).
 * Uses API/backend chat id with {@link ensureExpeditedChatRoom}, or {@link createRoom} when no id yet.
 *
 * @returns {Promise<string>} firebaseChatId
 */
export async function provisionExpeditedRoomBeforeFirstMessage({
  firebaseChatId,
  orderId,
  clientInfo,
  authenticatorInfo,
}) {
  const id = firebaseChatId ? String(firebaseChatId).trim() : "";
  if (id) {
    await ensureExpeditedChatRoom(
      id,
      orderId,
      clientInfo,
      authenticatorInfo ?? null,
    );
    return id;
  }
  if (!orderId) {
    throw new Error("orderId is required to start a new expedited chat.");
  }
  return createRoom(orderId, clientInfo, authenticatorInfo ?? null);
}

/**
 * Link client ↔ authenticator inboxes using message senders (counterparty email) and each party's recent row.
 *
 * @param {object} opts
 * @param {string} opts.firebaseChatId
 * @param {string} opts.viewerEmail
 * @param {'client'|'authenticator'} opts.viewerRole
 * @param {{ id: string, name: string, email: string, image: string }} opts.selfProfile
 * @param {Array<{ senderEmail?: string, senderID?: string }>} [opts.recentMessages] — if omitted, last 50 thread messages are loaded
 */
export async function syncExpeditedParticipantRecents({
  firebaseChatId,
  viewerEmail,
  viewerRole,
  selfProfile,
  recentMessages: recentMessagesArg,
}) {
  const chatId = String(firebaseChatId || "").trim();
  const vEmail = normalizeInboxEmail(viewerEmail);
  if (!chatId || !vEmail || !selfProfile) return;

  const myRecentRef = recentDocRef(vEmail, chatId);
  const mySnap = await getDoc(myRecentRef);

  if (viewerRole === "client") {
    const cur = mySnap.exists() ? mySnap.data() : {};
    const auths = cur.authenticators || [];
    if (auths.length > 0 && auths[0]?.id) return;
  } else {
    const cur = mySnap.exists() ? mySnap.data() : {};
    const ci = cur.clientInfo || {};
    if (ci.email || ci.id) return;
  }

  let recentMessages = recentMessagesArg;
  if (!recentMessages?.length) {
    const snapshot = await getDocs(
      query(messagesCollectionRef(chatId), orderBy("time", "desc"), limit(50)),
    );
    recentMessages = snapshot.docs.map((d) => {
      const data = d.data();
      return { senderID: data.senderID, senderEmail: data.senderEmail };
    });
  }

  let otherEmail = counterpartyEmailFromMessages(vEmail, recentMessages);

  if (!otherEmail && mySnap.exists()) {
    const d = mySnap.data();
    if (viewerRole === "client") {
      const a = (d.authenticators || [])[0];
      otherEmail = normalizeInboxEmail(a?.email);
    } else {
      otherEmail = normalizeInboxEmail((d.clientInfo || {}).email);
    }
  }

  if (!otherEmail) return;

  const batch = writeBatch(db);
  let ops = 0;

  if (viewerRole === "authenticator") {
    const clientEmail = otherEmail;
    const clientR = await getDoc(recentDocRef(clientEmail, chatId));
    if (!clientR.exists()) {
      return;
    }

    const cd = clientR.data();
    const clientInfo = cd.clientInfo || {};
    const orderId = cd.orderId || "";
    const status = cd.status || "active";
    const lastMessage = cd.lastMessage || initialEmptyLastMessage();
    const authEntry = {
      id: String(selfProfile.id ?? ""),
      name: selfProfile.name || "Authenticator",
      email: vEmail,
      image: selfProfile.image || "",
    };

    const authRef = recentDocRef(vEmail, chatId);
    const authSnap = await getDoc(authRef);
    if (!authSnap.exists()) {
      batch.set(authRef, {
        authenticators: [authEntry],
        clientInfo,
        firebaseChatId: chatId,
        isSeen: true,
        lastMessage,
        orderId,
        status,
      });
    } else {
      batch.set(
        authRef,
        {
          clientInfo,
          authenticators: [authEntry],
          orderId,
          status,
        },
        { merge: true },
      );
    }
    ops++;
    batch.set(
      recentDocRef(clientEmail, chatId),
      {
        firebaseChatId: chatId,
        orderId,
        authenticators: [authEntry],
      },
      { merge: true },
    );
    ops++;
  } else {
    const authEmail = otherEmail;
    const authRecentRef = recentDocRef(authEmail, chatId);
    let authR = await getDoc(authRecentRef);
    if (!authR.exists()) {
      const myData = mySnap.exists() ? mySnap.data() : {};
      const clientInfo = myData.clientInfo || {};
      const orderId = myData.orderId || "";
      const lastMessage = myData.lastMessage || initialEmptyLastMessage();
      const status = myData.status || "active";
      const placeholderAuth = {
        id: "",
        name: "Authenticator",
        email: authEmail,
        image: "",
      };
      batch.set(authRecentRef, {
        authenticators: [placeholderAuth],
        clientInfo,
        firebaseChatId: chatId,
        isSeen: false,
        lastMessage,
        orderId,
        status,
      });
      ops++;
      authR = await getDoc(authRecentRef);
    }

    const ad = authR.data() || {};
    let auths = ad.authenticators || [];
    if (!auths.length && authEmail) {
      auths = [
        {
          id: "",
          name: "Authenticator",
          email: authEmail,
          image: "",
        },
      ];
    }
    const clientInfo = ad.clientInfo || {};
    const orderId = mySnap.exists() ? mySnap.data().orderId || "" : "";
    batch.set(
      myRecentRef,
      {
        firebaseChatId: chatId,
        orderId,
        authenticators: auths,
        clientInfo,
      },
      { merge: true },
    );
    ops++;
  }

  if (ops) await batch.commit();
}

/**
 * Re-run inbox sync when the thread view has loaded messages (counterparty may appear only in senders).
 */
export async function reconcileExpeditedThreadParticipants({
  firebaseChatId,
  viewerEmail,
  viewerRole,
  selfProfile,
  recentMessages,
}) {
  const chatId = String(firebaseChatId || "").trim();
  const vEmail = normalizeInboxEmail(viewerEmail);
  if (!chatId || !vEmail || !selfProfile) return;

  await syncExpeditedParticipantRecents({
    firebaseChatId: chatId,
    viewerEmail: vEmail,
    viewerRole,
    selfProfile,
    recentMessages,
  });
}

/**
 * @param {string} firebaseChatId
 * @param {object} params
 * @param {string} params.message
 * @param {string} params.senderId
 * @param {string} params.senderEmail
 * @param {boolean} [params.is_media]
 * @param {string|null} [params.media_url]
 * @param {string} [params.senderBusinessID]
 * @param {{ id: string, name: string, email: string, image: string }} [params.clientInfo] — merged into the sender's recent row (client users)
 * @param {{ id: string, name: string, email: string, image: string }} [params.authenticatorSelf] — merged into sender's recent `authenticators` (authenticator users)
 * @param {{ email: string }[]} participantEmailsList - participants' emails (recents path keys)
 */
export async function sendMessage(
  firebaseChatId,
  params,
  participantEmailsList,
) {
  const {
    message,
    senderId,
    senderEmail,
    is_media = false,
    media_url = null,
    senderBusinessID = "",
    clientInfo: clientInfoParam,
    authenticatorSelf,
  } = params;

  const senderEmailNorm = normalizeInboxEmail(senderEmail);
  const emailSet = new Set();
  for (const entry of participantEmailsList || []) {
    const e = normalizeInboxEmail(entry?.email);
    if (e) emailSet.add(e);
  }
  if (senderEmailNorm) emailSet.add(senderEmailNorm);

  const threadEmails = await fetchThreadSenderEmails(firebaseChatId, 50);
  threadEmails.forEach((e) => emailSet.add(e));

  const orderId = await getOrderIdFromExistingRecents(firebaseChatId, [
    ...emailSet,
    senderEmailNorm,
  ]);

  if (emailSet.size === 0 && senderEmailNorm) emailSet.add(senderEmailNorm);

  /* 1:1 expedited: merge counterparty inbox from sender's own recent row (always, not only when size ≤ 1). */
  if (senderEmailNorm && (clientInfoParam || authenticatorSelf)) {
    const myRecent = await getDoc(recentDocRef(senderEmailNorm, firebaseChatId));
    if (myRecent.exists()) {
      const data = myRecent.data();
      if (clientInfoParam) {
        const ae = normalizeInboxEmail(data.authenticators?.[0]?.email);
        if (ae && ae !== senderEmailNorm) emailSet.add(ae);
      }
      if (authenticatorSelf) {
        const ce = normalizeInboxEmail(data.clientInfo?.email);
        if (ce && ce !== senderEmailNorm) emailSet.add(ce);
      }
    }
  }

  const batch = writeBatch(db);

  const timeUtc = messageTimeString();

  const msgRef = doc(messagesCollectionRef(firebaseChatId));
  batch.set(
    msgRef,
    buildMessagePayload({
      message,
      senderId,
      senderEmail,
      isMedia: is_media,
      mediaUrl: media_url,
      senderBusinessID,
      timeUtc,
    }),
  );

  const previewText =
    is_media && !message ? "Sent an image" : (message || "").slice(0, 100);

  const lastMessageSeen = buildLastMessagePatch({
    previewText,
    senderId,
    senderEmail,
    isMedia: is_media,
    mediaUrl: media_url,
    senderBusinessID,
    timeUtc,
  });

  const lastMessageUnread = { ...lastMessageSeen };

  for (const emailKey of emailSet) {
    const recentRef = recentDocRef(emailKey, firebaseChatId);
    const isSender = emailKey === senderEmailNorm;
    /** @type {Record<string, unknown>} */
    const patch = {
      firebaseChatId,
      orderId: orderId || "",
      lastMessage: isSender ? lastMessageSeen : lastMessageUnread,
      isSeen: isSender,
      status: "active",
    };

    if (isSender && clientInfoParam) {
      const ce = normalizeInboxEmail(clientInfoParam.email);
      if (ce && ce === senderEmailNorm) {
        patch.clientInfo = {
          id: String(clientInfoParam.id ?? ""),
          name: clientInfoParam.name || "",
          email: ce,
          image: clientInfoParam.image || "",
        };
      }
    }

    /* Client sends: every other inbox (e.g. authenticator) gets the same clientInfo — no collection scan, path is Users/{theirEmail}/{firebaseChatId}. */
    if (!isSender && clientInfoParam) {
      const ce = normalizeInboxEmail(clientInfoParam.email);
      if (ce && ce === senderEmailNorm) {
        patch.clientInfo = {
          id: String(clientInfoParam.id ?? ""),
          name: clientInfoParam.name || "",
          email: ce,
          image: clientInfoParam.image || "",
        };
      }
    }

    if (isSender && authenticatorSelf) {
      const ae = normalizeInboxEmail(authenticatorSelf.email);
      if (ae && ae === senderEmailNorm) {
        patch.authenticators = [
          {
            id: String(authenticatorSelf.id ?? ""),
            name: authenticatorSelf.name || "Authenticator",
            email: ae,
            image: authenticatorSelf.image || "",
          },
        ];
      }
    }

    /* Authenticator sends: client's inbox row gets this authenticator entry. */
    if (!isSender && authenticatorSelf) {
      const ae = normalizeInboxEmail(authenticatorSelf.email);
      if (ae && ae === senderEmailNorm) {
        patch.authenticators = [
          {
            id: String(authenticatorSelf.id ?? ""),
            name: authenticatorSelf.name || "Authenticator",
            email: ae,
            image: authenticatorSelf.image || "",
          },
        ];
      }
    }

    batch.set(recentRef, patch, { merge: true });
  }

  await batch.commit();
}

export function subscribeToMessages(firebaseChatId, callback, pageSize = 50) {
  const messagesRef = messagesCollectionRef(firebaseChatId);
  // Newest first from Firestore, then reverse to chronological order for the UI.
  // (orderBy asc + limit would return the *oldest* 50 docs, not the latest.)
  const q = query(messagesRef, orderBy("time", "desc"), limit(pageSize));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map(mapMessageDoc).reverse();
      callback(messages);
    },
    (err) => {
      console.error("subscribeToMessages:", err);
      callback([]);
    },
  );
}

export async function loadOlderMessages(
  firebaseChatId,
  beforeDocSnapshot,
  pageSize = 30,
) {
  const messagesRef = messagesCollectionRef(firebaseChatId);
  const q = query(
    messagesRef,
    orderBy("time", "desc"),
    startAfter(beforeDocSnapshot),
    limit(pageSize),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapMessageDoc).reverse();
}

/**
 * All expedited threads where this email has an inbox row under
 * `ExpeditedRecent_Dev / Users / {normalizedEmail} / {chatId}`.
 *
 * That includes chats opened from the client (certificate flow) and chats created by
 * the authenticator ("New Room"), because {@link createRoom} and
 * {@link ensureExpeditedChatRoom} write a recent doc per participant when the
 * authenticator has an email (and always for the client).
 *
 * @param {string} userEmail — logged-in user's email (client or authenticator)
 * @param {(rooms: Array) => void} callback
 */
export function subscribeToRecents(userEmail, callback) {
  const email = normalizeInboxEmail(userEmail);
  if (!email) {
    callback([]);
    return () => {};
  }

  const roomsRef = collection(db, RECENTS_COL, RECENTS_USERS_DOC, email);

  return onSnapshot(
    roomsRef,
    (snapshot) => {
      const rooms = snapshot.docs
        .map(mapRecentDoc)
        .sort(
          (a, b) =>
            (b.last_message_time?.getTime?.() ?? 0) -
            (a.last_message_time?.getTime?.() ?? 0),
        );
      callback(rooms);
    },
    (err) => {
      console.error("subscribeToRecents:", err);
      callback([]);
    },
  );
}

export async function markAsSeen(userEmail, firebaseChatId) {
  const email = normalizeInboxEmail(userEmail);
  if (!email || !firebaseChatId) return;
  const recentRef = recentDocRef(email, firebaseChatId);
  await updateDoc(recentRef, {
    isSeen: true,
  });
}

export async function getRoomInfo(firebaseChatId, viewerEmail) {
  const email = normalizeInboxEmail(viewerEmail);
  if (!email || !firebaseChatId) return null;
  const ref = recentDocRef(email, firebaseChatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: firebaseChatId,
    firebaseChatId,
    status: d.status ?? "active",
    orderId: d.orderId ?? "",
  };
}

export async function updateRoomStatus(
  firebaseChatId,
  status,
  participantEmailsList,
) {
  const batch = writeBatch(db);

  const seen = new Set();
  for (const entry of participantEmailsList) {
    const email = (entry?.email || "").trim();
    if (!email) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    batch.update(recentDocRef(email, firebaseChatId), { status });
  }

  const systemMsgRef = doc(messagesCollectionRef(firebaseChatId));
  batch.set(systemMsgRef, {
    message: `Chat status changed to "${status}"`,
    senderID: "system",
    senderEmail: "",
    senderBusinessID: "",
    time: messageTimeString(),
    isMedia: false,
    mediaUrl: "",
  });

  await batch.commit();
}

export async function uploadChatMedia(firebaseChatId, file) {
  void firebaseChatId;
  const token = localStorage.getItem("authToken");
  const res = await uploadImageApi({
    image: file,
    storage_type: "chatMedia",
    token,
  });
  const path = res?.data;
  if (!path) throw new Error("Upload failed: no path returned");
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (MEDIA_BASE_URL || "").replace(/\/+$/, "");
  return `${base}/chatMedia/${path.replace(/^\/+/, "")}`;
}

/**
 * @param {string} orderId
 * @param {string} userEmail - recents owner email to query (e.g. client email)
 */
export async function roomExistsForOrder(orderId, userEmail) {
  const id = await findRoomIdByOrder(orderId, userEmail);
  return id != null;
}

export async function findRoomIdByOrder(orderId, userEmail) {
  const email = normalizeInboxEmail(userEmail);
  if (!email || !orderId) return null;
  const q = query(
    collection(db, RECENTS_COL, RECENTS_USERS_DOC, email),
    where("orderId", "==", orderId),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return d.data().firebaseChatId || d.id;
}
