import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /**
   * user:
   *   undefined → auth not checked yet
   *   null      → not logged in
   *   object    → logged in user
   */
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  /* ================= LOGIN ================= */
  // ONLY update state, never navigate here
  const login = (userData) => {
    if (!userData) return;
    setUser(userData);
  };

  /* ================= LOGOUT ================= */
  const logout = async (silent = false) => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

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

  /* ================= AUTH CHECK (ON APP LOAD) ================= */
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          { withCredentials: true }
        );

        if (!isMounted) return;

        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!isMounted) return;

        if (err.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Auth check failed:", err);
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

  /* ================= INITIAL LOADING SCREEN ================= */
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
