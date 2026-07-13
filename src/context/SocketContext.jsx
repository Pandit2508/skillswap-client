import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../api/auth";
import { useAuth } from "./AuthContext";

// BASE_URL is the REST API base (".../api"); the socket server listens
// on the same host but without the /api suffix.
const SOCKET_URL = BASE_URL.replace(/\/api\/?$/, "");

const SocketContext = createContext({ socket: null, connected: false });

/**
 * Owns the single Socket.io connection for the whole app. Both the
 * match-request/notification toasts and the chat page listen off this
 * same socket instead of each opening their own connection.
 */
export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", (err) => {
      // Non-fatal: the app works fine without real-time updates, this
      // just means notifications/chat won't be instant until the next
      // reconnect attempt succeeds.
      console.warn("Socket connection failed:", err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
