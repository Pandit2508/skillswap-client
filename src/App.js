import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Home from './pages/Home';
import { AuthContext } from './context/AuthContext';


// Protected Route wrapper
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Protected Route */}
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
      </Routes>
    </Router>
  );
}

export default App;
