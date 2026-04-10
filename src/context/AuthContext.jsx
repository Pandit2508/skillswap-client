import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  /* ================= LOGIN ================= */
  const login = (userData) => {
    if (!userData) return;
    setUser(userData);
  };

  /* ================= LOGOUT ================= */
  const logout = async (silent = false) => {
    try {
      // 🔥 remove token (important now)
      localStorage.removeItem("token");

      if (!silent) {
        toast.success("Logged out");
      }
    } catch (err) {
      if (!silent) {
        toast.error("Logout failed");
      }
    } finally {
      setUser(null);
    }
  };

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔥 NO TOKEN → skip request
        if (!token) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isMounted) return;

        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!isMounted) return;

        if (err?.response?.status === 401) {
          // 🔥 token invalid → remove it
          localStorage.removeItem("token");
          setUser(null);
        } else {
          console.error("Auth check failed:", err?.message || err);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};