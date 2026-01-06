import { useEffect, useState } from "react";
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

  /* ================= ACTION HANDLERS ================= */
  const handleAccept = async (id) => {
    try {
      await acceptMatchRequest(id);
      setRequests((prev) => prev.filter((r) => r.requestId !== id));
    } catch {
      alert("Failed to accept request");
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
        <h1 className="text-3xl font-bold mb-6">
          Incoming Match Requests
        </h1>

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

                    <p>
                      <span className="font-medium text-gray-200">
                        Skills Offered:
                      </span>{" "}
                      {sender.skills?.length
                        ? sender.skills.join(", ")
                        : "Not specified"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-200">
                        Wants to Learn:
                      </span>{" "}
                      {sender.skills_wanted?.length
                        ? sender.skills_wanted.join(", ")
                        : "Not specified"}
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
                      onClick={() => handleAccept(req.requestId)}
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
      </div>
    </div>
  );
};

export default IncomingRequests;

