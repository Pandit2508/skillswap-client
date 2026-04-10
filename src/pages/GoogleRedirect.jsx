import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import API from "../api"; // your axios instance

const GoogleRedirect = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const handleGoogleLogin = async () => {
      try {
        // 🔥 Just call backend to get user (cookie is already set)
        const res = await API.get("/auth/me");

        if (res.data?.user) {
          login(res.data.user);
          toast.success("Logged in with Google");

          navigate("/dashboard", { replace: true });
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (err) {
        console.error("Google redirect error:", err);
        toast.error("Google login failed");

        navigate("/login", { replace: true });
      }
    };

    handleGoogleLogin();
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg animate-pulse">
        Logging you in with Google...
      </p>
    </div>
  );
};

export default GoogleRedirect;