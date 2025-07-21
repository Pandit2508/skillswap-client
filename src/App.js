// App.js
import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleRedirect from "./pages/GoogleRedirect";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import CreateProfile from "./pages/CreateProfile";

// Ensure credentials (cookies) are sent in all requests
axios.defaults.withCredentials = true;

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  const { user, login } = useContext(AuthContext);
  const location = useLocation();

  // 🔁 Optional: Persist user from cookie when page reloads
  useEffect(() => {
    const fetchUserFromCookie = async () => {
      if (!user) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me");
          login(null, res.data.user); // Token already in cookie
        } catch (err) {
          console.log("Not logged in");
        }
      }
    };

    fetchUserFromCookie();
  }, [user, login, location.pathname]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/google-redirect" element={<GoogleRedirect />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          }
        />
        <Route path="/CreateProfile" element={<CreateProfile />} />
      </Routes>
    </>
  );
}

export default App;
