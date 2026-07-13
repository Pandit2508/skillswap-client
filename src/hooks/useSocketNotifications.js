import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

/**
 * Surfaces real-time events (match requests, acceptances, new chat
 * messages) as toasts. Listens on the single shared socket from
 * SocketContext rather than opening its own connection.
 */
export const useSocketNotifications = () => {
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (payload) => {
      setLastEvent({ type: "new_match_request", payload });
      toast.success(
        `${payload.sender?.name || "Someone"} sent you a skill swap request!`
      );
    };

    const handleAccepted = (payload) => {
      setLastEvent({ type: "match_request_accepted", payload });
      toast.success("Your match request was accepted! Check your meetings.");
    };

    const handleNewMessage = (payload) => {
      setLastEvent({ type: "new_message", payload });

      // Don't toast messages the user just sent themselves, and don't
      // toast while they're already looking at that exact thread.
      const isMine = payload.sender_id === user?.id;
      const onThisThread =
        window.location.pathname === `/messages/${payload.sender_id}`;

      if (!isMine && !onThisThread) {
        toast(`💬 New message: ${payload.content.slice(0, 60)}`);
      }
    };

    socket.on("new_match_request", handleNewRequest);
    socket.on("match_request_accepted", handleAccepted);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_match_request", handleNewRequest);
      socket.off("match_request_accepted", handleAccepted);
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, user?.id]);

  return { connected, lastEvent };
};
