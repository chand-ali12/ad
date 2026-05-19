import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
  FiChevronLeft,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiX,
  FiPlus,
  FiImage,
  FiArrowDown,
} from "react-icons/fi";
import {
  subscribeToRecents,
  subscribeToMessages,
  sendMessage,
  markAsSeen,
  uploadChatMedia,
  createRoom,
  roomExistsForOrder,
  getRoomInfo,
  updateRoomStatus,
  syncExpeditedParticipantRecents,
  reconcileExpeditedThreadParticipants,
  provisionExpeditedRoomBeforeFirstMessage,
  subscribeToOtherPartySeenStatus,
  sendMessageNotification,
} from "../../services/expeditedChatService";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

/** Time-of-day only (UTC clock), next to each message — no date. */
function formatFullTime(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

function formatDayLabel(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const yestUtc = todayUtc - 86400000;
  const targetUtc = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
  );
  if (targetUtc === todayUtc) return "Today";
  if (targetUtc === yestUtc) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
}

function dayKey(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

const AUTHENTICATE_IMAGE_BASE_URL = "https://auth-detect.s3.amazonaws.com/authenticateImage/";

/** Constructs a displayable URL from a stored image path or returns the value as-is if already a URL. */
function resolveImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${AUTHENTICATE_IMAGE_BASE_URL}${image}`;
}

// --------------- Create Room Modal ---------------

function CreateRoomModal({ onClose, onSubmit, loading }) {
  const [orderId, setOrderId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientImage, setClientImage] = useState("");
  const [queryImage, setQueryImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !orderId.trim() ||
      !clientId.trim() ||
      !clientName.trim() ||
      !clientEmail.trim()
    ) {
      setError("All fields are required");
      return;
    }
    setError("");
    onSubmit({
      orderId: orderId.trim(),
      queryImage: queryImage.trim(),
      clientInfo: {
        id: clientId.trim(),
        name: clientName.trim(),
        image: clientImage.trim(),
        email: clientEmail.trim(),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "#3C1F1B" }}
        >
          <h2 className="text-lg font-semibold text-white">Create Chat Room</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD_555"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/30 focus:border-[#3C1F1B] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client User ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Client's user ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/30 focus:border-[#3C1F1B] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client's full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/30 focus:border-[#3C1F1B] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/30 focus:border-[#3C1F1B] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Profile Image UUID <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={clientImage}
              onChange={(e) => setClientImage(e.target.value)}
              placeholder="e.g. a1b30458-d066-480d-960f..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/30 focus:border-[#3C1F1B] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Query Image UUID <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={queryImage}
              onChange={(e) => setQueryImage(e.target.value)}
              placeholder="e.g. a1b30458-d066-480d-960f..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/30 focus:border-[#3C1F1B] outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium rounded-lg py-2.5 text-sm transition-all disabled:opacity-50"
            style={{ background: "#3C1F1B" }}
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --------------- Image Lightbox ---------------

function ImageLightbox({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <FiX size={28} />
      </button>
      <img
        src={src}
        alt="Chat media"
        className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// --------------- Main Component ---------------


function getStoredProfilePicture() {
  try {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw)?.profile_picture || "" : "";
  } catch {
    return "";
  }
}

export default function ExpeditedChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const { user: profileUser } = useAppSelector((state) => state.profile);

  const currentUserId = user?.id?.toString() || "";
  const currentUserEmail = user?.email || "";
  const currentUserName = user?.name || user?.first_name || "User";
  const currentUserImage =
    getStoredProfilePicture() ||
    profileUser?.profile_picture ||
    user?.profile_picture ||
    user?.image ||
    user?.profile_image ||
    "";
  
  const isAuthenticator =
    user?.role === "authenticator" || user?.user_type === "authenticator";

  const roomFromUrl = searchParams.get("room");
  const orderIdFromUrl = searchParams.get("orderId") || "";
  const imageFromUrl = searchParams.get("image") || "";
  const deferProvision = searchParams.get("deferProvision") === "1";
  const deferProvisionActive = deferProvision && !isAuthenticator;

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(roomFromUrl || null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );
  const [authenticatorSeen, setAuthenticatorSeen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const prevRoomIdRef = useRef(null);
  const prevMsgCountRef = useRef(0);

  const [headerHeight, setHeaderHeight] = useState(72);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Measure the sticky app header so the chat fits exactly below it
  useEffect(() => {
    const findHeader = () =>
      document.querySelector(".sticky.top-0.z-50") ||
      document.querySelector("header");
    const measure = () => {
      const el = findHeader();
      if (el) {
        const h = el.getBoundingClientRect().height;
        if (h > 0) setHeaderHeight(h);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    let ro = null;
    const el = findHeader();
    if (typeof ResizeObserver !== "undefined" && el) {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => {
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, []);

  // Responsive breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Subscribe to recents (Firestore path uses user email under ExpeditedRecent_Dev/Users)
  useEffect(() => {
    if (!currentUserEmail?.trim()) {
      setRooms([]);
      setLoadingRooms(false);
      return;
    }
    setLoadingRooms(true);
    const unsub = subscribeToRecents(currentUserEmail.trim(), (data) => {
      setRooms(data);
      setLoadingRooms(false);
    });
    return unsub;
  }, [currentUserEmail]);

  // Subscribe to messages when a room is selected
  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      setRoomInfo(null);
      setLoadingMessages(false);
      return;
    }
    setLoadingMessages(true);
    const unsub = subscribeToMessages(selectedRoomId, (msgs) => {
      setMessages(msgs);
      setLoadingMessages(false);
    });

    getRoomInfo(selectedRoomId, currentUserEmail.trim()).then((info) =>
      setRoomInfo(info),
    );

    if (currentUserEmail?.trim()) {
      markAsSeen(currentUserEmail.trim(), selectedRoomId).catch(() => {});
    }
    return unsub;
  }, [selectedRoomId, currentUserEmail]);

  // Subscribe to the authenticator's isSeen flag so the client can show a "Seen" receipt
  useEffect(() => {
    if (isAuthenticator || !selectedRoomId) {
      setAuthenticatorSeen(false);
      return;
    }
    const room = rooms.find((r) => r.roomId === selectedRoomId);
    const authEmail = room?.authenticators?.[0]?.email;
    if (!authEmail) {
      setAuthenticatorSeen(false);
      return;
    }
    const unsub = subscribeToOtherPartySeenStatus(authEmail, selectedRoomId, setAuthenticatorSeen);
    return unsub;
  }, [selectedRoomId, rooms, isAuthenticator]);

  useEffect(() => {
    const email = currentUserEmail?.trim();
    if (!selectedRoomId || !email) return;
    syncExpeditedParticipantRecents({
      firebaseChatId: selectedRoomId,
      viewerEmail: email,
      viewerRole: isAuthenticator ? "authenticator" : "client",
      selfProfile: {
        id: currentUserId,
        name: currentUserName,
        email,
        image: currentUserImage || "",
      },
    }).catch((err) => {
      console.warn("Expedited participant sync:", err);
    });
  }, [
    selectedRoomId,
    currentUserEmail,
    currentUserId,
    currentUserName,
    currentUserImage,
    isAuthenticator,
  ]);

  useEffect(() => {
    if (!selectedRoomId || !currentUserEmail?.trim() || !messages.length)
      return;
    const t = setTimeout(() => {
      reconcileExpeditedThreadParticipants({
        firebaseChatId: selectedRoomId,
        viewerEmail: currentUserEmail.trim(),
        viewerRole: isAuthenticator ? "authenticator" : "client",
        selfProfile: {
          id: currentUserId,
          name: currentUserName,
          email: currentUserEmail.trim(),
          image: currentUserImage || "",
        },
        recentMessages: messages,
      }).catch((err) => {
        console.warn("Expedited thread reconcile:", err);
      });
    }, 600);
    return () => clearTimeout(t);
  }, [
    messages,
    selectedRoomId,
    currentUserEmail,
    currentUserId,
    currentUserName,
    currentUserImage,
    isAuthenticator,
  ]);

  const selectRoom = useCallback(
    (roomId) => {
      setSelectedRoomId(roomId);
      if (roomId) {
        setSearchParams(
          (prev) => {
            const p = new URLSearchParams(prev);
            p.set("room", roomId);
            p.delete("deferProvision");
            return p;
          },
          { replace: true },
        );
      } else {
        setSearchParams({}, { replace: true });
      }
    },
    [setSearchParams],
  );

  // Auto-scroll: instant jump on room switch / first load, smooth for new incoming messages
  useEffect(() => {
    const end = messagesEndRef.current;
    const container = messagesContainerRef.current;
    if (!end || !container) return;

    const isNewRoom = prevRoomIdRef.current !== selectedRoomId;
    const hadMessages = prevMsgCountRef.current > 0;
    const behavior = isNewRoom || !hadMessages ? "auto" : "smooth";

    // Use rAF so layout is settled before scrolling
    requestAnimationFrame(() => {
      if (behavior === "auto") {
        container.scrollTop = container.scrollHeight;
      } else {
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });

    prevRoomIdRef.current = selectedRoomId;
    prevMsgCountRef.current = messages.length;
  }, [messages, selectedRoomId, loadingMessages]);

  // Track scroll position to show/hide the "jump to bottom" button
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollToBottom(distFromBottom > 160);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [selectedRoomId, loadingMessages]);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Filter rooms by search
  const filteredRooms = useMemo(() => {
    if (!search.trim()) return rooms;
    const q = search.toLowerCase();
    return rooms.filter((room) => {
      const ci = room.clientInfo ?? room.client_info;
      const clientName = ci?.name?.toLowerCase() || "";
      const orderId = room.orderId?.toLowerCase() || "";
      const authNames = (room.authenticators || [])
        .map((a) => a.name?.toLowerCase() || "")
        .join(" ");
      return (
        clientName.includes(q) || orderId.includes(q) || authNames.includes(q)
      );
    });
  }, [rooms, search]);

  const selectedRoom = useMemo(() => {
    const fromList = rooms.find((r) => r.roomId === selectedRoomId);
    if (fromList) return fromList;
    if (deferProvisionActive && (selectedRoomId || orderIdFromUrl)) {
      const email = (currentUserEmail || "").trim();
      return {
        roomId: selectedRoomId || "",
        firebaseChatId: selectedRoomId || "",
        orderId: orderIdFromUrl || "",
        authenticators: [],
        clientInfo: {
          id: currentUserId,
          name: currentUserName,
          image: currentUserImage || "",
          email,
        },
        client_info: {
          id: currentUserId,
          name: currentUserName,
          image: currentUserImage || "",
          email,
        },
        status: "active",
        last_message: "",
        last_message_time: null,
      };
    }
    return undefined;
  }, [
    rooms,
    selectedRoomId,
    deferProvisionActive,
    orderIdFromUrl,
    currentUserId,
    currentUserName,
    currentUserImage,
    currentUserEmail,
  ]);

  const roomStatusDisplay = useMemo(() => {
    return roomInfo?.status || selectedRoom?.status || "active";
  }, [roomInfo?.status, selectedRoom?.status]);

  const otherParticipantName = useMemo(() => {
    if (!selectedRoom) return "";
    const ci = selectedRoom.clientInfo ?? selectedRoom.client_info;
    if (isAuthenticator) return ci?.name || "Client";
    return selectedRoom.authenticators?.[0]?.name || "Authenticator";
  }, [selectedRoom, isAuthenticator]);

  const otherParticipantImage = useMemo(() => {
    if (!selectedRoom) return "";
    const ci = selectedRoom.clientInfo ?? selectedRoom.client_info;
    if (isAuthenticator) return resolveImageUrl(ci?.image || "");
    // For clients: prefer the root-level image (query photo set by authenticator), fall back to authenticator profile pic
    const rootImage = resolveImageUrl(selectedRoom.image || "");
    return rootImage || resolveImageUrl(selectedRoom.authenticators?.[0]?.image || "");
  }, [selectedRoom, isAuthenticator]);

  /** Recents documents are keyed by participant email */
  const getParticipantEmails = useCallback(() => {
    if (!selectedRoom) return [];
    const seen = new Set();
    const list = [];
    const ci = selectedRoom.clientInfo ?? selectedRoom.client_info;
    const ce = ci?.email?.trim();
    if (ce) {
      seen.add(ce.toLowerCase());
      list.push({ email: ce });
    }
    (selectedRoom.authenticators || []).forEach((a) => {
      const e = a.email?.trim();
      if (e && !seen.has(e.toLowerCase())) {
        seen.add(e.toLowerCase());
        list.push({ email: e });
      }
    });
    return list;
  }, [selectedRoom]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text && !attachedFile) return;
    if (!currentUserId || !currentUserEmail?.trim()) {
      console.error("Cannot send: user must be signed in with email.");
      return;
    }

    const canSend =
      selectedRoomId ||
      (deferProvisionActive && orderIdFromUrl && !isAuthenticator);
    if (!canSend) return;

    setSending(true);
    const fileToSend = attachedFile;
    // Clear input immediately to prevent accidental double-send taps.
    setDraft("");
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      let roomIdForSend = selectedRoomId;

      if (deferProvisionActive) {
        const clientInfo = {
          id: currentUserId,
          name: currentUserName,
          image: currentUserImage || "",
          email: currentUserEmail.trim(),
        };
        const oid = orderIdFromUrl || selectedRoom?.orderId || "";
        if (!oid) {
          alert("Missing order for this chat.");
          return;
        }
        roomIdForSend = await provisionExpeditedRoomBeforeFirstMessage({
          firebaseChatId: selectedRoomId || "",
          orderId: oid,
          clientInfo,
          authenticatorInfo: null,
          image: imageFromUrl || "",
        });
        setSelectedRoomId(roomIdForSend);
        setSearchParams(
          (prev) => {
            const p = new URLSearchParams(prev);
            p.set("room", roomIdForSend);
            p.set("orderId", oid);
            p.delete("deferProvision");
            return p;
          },
          { replace: true },
        );
      }

      if (!roomIdForSend) return;

      let mediaUrl = null;
      let isMedia = false;

      if (fileToSend) {
        setUploadingMedia(true);
        try {
          mediaUrl = await uploadChatMedia(roomIdForSend, fileToSend);
        } finally {
          setUploadingMedia(false);
        }
        isMedia = true;
      }

      const participantEmailsList = (() => {
        const out = [...getParticipantEmails()];
        const seen = new Set(
          out.map((x) => (x.email || "").trim().toLowerCase()).filter(Boolean),
        );
        const pushEmail = (raw) => {
          const e = (raw || "").trim();
          if (!e) return;
          const k = e.toLowerCase();
          if (seen.has(k)) return;
          seen.add(k);
          out.push({ email: e });
        };
        for (const a of selectedRoom?.authenticators || []) {
          pushEmail(a?.email);
        }
        const ci = selectedRoom?.clientInfo ?? selectedRoom?.client_info;
        pushEmail(ci?.email);
        pushEmail(currentUserEmail);
        for (const m of messages) {
          if (m.type === "system" || String(m.senderId) === "system") continue;
          pushEmail(m.senderEmail);
        }
        return out;
      })();

      await sendMessage(
        roomIdForSend,
        {
          message: text || (isMedia ? "" : ""),
          senderId: currentUserId,
          senderEmail: currentUserEmail,
          is_media: isMedia,
          media_url: mediaUrl,
          ...(isAuthenticator
            ? {
                authenticatorSelf: {
                  id: currentUserId,
                  name: currentUserName,
                  image: currentUserImage || "",
                  email: currentUserEmail.trim(),
                },
              }
            : {
                clientInfo: {
                  id: currentUserId,
                  name: currentUserName,
                  image: currentUserImage || "",
                  email: currentUserEmail.trim(),
                },
              }),
        },
        participantEmailsList,
      );

      const authenticatorIds = (selectedRoom?.authenticators || [])
        .map((a) => a.id)
        .filter(Boolean);
      sendMessageNotification({
        roomId: roomIdForSend,
        authenticatorIds,
        token: localStorage.getItem("authToken"),
      }).catch((err) => {
        console.warn("Message notification failed:", err);
      });

    } catch (err) {
      console.error("Failed to send message:", err);
      // Restore draft on failure so user can retry quickly.
      setDraft(text);
      setAttachedFile(fileToSend);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateRoom = async ({ orderId, clientInfo, queryImage }) => {
    setCreatingRoom(true);
    try {
      const clientEmail = clientInfo.email?.trim();
      if (!clientEmail) {
        alert("Client email is required to create a chat.");
        setCreatingRoom(false);
        return;
      }
      const exists = await roomExistsForOrder(orderId, clientEmail);
      if (exists) {
        alert(`A chat room already exists for order #${orderId}`);
        setCreatingRoom(false);
        return;
      }

      if (!currentUserEmail?.trim()) {
        alert("Your account must have an email to create expedited chat.");
        setCreatingRoom(false);
        return;
      }
      const authenticatorInfo = {
        id: currentUserId,
        name: currentUserName,
        image: currentUserImage,
        email: currentUserEmail.trim(),
      };
      const roomId = await createRoom(orderId, clientInfo, authenticatorInfo, queryImage || "");
      setShowCreateModal(false);
      selectRoom(roomId);
    } catch (err) {
      console.error("Failed to create room:", err);
      alert("Failed to create room. Please try again.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleTextareaInput = (e) => {
    setDraft(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const conversationActive =
    !!selectedRoomId || (!!deferProvisionActive && !!orderIdFromUrl);

  const showSidebar = isDesktop || !conversationActive;
  const showConversation = isDesktop || conversationActive;

  // --------------- RENDER ---------------

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: `calc(100dvh - ${headerHeight}px)` }}
    >
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* ---- Sidebar ---- */}
        {showSidebar && (
          <aside
            className={`flex flex-col border-r border-gray-200 bg-white min-h-0 ${
              isDesktop ? "w-[380px] min-w-[320px]" : "w-full"
            }`}
          >
            {/* Sidebar Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: "#3C1F1B" }}
            >
              <div>
                <h1 className="text-lg font-bold text-white">Expedited Chat</h1>
              </div>
              {isAuthenticator && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <FiPlus size={16} />
                  New Room
                </button>
              )}
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name or order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-[#3C1F1B]/20 focus:border-[#3C1F1B] outline-none transition-all"
                />
              </div>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto">
              {loadingRooms && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <span className="block w-7 h-7 border-[3px] border-gray-200 border-t-[#3C1F1B] rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">
                    Loading conversations...
                  </p>
                </div>
              )}
              {!loadingRooms && filteredRooms.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
                  <p className="text-sm">
                    {rooms.length === 0
                      ? "No conversations yet"
                      : "No results found"}
                  </p>
                </div>
              )}
              {filteredRooms.map((room) => {
                const isActive = room.roomId === selectedRoomId;
                const ci = room.clientInfo ?? room.client_info;
                const displayName = isAuthenticator
                  ? ci?.name || "Client"
                  : `Order #${room.orderId || "—"}`;
                const displayImage = isAuthenticator
                  ? resolveImageUrl(ci?.image || "")
                  : resolveImageUrl(room.image || "") || resolveImageUrl(room.authenticators?.[0]?.image || "");

                return (
                  <button
                    key={room.roomId}
                    onClick={() => selectRoom(room.roomId)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 ${
                      isActive ? "bg-[#3C1F1B]/5" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Avatar */}
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={displayName}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
                        style={{ background: "#3C1F1B" }}
                      >
                        {initials(displayName)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm truncate ${
                            !room.is_seen
                              ? "font-bold text-gray-900"
                              : "font-medium text-gray-800"
                          }`}
                        >
                          {displayName}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-2 flex-shrink-0">
                          {formatTime(room.last_message_time)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-gray-500 truncate">
                          {room.last_message || "No messages yet"}
                        </p>
                        {!room.is_seen && (
                          <span
                            className="ml-2 flex-shrink-0 w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: "#3C1F1B" }}
                            title="Unread"
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {isAuthenticator && `Order #${room.orderId}`}
                        {room.status && room.status !== "active" && (
                          <span className={`${isAuthenticator ? "ml-1.5" : ""} uppercase tracking-wide font-semibold text-amber-600`}>
                            {room.status}
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ---- Conversation Area ---- */}
        {showConversation && (
          <main className="flex flex-col flex-1 bg-[#F5F5F0] min-w-0 min-h-0 relative">
            {!conversationActive ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm font-medium">
                  Select a conversation to start chatting
                </p>
              </div>
            ) : (
              <>
                {/* Conversation Header */}
                <div
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white"
                  style={{ minHeight: 60 }}
                >
                  {!isDesktop && (
                    <button
                      onClick={() => selectRoom(null)}
                      className="text-gray-600 hover:text-gray-900 mr-1"
                    >
                      <FiChevronLeft size={22} />
                    </button>
                  )}

                  {otherParticipantImage ? (
                    <img
                      src={otherParticipantImage}
                      alt={otherParticipantName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: "#3C1F1B" }}
                    >
                      {initials(otherParticipantName)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {isAuthenticator && (
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {otherParticipantName}
                      </p>
                    )}
                    <p className={`truncate ${isAuthenticator ? "text-xs text-gray-500" : "text-sm font-semibold text-gray-900"}`}>
                      Order #{selectedRoom?.orderId}
                      {roomStatusDisplay && (
                        <span
                          className={`ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                            roomStatusDisplay === "active"
                              ? "bg-green-100 text-green-700"
                              : roomStatusDisplay === "resolved"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {roomStatusDisplay}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Status controls for authenticator */}
                  {isAuthenticator && roomStatusDisplay === "active" && (
                    <button
                      onClick={async () => {
                        try {
                          await updateRoomStatus(
                            selectedRoomId,
                            "resolved",
                            getParticipantEmails(),
                          );
                          setRoomInfo((prev) =>
                            prev ? { ...prev, status: "resolved" } : prev,
                          );
                        } catch (err) {
                          console.error("Failed to update status:", err);
                        }
                      }}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
                >
                  {loadingMessages && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <span className="block w-6 h-6 border-[3px] border-gray-200 border-t-[#3C1F1B] rounded-full animate-spin" />
                      <p className="text-xs text-gray-400">
                        Loading messages...
                      </p>
                    </div>
                  )}
                  {!loadingMessages && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-6">
                      <p className="text-sm">
                        No messages yet. Say hi to get the conversation started.
                      </p>
                    </div>
                  )}
                  {(() => {
                    const lastMyMsgIdx = !isAuthenticator
                      ? messages.reduce((last, m, i) => {
                          const sys = m.type === "system" || String(m.senderId) === "system";
                          return !sys && String(m.senderId) === String(currentUserId) ? i : last;
                        }, -1)
                      : -1;
                    return messages.map((msg, idx) => {
                      const isMe =
                        !!currentUserId &&
                        String(msg.senderId) === String(currentUserId);
                      const isSystem =
                        msg.type === "system" || msg.senderId === "system";
                      const prev = messages[idx - 1];
                      const showDayDivider =
                        !prev || dayKey(prev.time) !== dayKey(msg.time);
                      const showSeenBadge =
                        idx === lastMyMsgIdx && authenticatorSeen;

                      const senderId = String(msg.senderId || "");
                      const senderName = (() => {
                        if (!senderId || senderId === "system") return "";
                        const auth = (selectedRoom?.authenticators || []).find(
                          (a) => String(a.id) === senderId,
                        );
                        if (auth?.name) return auth.name;
                        const ci =
                          selectedRoom?.clientInfo ?? selectedRoom?.client_info;
                        if (ci && String(ci.id) === senderId)
                          return ci.name || "";
                        if (senderId === String(currentUserId))
                          return currentUserName;
                        return "";
                      })();

                      return (
                        <div key={msg.id}>
                          {showDayDivider && (
                            <div className="flex justify-center my-3">
                              <span className="text-[11px] font-medium text-gray-500 bg-white/90 border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                                {formatDayLabel(msg.time)}
                              </span>
                            </div>
                          )}

                          {isSystem ? (
                            <div className="flex justify-center">
                              <span className="text-[11px] text-gray-500 bg-white/80 px-3 py-1 rounded-full">
                                {msg.message}
                              </span>
                            </div>
                          ) : (
                            <div
                              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`flex flex-col max-w-[75%]`}>
                                <div
                                  className={`rounded-lg px-3 py-2 w-full ${
                                    isMe
                                      ? "text-white"
                                      : "bg-white text-gray-900 shadow-sm border border-gray-100"
                                  }`}
                                  style={
                                    isMe ? { background: "#3C1F1B" } : undefined
                                  }
                                >
                                  {senderName && (
                                    <p
                                      className={`text-[11px] font-bold tracking-wide mb-1 ${
                                        isMe
                                          ? "text-white/70"
                                          : "text-[#3C1F1B]"
                                      }`}
                                    >
                                      {senderName}
                                    </p>
                                  )}
                                  {msg.is_media && msg.media_url && (
                                    <button
                                      onClick={() => setLightboxSrc(resolveImageUrl(msg.media_url))}
                                      className="block mb-1.5"
                                    >
                                      <img
                                        src={resolveImageUrl(msg.media_url)}
                                        alt="Shared media"
                                        className="max-w-full max-h-48 rounded object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                      />
                                    </button>
                                  )}
                                  {msg.message && (
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                      {msg.message}
                                    </p>
                                  )}
                                  <p
                                    className={`text-[10px] mt-1 text-right ${
                                      isMe ? "text-white/50" : "text-gray-400"
                                    }`}
                                  >
                                    {formatFullTime(msg.time)}
                                  </p>
                                </div>
                                {showSeenBadge && (
                                  <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-300 px-2 py-0.5 rounded mt-0.5 self-end">
                                    Seen
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                  <div ref={messagesEndRef} />
                </div>

                {/* Floating "scroll to bottom" pill */}
                {showScrollToBottom && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute right-5 bottom-[92px] w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all"
                    aria-label="Scroll to latest message"
                  >
                    <FiArrowDown size={18} />
                  </button>
                )}

                {/* Closed / resolved status banner */}
                {roomStatusDisplay && roomStatusDisplay !== "active" && (
                  <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        roomStatusDisplay === "resolved"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {roomStatusDisplay}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      This conversation is {roomStatusDisplay} and no longer accepts new messages.
                    </p>
                  </div>
                )}

                {/* Input Bar */}
                {roomStatusDisplay === "active" && (
                  <div className="bg-white border-t border-gray-200 px-4 py-3">
                    {attachedFile && (
                      <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
                        <FiImage size={16} className="text-gray-400" />
                        <span className="truncate flex-1">
                          {attachedFile.name}
                        </span>
                        <button
                          onClick={() => setAttachedFile(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    )}
                    {uploadingMedia && (
                      <div className="flex items-center gap-2 mb-2 bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-600">
                        <span className="block w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
                        <span>Uploading media...</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-gray-600 p-2 transition-colors flex-shrink-0"
                      >
                        <FiPaperclip size={20} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setAttachedFile(e.target.files[0]);
                          }
                          e.target.value = "";
                        }}
                      />
                      <textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 resize-none rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3C1F1B]/20 focus:border-[#3C1F1B] outline-none transition-all"
                        style={{ maxHeight: 120 }}
                      />
                      <button
                        onClick={handleSend}
                        disabled={sending || (!draft.trim() && !attachedFile)}
                        className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 flex-shrink-0 mr-1"
                        style={{ background: "#3C1F1B" }}
                      >
                        <FiSend size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRoom}
          loading={creatingRoom}
        />
      )}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}
