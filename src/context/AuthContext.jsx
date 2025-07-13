import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Logout: clears state + storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Login: save to state + localStorage
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  // Check token on load & setup auto logout
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const exp = decoded.exp * 1000;
        const now = Date.now();

        if (exp <= now) {
          logout();
        } else {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);

          // Auto logout when token expires
          const timeout = setTimeout(() => {
            logout();
          }, exp - now);

          // Clear timeout on unmount
          return () => clearTimeout(timeout);
        }
      } catch (err) {
        console.error("Invalid token:", err.message);
        logout();
      }
    }
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
