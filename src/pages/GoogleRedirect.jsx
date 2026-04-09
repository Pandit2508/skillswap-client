import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const GoogleRedirect = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const fetchUserFromCookie = async () => {
      try {
        

const res = await fetch(`${BASE_URL}/auth/me`, {
  credentials: "include",
});

        const data = await res.json();

        if (res.ok && data.user) {
          login(data.user);
          toast.success("Logged in with Google");

          // ✅ THIS WAS MISSING — REDIRECT AFTER LOGIN
          navigate("/dashboard", { replace: true });
        } else {
          throw new Error(data.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("Google redirect error:", err);
        toast.error("Google login failed");
        navigate("/login", { replace: true });
      }
    };

    fetchUserFromCookie();
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
