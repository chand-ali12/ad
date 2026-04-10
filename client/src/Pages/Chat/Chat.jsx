import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiX,
} from "react-icons/fi";

const DUMMY_CHATS = [
  {
    id: "support",
    title: "Support Team",
    subtitle: "Authentic Detective",
    lastMessage: "Hi! How can we help you with your authentication today?",
    time: "2:39 AM",
    unread: 1,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Hi! How can we help you with your authentication today?",
        time: "2:38 AM",
      },
      {
        id: "m2",
        from: "me",
        text: "I have a question about my certificate.",
        time: "2:38 AM",
      },
      {
        id: "m3",
        from: "them",
        text: "Sure—share your order number and we’ll look it up.",
        time: "2:39 AM",
      },
    ],
  },
  {
    id: "sarah",
    title: "Sarah M.",
    subtitle: "Not right now, thanks!",
    lastMessage: "Not right now, thanks!",
    time: "1:06 AM",
    unread: 0,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Thanks for the quick verification on my order.",
        time: "1:02 AM",
      },
      {
        id: "m2",
        from: "me",
        text: "Glad we could help. Anything else you need?",
        time: "1:04 AM",
      },
      {
        id: "m3",
        from: "them",
        text: "Not right now, thanks!",
        time: "1:06 AM",
      },
    ],
  },
  {
    id: "james",
    title: "James K.",
    subtitle: "It’s under review. We’ll email you…",
    lastMessage: "When will my certificate be ready?",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "When will my certificate be ready?",
        time: "Yesterday",
      },
      {
        id: "m2",
        from: "me",
        text: "It’s under review. We’ll email you within 24 hours.",
        time: "Yesterday",
      },
    ],
  },
];

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase?.() || "")
    .join("");
}

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState(
    DUMMY_CHATS[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : true,
  );

  const fileInputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia?.("(min-width: 1024px)");
    if (!mq) return;
    const onChange = (e) => setIsDesktop(e.matches);
    onChange(mq);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const chats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DUMMY_CHATS;
    return DUMMY_CHATS.filter((c) => {
      const hay =
        `${c.title} ${c.subtitle ?? ""} ${c.lastMessage ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search]);

  const activeChat = useMemo(
    () => DUMMY_CHATS.find((c) => c.id === selectedChatId) ?? null,
    [selectedChatId],
  );

  const [messages, setMessages] = useState(() => activeChat?.messages ?? []);

  useEffect(() => {
    setMessages(activeChat?.messages ?? []);
    setDraft("");
    setAttachedFile(null);
    // Scroll to bottom when opening a chat
    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text && !attachedFile) return;

    const newMsg = {
      id: `local-${Date.now()}`,
      from: "me",
      text: text || (attachedFile ? `Sent a file: ${attachedFile.name}` : ""),
      time: "Now",
      attachmentName: attachedFile?.name ?? null,
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
    setAttachedFile(null);

    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
  };

  const onDraftKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Layout: WhatsApp-style split view on desktop; list <-> conversation on mobile.
  const showSidebar = isDesktop || !selectedChatId;
  const showConversation = isDesktop || !!selectedChatId;

  return (
    <div
      className="w-full bg-[#F5F5F0] px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: "80px",
        overflow: "hidden",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div
        className="w-full max-w-[1200px] mx-auto h-full flex flex-col"
        style={{ height: "calc(100dvh - 80px)" }}
      >
        <div className="h-full bg-secondary border border-primary/10 shadow-sm rounded-none overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-[360px_1fr]">
            {/* Sidebar */}
            {showSidebar && (
              <div className="h-full flex flex-col border-r border-primary/10 min-h-0">
                <div className="bg-primary text-secondary px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      AD
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-tight truncate">
                        Chat
                      </div>
                      <div className="text-xs text-secondary/80 truncate">
                        Your conversations
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-3 border-b border-primary/10 bg-secondary">
                  <div className="flex items-center gap-2 bg-[#F5F5F0] border border-primary/10 px-3 h-10 rounded-none">
                    <FiSearch className="w-4 h-4 text-primary/60" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search chats"
                      className="w-full bg-transparent text-sm text-primary placeholder:text-primary/50 focus:outline-none"
                      aria-label="Search chats"
                    />
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  {chats.map((c) => {
                    const isActive = c.id === selectedChatId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedChatId(c.id)}
                        className={`w-full text-left px-4 py-3 border-b border-primary/10 hover:bg-primary/5 active:bg-primary/10 transition-colors rounded-none ${
                          isActive ? "bg-primary/5" : "bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F5F5F0] border border-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                            {initials(c.title)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-sm text-primary truncate">
                                {c.title}
                              </div>
                              <div className="text-[11px] text-primary/60 flex-shrink-0">
                                {c.time}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <div className="text-xs text-primary/70 truncate">
                                {c.lastMessage}
                              </div>
                              {c.unread ? (
                                <span className="ml-2 text-[11px] bg-primary text-secondary px-2 py-0.5 rounded-full flex-shrink-0">
                                  {c.unread}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversation */}
            {showConversation && (
              <div className="h-full flex flex-col min-h-0">
                <div className="bg-primary text-secondary px-4 py-3 flex items-center gap-3">
                  {!isDesktop && (
                    <button
                      type="button"
                      onClick={() => setSelectedChatId(null)}
                      className="h-10 w-10 flex items-center justify-center hover:bg-secondary/10 active:bg-secondary/15 transition-colors rounded-none"
                      aria-label="Back"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {activeChat ? initials(activeChat.title) : "—"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-tight truncate">
                        {activeChat?.title ?? "Select a chat"}
                      </div>
                      <div className="text-xs text-secondary/80 truncate">
                        {activeChat?.subtitle ?? "Authentic Detective"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  ref={messagesRef}
                  className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 bg-[#F5F5F0]"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(60,31,27,0.05) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                >
                  <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
                    {messages.map((m) => {
                      const isMe = m.from === "me";
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 border border-primary/10 shadow-sm rounded-none ${
                              isMe
                                ? "bg-primary text-secondary"
                                : "bg-secondary text-primary"
                            }`}
                          >
                            {m.attachmentName ? (
                              <div
                                className={`text-xs mb-1 ${isMe ? "text-secondary/80" : "text-primary/60"}`}
                              >
                                Attachment: {m.attachmentName}
                              </div>
                            ) : null}
                            <div className="text-sm leading-relaxed break-words">
                              {m.text}
                            </div>
                            <div
                              className={`mt-1 text-[11px] ${isMe ? "text-secondary/70" : "text-primary/50"}`}
                            >
                              {m.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-primary/10 bg-secondary px-3 sm:px-5 py-3">
                  <div className="max-w-3xl mx-auto">
                    {attachedFile && (
                      <div className="mb-2 flex items-center justify-between gap-3 bg-[#F5F5F0] border border-primary/10 px-3 py-2 rounded-none">
                        <div className="min-w-0">
                          <div className="text-xs text-primary/60">
                            Selected file
                          </div>
                          <div className="text-sm font-medium text-primary truncate">
                            {attachedFile.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="p-2 !rounded-none hover:bg-primary/5 active:bg-primary/10 transition-colors text-primary/70"
                          aria-label="Remove attachment"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click?.()}
                        className="h-11 w-11 p-0 !rounded-none flex items-center justify-center hover:bg-primary/5 active:bg-primary/10 transition-colors text-primary/70"
                        aria-label="Attach"
                      >
                        <FiPaperclip className="w-5 h-5" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setAttachedFile(f);
                          e.target.value = "";
                        }}
                      />

                      <div className="flex-1 min-w-0 bg-[#F5F5F0] border border-primary/10 rounded-2xl h-11 px-3 flex items-center">
                        <textarea
                          rows={1}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={onDraftKeyDown}
                          placeholder="Type a message"
                          className="w-full h- resize-none overflow-hidden bg-transparent text-sm sm:text-[15px] text-primary placeholder:text-primary/50 focus:outline-none leading-6"
                          aria-label="Message"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={sendMessage}
                        className="h-11 w-11 p-0 rounded-2xl bg-primary text-secondary hover:bg-primary-hover active:opacity-90 transition-colors flex items-center justify-center"
                        aria-label="Send"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
