// src/pages/Dashboard.jsx
import { logoutUser } from "../api/auth"; //  Make sure the path is correct
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); //  API call to clear cookie
      logout();           //  Clear local state
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
