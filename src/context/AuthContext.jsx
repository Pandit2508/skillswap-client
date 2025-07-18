import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userData, redirect = true) => {
    setUser(userData);
    if (token) {
      // Store token only if passed (e.g., in traditional login)
      localStorage.setItem("token", token);
    }
    if (redirect) {
      navigate("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", null, {
        withCredentials: true,
      });
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-black">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
