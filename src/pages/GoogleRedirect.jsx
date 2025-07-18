import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const GoogleRedirect = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasHandled = useRef(false); // Prevent multiple calls

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include", // Include HTTP-only cookie
        });

        const data = await res.json();

        if (res.ok && data.user) {
          login(null, data.user); // token=null, user=data.user
          toast.success("Logged in with Google");
        } else {
          throw new Error(data.message || "Invalid session");
        }

        navigate("/dashboard");
      } catch (err) {
        console.error("Google redirect error:", err);
        toast.error("Google login failed");
        navigate("/login");
      }
    };

    fetchUser();
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg">Logging you in with Google...</p>
    </div>
  );
};

export default GoogleRedirect;
