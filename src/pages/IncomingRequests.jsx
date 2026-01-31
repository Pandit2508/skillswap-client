import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getIncomingRequests,
  acceptMatchRequest,
  rejectMatchRequest,
} from "../api/auth";
import Button from "../components/ui/Button";

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingWindow, setMeetingWindow] = useState(null);

  const navigate = useNavigate();

  /* ================= FETCH REQUESTS ================= */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getIncomingRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch incoming requests", err);
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  /* ================= TIME CHECK ================= */
  const canOpenMeeting = (start, end) => {
    const now = new Date();
    return now >= start && now <= end;
  };

  /* ================= GET NEXT DATE FOR DAY ================= */
  const getNextDateForDay = (dayName) => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const today = new Date();
    const targetDay = days.indexOf(dayName.toLowerCase());

    let diff = targetDay - today.getDay();
    if (diff < 0) diff += 7;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);

    return nextDate.toDateString();
  };

  /* ================= ACTION HANDLERS ================= */
  const handleAccept = async (req) => {
    try {
      const res = await acceptMatchRequest(req.requestId);

      const meetingLink = res?.data?.meetingLink;
      const slot = res?.data?.slot;

      if (!meetingLink || !slot) {
        alert(res?.response?.data?.error || "Meeting not scheduled");
        return;
      }

      const meetingDate = getNextDateForDay(slot.day);

      const start = new Date(`${meetingDate} ${slot.start_time}`);
      const end = new Date(`${meetingDate} ${slot.end_time}`);

      setMeetingWindow({
        link: meetingLink,
        start,
        end,
      });

      setRequests((prev) =>
        prev.filter((r) => r.requestId !== req.requestId)
      );

      alert("Meeting scheduled successfully!");
      navigate("/meetings");

    } catch (err) {
      alert(err.response?.data?.error || "Failed to accept request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectMatchRequest(id);
      setRequests((prev) => prev.filter((r) => r.requestId !== id));
    } catch {
      alert("Failed to reject request");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading incoming requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Incoming Match Requests
        </h1>

        {/* ⭐ View Meetings Button */}
        <Button
          className="mb-6 bg-purple-600 hover:bg-purple-700"
          onClick={() => navigate("/meetings")}
        >
          View Upcoming Meetings
        </Button>

        {requests.length === 0 ? (
          <p className="text-gray-400">
            You have no pending match requests.
          </p>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => {
              const { sender } = req;

              return (
                <div
                  key={req.requestId}
                  className="bg-[#1e293b] p-6 rounded-2xl shadow-lg"
                >
                  {/* HEADER */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        sender.avatar_url ||
                        `https://i.pravatar.cc/150?u=${sender.id}`
                      }
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>
                      <h2 className="text-xl font-semibold">
                        {sender.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Requested on{" "}
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* PROFILE DETAILS */}
                  <div className="text-sm text-gray-300 space-y-2">
                    {sender.bio && (
                      <p>
                        <span className="font-medium text-gray-200">
                          Bio:
                        </span>{" "}
                        {sender.bio}
                      </p>
                    )}

                    <p>
                      <span className="font-medium text-gray-200">
                        Location:
                      </span>{" "}
                      {sender.location || "Not specified"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-200">
                        Experience:
                      </span>{" "}
                      {sender.experience || "Not specified"}
                    </p>

                    {/* AVAILABILITY */}
                    <div>
                      <span className="font-medium text-gray-200">
                        Availability:
                      </span>
                      {sender.availability?.length ? (
                        <ul className="list-disc ml-5 mt-1">
                          {sender.availability.map((a, i) => (
                            <li key={i}>
                              {a.day} — {a.start_time} to {a.end_time}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="ml-5 text-gray-400">
                          Not specified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4 mt-6">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleAccept(req)}
                    >
                      Accept
                    </Button>

                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleReject(req.requestId)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* JOIN MEETING BUTTON */}
        {meetingWindow && (
          <div className="mt-10 text-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (
                  canOpenMeeting(
                    meetingWindow.start,
                    meetingWindow.end
                  )
                ) {
                  window.open(meetingWindow.link, "_blank");
                } else {
                  alert("Meeting is not active right now.");
                }
              }}
            >
              Join Scheduled Meeting
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;
