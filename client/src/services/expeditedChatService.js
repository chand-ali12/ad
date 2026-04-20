import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { uploadImage as uploadImageApi } from "./uploadService";
import { MEDIA_BASE_URL } from "../config/env";

const CONVERSATIONS_COL = "Expedited_Conversations";
const RECENTS_COL = "Expedited_Recents";

/**
 * Create a new expedited chat room.
 * Only authenticators should call this.
 *
 * @param {string} orderId
 * @param {{ id: string, name: string, image: string, email: string }} clientInfo
 * @param {{ id: string, name: string, image: string, email: string }} authenticatorInfo
 * @returns {Promise<string>} roomId
 */
export async function createRoom(orderId, clientInfo, authenticatorInfo) {
  const roomId = `exp_${orderId}`;
  const batch = writeBatch(db);

  const roomRef = doc(db, CONVERSATIONS_COL, roomId);
  batch.set(roomRef, {
    orderId,
    clientId: clientInfo.id,
    authenticatorIds: [authenticatorInfo.id],
    participantIds: [clientInfo.id, authenticatorInfo.id],
    status: "active",
    createdAt: serverTimestamp(),
  });

  const recentData = {
    roomId,
    orderId,
    is_seen: true,
    unreadCount: 0,
    client_info: clientInfo,
    authenticators: [authenticatorInfo],
    status: "active",
    last_message: "",
    last_message_time: null,
    updatedAt: serverTimestamp(),
  };

  const clientRecentRef = doc(
    db,
    RECENTS_COL,
    clientInfo.id,
    "rooms",
    roomId,
  );
  batch.set(clientRecentRef, recentData);

  const authRecentRef = doc(
    db,
    RECENTS_COL,
    authenticatorInfo.id,
    "rooms",
    roomId,
  );
  batch.set(authRecentRef, recentData);

  const systemMsgRef = doc(
    collection(db, CONVERSATIONS_COL, roomId, "messages"),
  );
  batch.set(systemMsgRef, {
    message: `Chat started for order #${orderId}`,
    senderId: "system",
    senderEmail: "",
    time: serverTimestamp(),
    type: "system",
    is_media: false,
    media_url: null,
  });

  await batch.commit();
  return roomId;
}

/**
 * Send a message in a room.
 *
 * @param {string} roomId
 * @param {object} params
 * @param {string} params.message
 * @param {string} params.senderId
 * @param {string} params.senderEmail
 * @param {boolean} [params.is_media]
 * @param {string|null} [params.media_url]
 * @param {string[]} participantIds - all participant UIDs in the room
 */
export async function sendMessage(roomId, params, participantIds) {
  const {
    message,
    senderId,
    senderEmail,
    is_media = false,
    media_url = null,
  } = params;

  const batch = writeBatch(db);

  const msgRef = doc(collection(db, CONVERSATIONS_COL, roomId, "messages"));
  batch.set(msgRef, {
    message,
    senderId,
    senderEmail,
    time: serverTimestamp(),
    type: is_media ? "media" : "text",
    is_media,
    media_url,
  });

  const previewText =
    is_media && !message ? "Sent an image" : message.slice(0, 100);

  for (const uid of participantIds) {
    const recentRef = doc(db, RECENTS_COL, uid, "rooms", roomId);
    if (uid === senderId) {
      batch.update(recentRef, {
        last_message: previewText,
        last_message_time: serverTimestamp(),
        updatedAt: serverTimestamp(),
        is_seen: true,
      });
    } else {
      batch.update(recentRef, {
        last_message: previewText,
        last_message_time: serverTimestamp(),
        updatedAt: serverTimestamp(),
        is_seen: false,
        unreadCount: increment(1),
      });
    }
  }

  await batch.commit();
}

/**
 * Subscribe to real-time messages in a room.
 * Returns an unsubscribe function.
 *
 * @param {string} roomId
 * @param {(messages: Array) => void} callback
 * @param {number} [pageSize=50]
 * @returns {() => void} unsubscribe
 */
export function subscribeToMessages(roomId, callback, pageSize = 50) {
  const messagesRef = collection(db, CONVERSATIONS_COL, roomId, "messages");
  const q = query(messagesRef, orderBy("time", "asc"), limit(pageSize));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      time: d.data().time?.toDate?.() ?? null,
    }));
    callback(messages);
  });
}

/**
 * Load older messages for pagination (cursor-based).
 *
 * @param {string} roomId
 * @param {Timestamp} beforeTimestamp
 * @param {number} [pageSize=30]
 * @returns {Promise<Array>}
 */
export async function loadOlderMessages(roomId, beforeTimestamp, pageSize = 30) {
  const messagesRef = collection(db, CONVERSATIONS_COL, roomId, "messages");
  const q = query(
    messagesRef,
    orderBy("time", "desc"),
    startAfter(beforeTimestamp),
    limit(pageSize),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
      time: d.data().time?.toDate?.() ?? null,
    }))
    .reverse();
}

/**
 * Subscribe to the user's recent chats list (sidebar).
 * Returns an unsubscribe function.
 *
 * @param {string} userId
 * @param {(rooms: Array) => void} callback
 * @returns {() => void} unsubscribe
 */
export function subscribeToRecents(userId, callback) {
  const roomsRef = collection(db, RECENTS_COL, userId, "rooms");
  const q = query(roomsRef, orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      last_message_time: d.data().last_message_time?.toDate?.() ?? null,
      updatedAt: d.data().updatedAt?.toDate?.() ?? null,
    }));
    callback(rooms);
  });
}

/**
 * Mark a room as seen for a specific user.
 *
 * @param {string} userId
 * @param {string} roomId
 */
export async function markAsSeen(userId, roomId) {
  const recentRef = doc(db, RECENTS_COL, userId, "rooms", roomId);
  await updateDoc(recentRef, {
    is_seen: true,
    unreadCount: 0,
  });
}

/**
 * Get room metadata from Expedited_Conversations.
 *
 * @param {string} roomId
 * @returns {Promise<object|null>}
 */
export async function getRoomInfo(roomId) {
  const roomRef = doc(db, CONVERSATIONS_COL, roomId);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Update room status (active / resolved / closed).
 *
 * @param {string} roomId
 * @param {string} status
 * @param {string[]} participantIds
 */
export async function updateRoomStatus(roomId, status, participantIds) {
  const batch = writeBatch(db);

  const roomRef = doc(db, CONVERSATIONS_COL, roomId);
  batch.update(roomRef, { status });

  for (const uid of participantIds) {
    const recentRef = doc(db, RECENTS_COL, uid, "rooms", roomId);
    batch.update(recentRef, { status });
  }

  const systemMsgRef = doc(
    collection(db, CONVERSATIONS_COL, roomId, "messages"),
  );
  batch.set(systemMsgRef, {
    message: `Chat status changed to "${status}"`,
    senderId: "system",
    senderEmail: "",
    time: serverTimestamp(),
    type: "system",
    is_media: false,
    media_url: null,
  });

  await batch.commit();
}

/**
 * Upload a file to S3 via the backend /ad/upload-image API and return the full URL.
 *
 * @param {string} roomId
 * @param {File} file
 * @returns {Promise<string>} full image URL
 */
export async function uploadChatMedia(roomId, file) {
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
 * Check if a room already exists for a given order.
 *
 * @param {string} orderId
 * @returns {Promise<boolean>}
 */
export async function roomExistsForOrder(orderId) {
  const roomId = `exp_${orderId}`;
  const roomRef = doc(db, CONVERSATIONS_COL, roomId);
  const snap = await getDoc(roomRef);
  return snap.exists();
}
