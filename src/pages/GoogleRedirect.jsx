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

    const handleGoogleLogin = async () => {
      try {
        // 🔥 STEP 1: Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        console.log("TOKEN FROM URL:", token);

        if (!token) {
          throw new Error("No token received from Google");
        }

        // 🔥 STEP 2: Store token
        localStorage.setItem("token", token);

        // 🔥 STEP 3: Fetch user using token
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.user) {
          login(data.user);
          toast.success("Logged in with Google");

          // 🔥 IMPORTANT: navigate AFTER everything is set
          navigate("/dashboard", { replace: true });
        } else {
          throw new Error(data.message || "Failed to fetch user");
        }
      } catch (err) {
        console.error("Google redirect error:", err);
        toast.error("Google login failed");

        // clean up broken token if any
        localStorage.removeItem("token");

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