import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import { getEligibleReviews, submitReview } from "../api/auth";

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className={`text-2xl leading-none ${
          n <= value ? "text-yellow-400" : "text-gray-600"
        }`}
        aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
      >
        ★
      </button>
    ))}
  </div>
);

const Reviews = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({}); // { [bookingId]: { rating, comment } }
  const [submittingId, setSubmittingId] = useState(null);

  const fetchEligible = async () => {
    try {
      const res = await getEligibleReviews();
      setSessions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch eligible sessions", err);
      toast.error("Couldn't load sessions to review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligible();
  }, []);

  const updateDraft = (bookingId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value },
    }));
  };

  const handleSubmit = async (bookingId) => {
    const draft = drafts[bookingId] || {};
    if (!draft.rating) {
      toast.error("Please pick a star rating first");
      return;
    }

    setSubmittingId(bookingId);
    try {
      await submitReview(bookingId, draft.rating, draft.comment || "");
      toast.success("Review submitted!");
      setSessions((prev) => prev.filter((s) => s.booking_id !== bookingId));
    } catch (err) {
      const message = err.response?.data?.error || "Failed to submit review";
      toast.error(message);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Rate Your Sessions</h1>
        <p className="text-gray-400 mb-6">
          Leave a rating for completed skill swap sessions.
        </p>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-400">
            No sessions awaiting review right now.
          </p>
        ) : (
          <div className="space-y-6">
            {sessions.map((s) => {
              const draft = drafts[s.booking_id] || {};
              return (
                <div
                  key={s.booking_id}
                  className="bg-[#1e293b] p-6 rounded-2xl shadow-lg space-y-4"
                >
                  <h2 className="text-xl font-semibold">
                    Session with {s.other_user_name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(s.session_time).toLocaleString()} –{" "}
                    {new Date(s.end_time).toLocaleTimeString()}
                  </p>

                  <StarPicker
                    value={draft.rating || 0}
                    onChange={(n) => updateDraft(s.booking_id, "rating", n)}
                  />

                  <textarea
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-sm"
                    rows={3}
                    maxLength={1000}
                    placeholder="Optional: share how the session went"
                    value={draft.comment || ""}
                    onChange={(e) =>
                      updateDraft(s.booking_id, "comment", e.target.value)
                    }
                  />

                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={submittingId === s.booking_id}
                    onClick={() => handleSubmit(s.booking_id)}
                  >
                    {submittingId === s.booking_id
                      ? "Submitting..."
                      : "Submit Review"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
