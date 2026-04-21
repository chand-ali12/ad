import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiX,
} from "react-icons/fi";

const CHATBOT_LOGO = "/assets/images/header-logo.png";

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
        text: "Sure—share your order number and we'll look it up.",
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
    subtitle: "It's under review. We'll email you…",
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
        text: "It's under review. We'll email you within 24 hours.",
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
    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
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

  const showSidebar = isDesktop || !selectedChatId;
  const showConversation = isDesktop || !!selectedChatId;

  return (
    <>
      <style>{`
        /*
         * iOS Safari fix strategy:
         * - Use 100dvh (dynamic viewport height) which shrinks/grows with Safari's
         *   collapsing toolbar — supported since iOS 15.4.
         * - Fall back to 100vh for older browsers.
         * - Use env(safe-area-inset-*) to pad away from notch, home indicator,
         *   and Safari's bottom toolbar.
         * - The chat shell uses display:flex + flex:1 + min-height:0 throughout
         *   so the messages area gets all remaining space and the input bar is
         *   always visible above Safari chrome.
         */

        .chat-root {
          /* Fill the layout slot provided by the parent page.
             Do NOT use position:fixed here — that breaks when the
             component is nested inside a page that already has a header. */
          display: flex;
          flex-direction: column;
          /* dvh = dynamic viewport height, accounts for Safari's collapsing toolbar */
          height: 100dvh;
          /* Fallback for browsers without dvh support (iOS < 15.4) */
          height: 100vh;
          /* Give the root itself the safe-area padding so nothing is clipped */
          padding-top: env(safe-area-inset-top, 0px);
          padding-left: env(safe-area-inset-left, 0px);
          padding-right: env(safe-area-inset-right, 0px);
          /* Bottom safe area is handled by .input-bar so messages scroll to edge */
          box-sizing: border-box;
          background: #F5F5F0;
          font-family: Montserrat, sans-serif;
          overflow: hidden;
        }

        .chat-inner {
          flex: 1;
          min-height: 0;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          padding: 0 12px;
          box-sizing: border-box;
        }
        @media (min-width: 640px)  { .chat-inner { padding: 0 16px; } }
        @media (min-width: 768px)  { .chat-inner { padding: 0 24px; } }
        @media (min-width: 1024px) { .chat-inner { padding: 0 32px; } }

        .chat-shell {
          flex: 1;
          min-height: 0;
          background: white;
          border: 1px solid rgba(60,31,27,0.10);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
        }

        .chat-grid {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .chat-grid { grid-template-columns: 360px 1fr; }
        }

        /* ── Sidebar ── */
        .sidebar {
          display: flex;
          flex-direction: column;
          min-height: 0;
          border-right: 1px solid rgba(60,31,27,0.10);
          overflow: hidden;
        }
        .sidebar-list {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        /* ── Conversation column ── */
        .conversation {
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }

        .messages-area {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-behavior: smooth;
          padding: 16px;
        }
        @media (min-width: 640px) {
          .messages-area { padding: 16px 24px; }
        }

        /*
         * Input bar — the critical piece for iOS Safari.
         *
         * Safari's bottom toolbar sits ~83px above the physical bottom edge
         * (varies by device). env(safe-area-inset-bottom) is the exact inset
         * Safari exposes for this region. Adding it to the bottom padding
         * ensures the input is never hidden underneath the toolbar.
         *
         * We do NOT use position:fixed or position:sticky here. Because the
         * whole layout is a flex column that fills dvh, this element naturally
         * stays at the bottom without any positioning tricks.
         */
        .input-bar {
          flex-shrink: 0;
          border-top: 1px solid rgba(60,31,27,0.10);
          background: white;
          padding: 12px 12px calc(12px + env(safe-area-inset-bottom, 0px));
          box-sizing: border-box;
        }
        @media (min-width: 640px) {
          .input-bar {
            padding: 12px 20px calc(12px + env(safe-area-inset-bottom, 0px));
          }
        }

        /*
         * Small-screen (phone) fix: mobile browser chrome (Safari's floating
         * toolbar, Chrome's address bar, etc.) tends to overlap the input bar.
         * On any phone-sized screen, add extra bottom margin so the
         * "Type a message" input stays above the browser UI and fully tappable.
         */
        @media (max-width: 767px) {
          .input-bar {
            margin-bottom: 90px;
          }
        }

        /* Prevent iOS Safari from bumping font sizes on rotate */
        * { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
      `}</style>

      <div className="chat-root">
        <div className="chat-inner">
          <div className="chat-shell">
            <div className="chat-grid">
              {/* ── Sidebar ── */}
              {showSidebar && (
                <div className="sidebar">
                  {/* Header */}
                  <div
                    style={{
                      background: "var(--primary, #3C1F1B)",
                      color: "#fff",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={CHATBOT_LOGO}
                        alt="Authentic Detective"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: 4,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Chat
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          opacity: 0.8,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Your conversations
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid rgba(60,31,27,0.10)",
                      background: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#F5F5F0",
                        border: "1px solid rgba(60,31,27,0.10)",
                        padding: "0 12px",
                        height: 40,
                      }}
                    >
                      <FiSearch
                        style={{
                          width: 16,
                          height: 16,
                          color: "rgba(60,31,27,0.6)",
                          flexShrink: 0,
                        }}
                      />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search chats"
                        aria-label="Search chats"
                        style={{
                          flex: 1,
                          border: "none",
                          background: "transparent",
                          fontSize: 14,
                          color: "#3C1F1B",
                          outline: "none",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  {/* Chat list */}
                  <div className="sidebar-list">
                    {chats.map((c) => {
                      const isActive = c.id === selectedChatId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedChatId(c.id)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(60,31,27,0.10)",
                            background: isActive
                              ? "rgba(60,31,27,0.05)"
                              : "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "Montserrat, sans-serif",
                            transition: "background 0.15s",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: "#fff",
                                border: "1px solid rgba(60,31,27,0.10)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#3C1F1B",
                              }}
                            >
                              {c.id === "support" ? (
                                <img
                                  src={CHATBOT_LOGO}
                                  alt="Authentic Detective"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    padding: 4,
                                    boxSizing: "border-box",
                                  }}
                                />
                              ) : (
                                initials(c.title)
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: "#3C1F1B",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {c.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "rgba(60,31,27,0.6)",
                                    flexShrink: 0,
                                  }}
                                >
                                  {c.time}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: 8,
                                  alignItems: "center",
                                  marginTop: 2,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(60,31,27,0.7)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {c.lastMessage}
                                </div>
                                {c.unread ? (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      background: "#3C1F1B",
                                      color: "#fff",
                                      padding: "2px 8px",
                                      borderRadius: 999,
                                      flexShrink: 0,
                                    }}
                                  >
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

              {/* ── Conversation ── */}
              {showConversation && (
                <div className="conversation">
                  {/* Header */}
                  <div
                    style={{
                      background: "#3C1F1B",
                      color: "#fff",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    {!isDesktop && (
                      <button
                        type="button"
                        onClick={() => setSelectedChatId(null)}
                        aria-label="Back"
                        style={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#fff",
                          flexShrink: 0,
                          borderRadius: 0,
                        }}
                      >
                        <FiChevronLeft style={{ width: 20, height: 20 }} />
                      </button>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background:
                            activeChat?.id === "support"
                              ? "#fff"
                              : "rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {activeChat?.id === "support" ? (
                          <img
                            src={CHATBOT_LOGO}
                            alt="Authentic Detective"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: 4,
                              boxSizing: "border-box",
                            }}
                          />
                        ) : activeChat ? (
                          initials(activeChat.title)
                        ) : (
                          "—"
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {activeChat?.title ?? "Select a chat"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            opacity: 0.8,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {activeChat?.subtitle ?? "Authentic Detective"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesRef}
                    className="messages-area"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(60,31,27,0.05) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                      background: "#F5F5F0",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: 720,
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {messages.map((m) => {
                        const isMe = m.from === "me";
                        return (
                          <div
                            key={m.id}
                            style={{
                              display: "flex",
                              justifyContent: isMe ? "flex-end" : "flex-start",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "85%",
                                padding: "8px 12px",
                                border: "1px solid rgba(60,31,27,0.10)",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                background: isMe ? "#3C1F1B" : "#fff",
                                color: isMe ? "#fff" : "#3C1F1B",
                              }}
                            >
                              {m.attachmentName && (
                                <div
                                  style={{
                                    fontSize: 12,
                                    opacity: 0.75,
                                    marginBottom: 4,
                                  }}
                                >
                                  Attachment: {m.attachmentName}
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: 14,
                                  lineHeight: 1.5,
                                  wordBreak: "break-word",
                                }}
                              >
                                {m.text}
                              </div>
                              <div
                                style={{
                                  marginTop: 4,
                                  fontSize: 11,
                                  opacity: 0.7,
                                }}
                              >
                                {m.time}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="input-bar">
                    <div style={{ maxWidth: 720, margin: "0 auto" }}>
                      {attachedFile && (
                        <div
                          style={{
                            marginBottom: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            background: "#F5F5F0",
                            border: "1px solid rgba(60,31,27,0.10)",
                            padding: "8px 12px",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(60,31,27,0.6)",
                              }}
                            >
                              Selected file
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#3C1F1B",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {attachedFile.name}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachedFile(null)}
                            aria-label="Remove attachment"
                            style={{
                              padding: 8,
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: "rgba(60,31,27,0.7)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <FiX style={{ width: 16, height: 16 }} />
                          </button>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click?.()}
                          aria-label="Attach"
                          style={{
                            width: 44,
                            height: 44,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "rgba(60,31,27,0.7)",
                            flexShrink: 0,
                          }}
                        >
                          <FiPaperclip style={{ width: 20, height: 20 }} />
                        </button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setAttachedFile(f);
                            e.target.value = "";
                          }}
                        />

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            background: "#F5F5F0",
                            border: "1px solid rgba(60,31,27,0.10)",
                            borderRadius: 22,
                            height: 44,
                            padding: "0 14px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <textarea
                            rows={1}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={onDraftKeyDown}
                            placeholder="Type a message"
                            aria-label="Message"
                            style={{
                              width: "100%",
                              resize: "none",
                              overflow: "hidden",
                              background: "transparent",
                              border: "none",
                              outline: "none",
                              fontSize: 15,
                              color: "#3C1F1B",
                              fontFamily: "Montserrat, sans-serif",
                              lineHeight: "24px",
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={sendMessage}
                          aria-label="Send"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            flexShrink: 0,
                            background: "#3C1F1B",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                          }}
                        >
                          <FiSend style={{ width: 18, height: 18 }} />
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
    </>
  );
};

export default Chat;
