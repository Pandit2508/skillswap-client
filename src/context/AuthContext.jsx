import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER ================= */
const fetchUser = async () => {
  try {
    const res = await API.get("/auth/me");

    if (res.data?.user) {
      setUser(res.data.user);
      return true;
    } else {
      setUser(null);
      return false;
    }
  } catch (err) {
    if (err?.response?.status === 401) {
      setUser(null);
    } else {
      console.error("Auth check failed:", err?.message || err);
      setUser(null);
    }
    return false;
  }
};

/* ================= LOGIN ================= */
const login = async () => {
  // 🔥 give cookie + backend some time to breathe
  await new Promise((resolve) => setTimeout(resolve, 500));

  let success = await fetchUser();

  // 🔥 retry once if Render had a moment
  if (!success) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await fetchUser();
  }
};

  /* ================= LOGOUT ================= */
  const logout = async (silent = false) => {
    try {
      await API.post("/auth/logout");

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

  /* ================= INITIAL AUTH CHECK ================= */
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      await fetchUser();

      if (isMounted) {
        setLoading(false);
      }
    };

    initAuth();

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
        refreshUser: fetchUser, // 🔥 bonus utility
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