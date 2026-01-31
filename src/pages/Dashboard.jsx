import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProfile, getUsers, sendMatchRequest } from "../api/auth";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  /* ================= SEND REQUEST ================= */
  const handleSendRequest = async (receiverId) => {
    try {
      await sendMatchRequest(receiverId);
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

  {/* ⭐ NEW BUTTON */}
  <Button
    onClick={() => navigate("/meetings")}
    className="bg-purple-600 hover:bg-purple-700"
  >
    Meetings
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
