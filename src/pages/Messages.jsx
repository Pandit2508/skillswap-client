import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
} from "../api/auth";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDay = (iso) => {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return "Today";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const Messages = () => {
  const { userId } = useParams(); // active conversation partner, as a string
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const activeId = userId ? Number(userId) : null;
  const activeConversation = conversations.find((c) => c.user.id === activeId);

  /* ================= LOAD CONVERSATION LIST ================= */
  const loadConversations = useCallback(async () => {
    try {
      const res = await getConversations();
      setConversations(res.data || []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ================= LOAD ACTIVE THREAD ================= */
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    let mounted = true;
    setLoadingMessages(true);
    setError(null);

    getMessages(activeId)
      .then((res) => {
        if (mounted) setMessages(res.data || []);
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.response?.data?.error || "Failed to load this conversation"
          );
        }
      })
      .finally(() => {
        if (mounted) setLoadingMessages(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeId]);

  /* ================= LIVE MESSAGE UPDATES ================= */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      const otherParty = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;

      // Append to the open thread if it belongs to it.
      if (otherParty === activeId) {
        setMessages((prev) => [...prev, msg]);
      }

      // Always refresh the conversation list (last message / unread count).
      loadConversations();
    };

    const handleTyping = ({ from }) => {
      if (from === activeId) setOtherTyping(true);
    };
    const handleStopTyping = ({ from }) => {
      if (from === activeId) setOtherTyping(false);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, activeId, user?.id, loadConversations]);

  // Typing indicator resets whenever the thread changes.
  useEffect(() => {
    setOtherTyping(false);
  }, [activeId]);

  /* ================= TYPING EMIT ================= */
  const handleDraftChange = (value) => {
    setDraft(value);
    if (!socket || !activeId) return;

    socket.emit("typing", { to: activeId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { to: activeId });
    }, 1500);
  };

  /* ================= SEND ================= */
  const handleSend = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !activeId || sending) return;

    setSending(true);
    setDraft("");
    if (socket) socket.emit("stop_typing", { to: activeId });

    try {
      const res = await sendMessageApi(activeId, content);
      // The socket echo will also deliver this, but adding it straight
      // away keeps the UI snappy even if the socket round-trip lags.
      setMessages((prev) => {
        if (prev.some((m) => m.id === res.data.message.id)) return prev;
        return [...prev, res.data.message];
      });
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message");
      setDraft(content); // give it back so the user doesn't lose their text
    } finally {
      setSending(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col py-10 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Button
            className="bg-slate-700 hover:bg-slate-600"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row gap-6 min-h-[70vh]">
          {/* CONVERSATION LIST */}
          <div className="sm:w-80 bg-[#1e293b] rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-700 font-semibold">
              Conversations
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <p className="p-5 text-gray-400 text-sm">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="p-5 text-gray-400 text-sm">
                  No conversations yet. Once you accept a match request,
                  you'll be able to message that person here.
                </p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.user.id}
                    onClick={() => navigate(`/messages/${c.user.id}`)}
                    className={`w-full text-left px-5 py-4 border-b border-slate-800 hover:bg-slate-800 transition flex items-center gap-3 ${
                      activeId === c.user.id ? "bg-slate-800" : ""
                    }`}
                  >
                    <img
                      src={
                        c.user.avatar_url ||
                        `https://i.pravatar.cc/150?u=${c.user.id}`
                      }
                      alt=""
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">{c.user.name}</span>
                        {c.unreadCount > 0 && (
                          <span className="bg-purple-600 text-xs rounded-full px-2 py-0.5 flex-shrink-0">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {c.lastMessage
                          ? c.lastMessage.content
                          : "Say hello 👋"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ACTIVE THREAD */}
          <div className="flex-1 bg-[#1e293b] rounded-2xl shadow-lg flex flex-col overflow-hidden">
            {!activeId ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-3">
                  <img
                    src={
                      activeConversation?.user.avatar_url ||
                      `https://i.pravatar.cc/150?u=${activeId}`
                    }
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">
                      {activeConversation?.user.name || "Conversation"}
                    </div>
                    {otherTyping && (
                      <div className="text-xs text-purple-400">typing…</div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {loadingMessages ? (
                    <p className="text-gray-400 text-sm">Loading messages...</p>
                  ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                  ) : messages.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No messages yet — say hello!
                    </p>
                  ) : (
                    messages.map((m, i) => {
                      const isMine = m.sender_id === user?.id;
                      const showDay =
                        i === 0 ||
                        formatDay(m.created_at) !==
                          formatDay(messages[i - 1].created_at);

                      return (
                        <div key={m.id}>
                          {showDay && (
                            <div className="text-center text-xs text-gray-500 my-3">
                              {formatDay(m.created_at)}
                            </div>
                          )}
                          <div
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                isMine
                                  ? "bg-purple-600 text-white rounded-br-sm"
                                  : "bg-slate-700 text-gray-100 rounded-bl-sm"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {m.content}
                              </p>
                              <p
                                className={`text-[10px] mt-1 ${
                                  isMine ? "text-purple-200" : "text-gray-400"
                                }`}
                              >
                                {formatTime(m.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-slate-700 flex gap-3"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => handleDraftChange(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={2000}
                    className="flex-1 p-3 rounded-md text-black"
                  />
                  <Button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
