// App.jsx
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

// Override localStorage methods to detect token changes
const tokenAwareLocalStorage = () => {
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;

  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (key === "token") {
      window.dispatchEvent(new Event("tokenUpdated"));
    }
  };

  localStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, arguments);
    if (key === "token") {
      window.dispatchEvent(new Event("tokenUpdated"));
    }
  };
};

const App = () => {
  const [role, setRole] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    tokenAwareLocalStorage(); // Apply localStorage overrides

    const updateAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
          setAuthToken(token);
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setRole(null);
          setAuthToken(null);
        }
      } else {
        setRole(null);
        setAuthToken(null);
      }
    };

    updateAuth(); // Initial check
    window.addEventListener("tokenUpdated", updateAuth);
    window.addEventListener("storage", updateAuth); // Handle cross-tab changes

    return () => {
      window.removeEventListener("tokenUpdated", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={role === "admin" ? <Navigate to="/admindash" /> : role ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/signup" element={authToken ? <Navigate to={role === "admin" ? "/admindash" : "/dashboard"} /> : <Signup />} />
          <Route path="/login" element={authToken ? <Navigate to={role === "admin" ? "/admindash" : "/dashboard"} /> : <Login setAuth={setAuthToken} />} />

          {/* Always render protected routes; ProtectedRoute handles redirection */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<Feature />} />
            <Route path="/tracker" element={<Feature />} />
            <Route path="/suggest" element={<Feature />} />
            <Route path="/generate" element={<Feature />} />
            <Route path="/contact" element={<Feature />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admindash" element={<Admin />} />
            <Route path="/accounts" element={<Admin />} />
            <Route path="/workoutadd" element={<Admin />} />
            <Route path="/workoutview" element={<Admin />} />
            <Route path="/challenges" element={<Admin />} />
          </Route>

          {/* Catch-all for unauthenticated access */}
          <Route path="*" element={authToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;