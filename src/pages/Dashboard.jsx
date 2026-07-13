import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  getUsers,
  sendMatchRequest,
  getSuggestedMatches,
} from "../api/auth";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [sentRequestIds, setSentRequestIds] = useState(new Set());

  const navigate = useNavigate();

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const res = await getProfile();
        if (!mounted) return;
        setProfile(res.data.user || null);
      } catch (err) {
        console.error("Profile load failed:", err);
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    if (!profile) return;

    const fetchUsers = async () => {
      try {
        const res = await getUsers(search, filter);
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [search, filter, profile]);

  /* ================= LOAD SUGGESTED MATCHES ================= */
  useEffect(() => {
    if (!profile?.profile) {
      setSuggestionsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      setSuggestionsError(null);
      try {
        const res = await getSuggestedMatches(6);
        setSuggestions(res.data || []);
      } catch (err) {
        setSuggestionsError(
          err.response?.data?.error || "Couldn't load suggested matches"
        );
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, [profile]);

  /* ================= SEND REQUEST ================= */
  const handleSendRequest = async (receiverId) => {
    try {
      await sendMatchRequest(receiverId);
      setSentRequestIds((prev) => new Set(prev).add(receiverId));
      alert("Match request sent!");
    } catch (err) {
      alert(err.response?.data?.error || "Network error");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading dashboard...
      </div>
    );
  }

  /* ================= PROFILE STATUS ================= */
  const hasProfile = Boolean(profile?.profile);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-10 px-4 sm:px-8 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-3xl font-bold">Discover Profiles</h1>

          <div className="flex gap-3">
  <Button
    onClick={() => navigate("/create-profile")}
    className="bg-violet-600 hover:bg-violet-700"
  >
    {hasProfile ? "Edit Profile" : "Create Profile"}
  </Button>

  <Button
    onClick={() => navigate("/requests")}
    className="bg-indigo-600 hover:bg-indigo-700"
  >
    Requests
  </Button>

  <Button
    onClick={() => navigate("/messages")}
    className="bg-cyan-600 hover:bg-cyan-700"
  >
    Messages
  </Button>

 
  <Button
    onClick={() => navigate("/meetings")}
    className="bg-purple-600 hover:bg-purple-700"
  >
    Meetings
  </Button>

  <Button
    onClick={() => navigate("/reviews")}
    className="bg-pink-600 hover:bg-pink-700"
  >
    Reviews
  </Button>
</div>

        </div>

        {/* WELCOME */}
        {profile && (
          <p className="mb-4 text-gray-300">
            Welcome,{" "}
            <span className="font-semibold">{profile.name}</span>!
          </p>
        )}

        {/* YOUR PROFILE INFO (TOP LEFT) */}
        {hasProfile && (
          <div className="mb-8 bg-[#1e293b] rounded-xl p-5 shadow-md max-w-3xl">
            <h2 className="text-lg font-semibold mb-2">Your Information</h2>

            <p className="text-sm text-gray-300 mb-1">
              <span className="font-medium text-gray-200">Bio:</span>{" "}
              {profile.profile.bio || "Not specified"}
            </p>

            <p className="text-sm text-gray-300 mb-1">
              <span className="font-medium text-gray-200">Experience:</span>{" "}
              {profile.profile.experience || "Not specified"}
            </p>

            <p className="text-sm text-gray-300 mb-1">
              <span className="font-medium text-gray-200">Skills Offered:</span>{" "}
              {profile.profile.skills?.length
                ? profile.profile.skills.join(", ")
                : "Not added"}
            </p>

            <p className="text-sm text-gray-300 mb-1">
              <span className="font-medium text-gray-200">Skills Wanted:</span>{" "}
              {profile.profile.skills_wanted?.length
                ? profile.profile.skills_wanted.join(", ")
                : "Not specified"}
            </p>

            <div className="text-sm text-gray-300">
              <span className="font-medium text-gray-200">Availability:</span>
              {profile.profile.availability?.length ? (
                <ul className="list-disc ml-5 mt-1">
                  {profile.profile.availability.map((a, i) => (
                    <li key={i}>
                      {a.day} — {a.start_time} to {a.end_time}
                    </li>
                  ))}
                </ul>
              ) : (
                <span> Not specified</span>
              )}
            </div>
          </div>
        )}

        {/* CREATE PROFILE BANNER */}
        {!hasProfile && (
          <div className="mb-8 bg-indigo-900/40 border border-indigo-500 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Complete your profile
            </h2>
            <p className="text-gray-300 mb-4">
              Add your skills and availability to start matching.
            </p>
            <Button
              onClick={() => navigate("/create-profile")}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Create Profile
            </Button>
          </div>
        )}

        {/* SUGGESTED MATCHES (weighted: skill fit + rating + shared availability) */}
        {hasProfile && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-1">Suggested Matches</h2>
            <p className="text-sm text-gray-400 mb-4">
              Ranked by two-way skill fit, rating, and how much free time you share.
            </p>

            {suggestionsLoading ? (
              <p className="text-gray-400">Finding your best matches...</p>
            ) : suggestionsError ? (
              <p className="text-gray-400">{suggestionsError}</p>
            ) : suggestions.length === 0 ? (
              <p className="text-gray-400">
                No suggestions yet — add more skills or availability to your
                profile to widen your matches.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((s) => (
                  <div
                    key={s.user.id}
                    className="bg-gradient-to-b from-indigo-950/60 to-[#1e293b] border border-indigo-800/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              s.user.avatar_url ||
                              `https://i.pravatar.cc/150?u=${s.user.id}`
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <h3 className="text-lg font-semibold">{s.user.name}</h3>
                        </div>
                        <span className="text-xs font-bold bg-purple-600 rounded-full px-2 py-1">
                          {s.score}% match
                        </span>
                      </div>

                      <p className="text-sm text-gray-300 mb-1">
                        <span className="font-medium text-gray-200">
                          They teach:
                        </span>{" "}
                        {s.user.skills?.length ? s.user.skills.join(", ") : "—"}
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        <span className="font-medium text-gray-200">
                          They want to learn:
                        </span>{" "}
                        {s.user.skills_wanted?.length
                          ? s.user.skills_wanted.join(", ")
                          : "—"}
                      </p>
                      {s.user.average_rating ? (
                        <p className="text-sm text-gray-300 mb-1">
                          ⭐ {s.user.average_rating.toFixed(1)} ({s.user.review_count}{" "}
                          review{s.user.review_count === 1 ? "" : "s"})
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mb-1">No reviews yet</p>
                      )}
                      {s.bestSlot && (
                        <p className="text-sm text-gray-400 mb-2">
                          Best shared time: {s.bestSlot.day} {s.bestSlot.start_time}–
                          {s.bestSlot.end_time}
                        </p>
                      )}

                      <div className="flex gap-2 text-[10px] text-gray-400 mb-3">
                        <span>Skill fit {s.breakdown.skillReciprocity}%</span>
                        <span>·</span>
                        <span>Rating {s.breakdown.rating}%</span>
                        <span>·</span>
                        <span>Availability {s.breakdown.slotSize}%</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                      disabled={sentRequestIds.has(s.user.id)}
                      onClick={() => handleSendRequest(s.user.id)}
                    >
                      {sentRequestIds.has(s.user.id) ? "Request Sent" : "Send Request"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 p-3 rounded-md text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 rounded-md bg-white text-black"
          >
            <option value="all">All</option>
            <option value="name">Name</option>
            <option value="offered">Skill Offered</option>
            <option value="wanted">Skill Wanted</option>
          </select>
        </div>

        {/* USERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user, idx) => (
            <motion.div
              key={user.id}
              className="bg-[#1e293b] rounded-2xl p-6 shadow-lg flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="text-sm text-gray-300 space-y-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>

                <p>
                  <span className="font-medium text-gray-200">Experience:</span>{" "}
                  {user.experience || "Not specified"}
                </p>

                <p>
                  <span className="font-medium text-gray-200">Skills Offered:</span>{" "}
                  {user.skills?.length ? user.skills.join(", ") : "Not added"}
                </p>

                <p>
                  <span className="font-medium text-gray-200">Skills Wanted:</span>{" "}
                  {user.skills_wanted?.length
                    ? user.skills_wanted.join(", ")
                    : "Not specified"}
                </p>

                <div>
                  <span className="font-medium text-gray-200">Availability:</span>
                  {user.availability?.length ? (
                    <ul className="list-disc ml-5 mt-1">
                      {user.availability.map((a, i) => (
                        <li key={i}>
                          {a.day} — {a.start_time} to {a.end_time}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Not specified</p>
                  )}
                </div>
              </div>

              <Button
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                disabled={user.id === profile?.id}
                onClick={() => handleSendRequest(user.id)}
              >
                {user.id === profile?.id ? "This is You" : "Send Request"}
              </Button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
