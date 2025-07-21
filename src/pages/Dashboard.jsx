 import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", { withCredentials: true });
        setProfile(res.data.user); // Store profile for use/display
      } catch (err) {
        console.error("Not logged in or failed to fetch profile", err);
        navigate("/login"); // Redirect to login if not authenticated
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Fetch users from backend based on search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
  const res = await axios.get("http://localhost:5000/api/users", {
    params: { skill: search },
    withCredentials: true,
  });
  setUsers(res.data);
} catch (error) {
  console.error("Failed to fetch users:", error);
}
    };

    fetchUsers();
  }, [search]);

  // ✅ Send match request
  const sendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        "/api/match-requests",
        { receiver_id: receiverId },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Match request sent!");
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Failed to send request", err);
      alert(err.response?.data?.error || "Network error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1120] m-0 p-0">
      <div className="w-full min-h-screen bg-[#0f172a] text-white py-10 px-4 sm:px-8 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-center sm:text-left">
              Discover Profiles
            </h1>
            <Button
              onClick={() => navigate("/CreateProfile")}
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md text-white"
            >
              Create Profile
            </Button>
          </div>

          {/* Greet User (optional) */}
          {profile && (
            <div className="mb-4 text-gray-300 text-sm">
              Welcome, <span className="font-medium">{profile.name}</span>!
            </div>
          )}

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name or skill..."
            className="w-full p-3 rounded-md mb-8 text-black placeholder:text-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map((user, idx) => (
              <motion.div
                key={user.id}
                className="bg-[#1e293b] rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-400">
                      {user.skills?.join(", ")}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md text-white"
                  onClick={() => sendRequest(user.id)}
                >
                  Send Request
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
