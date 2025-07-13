import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>Hello, {user?.name}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

