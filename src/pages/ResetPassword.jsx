import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        newPassword: password,
      });

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition font-semibold py-3 rounded-md"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="text-sm text-center mt-4">
          <a href="/login" className="text-purple-400 hover:underline">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
