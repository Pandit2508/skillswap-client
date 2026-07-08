import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { BASE_URL } from "../api/auth";
import { useAuth } from "../context/AuthContext";

// BASE_URL is the REST API base (".../api"); the socket server listens
// on the same host but without the /api suffix.
const SOCKET_URL = BASE_URL.replace(/\/api\/?$/, "");

/**
 * Connects to the backend's Socket.io server once a user is
 * authenticated, and surfaces real-time match-request events as
 * toasts. Reuses the existing httpOnly auth cookie for the socket
 * handshake (withCredentials), so no separate token handling is
 * needed on the client.
 */
export const useSocketNotifications = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err) => {
      // Non-fatal: the app works fine without real-time updates,
      // this just means the user won't get instant notifications
      // until the next reconnect attempt succeeds.
      console.warn("Socket connection failed:", err.message);
    });

    socket.on("new_match_request", (payload) => {
      setLastEvent({ type: "new_match_request", payload });
      toast.success(
        `${payload.sender?.name || "Someone"} sent you a skill swap request!`
      );
    });

    socket.on("match_request_accepted", (payload) => {
      setLastEvent({ type: "match_request_accepted", payload });
      toast.success("Your match request was accepted! Check your meetings.");
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return { connected, lastEvent };
};
