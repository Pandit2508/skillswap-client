import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleRedirect from "./pages/GoogleRedirect";
import CreateProfile from "./pages/CreateProfile";
import IncomingRequests from "./pages/IncomingRequests";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import UpcomingMeetings from "./pages/UpcomingMeetings";


/* ================= PRIVATE ROUTE ================= */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // ⏳ WAIT for auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  // ⏳ Prevent routing before auth check
  if (loading) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/login"
          element={
            !user ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/google-redirect" element={<GoogleRedirect />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-profile"
          element={
            <PrivateRoute>
              
                <CreateProfile />
              
            </PrivateRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <PrivateRoute>
          
                <IncomingRequests />
             
            </PrivateRoute>
          }
        />
        <Route path="/meetings" element={<UpcomingMeetings />} />
      </Routes>

      
    </>
  );
}

export default App;
