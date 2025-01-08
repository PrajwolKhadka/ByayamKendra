import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Loading from "./public/Loading";
import LandingPage from "./public/LandingPage";
import Signup from "./public/Signup.jsx";
import Login from "./public/Login";

function App() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check for token on app load
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  const handleVideoEnd = () => {
    // Video end handler
    setIsVideoPlaying(false);
  };

  if (isVideoPlaying) {
    return <Loading onVideoEnd={handleVideoEnd} />;
  }

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Protected Route */}
          {hasToken ? (
            <Route path="/" element={<div className="main-content"><h1>Welcome Back!</h1></div>} />
          ) : (
            <Route path="/" element={<LandingPage />} />
          )}
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Redirect invalid routes to the home or LandingPage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
