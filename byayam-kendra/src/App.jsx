import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Loading from "./public/Loading";
import LandingPage from "./public/LandingPage";
import Signup from "./public/Signup.jsx";
import Login from "./public/Login";
import Feature from "./feature/feature.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Admin from "./admin/Admin.jsx";

const App = () => {
  const [role, setRole] = useState(null);
  const [authToken, setAuthToken] = useState(null); // State to manage auth token

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setAuthToken(token); // Set the auth token
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={role === "admin" ? <Navigate to="/admindash" /> : role ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setAuth={setAuthToken} />} /> {/* Pass setAuth to Login */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<Feature />} />
            <Route path="/tracker" element={<Feature />} />
            <Route path="/suggest" element={<Feature />} />
            <Route path="/generate" element={<Feature />} />
          </Route>

          {/* Admin Route */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admindash" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
