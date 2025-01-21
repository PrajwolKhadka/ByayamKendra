import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Loading from "./public/Loading";
import LandingPage from "./public/LandingPage";
import Signup from "./public/Signup.jsx";
import Login from "./public/Login";
import Feature from "./feature/feature.jsx";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* If there is a token, redirect to /dashboard */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={token ? <Feature /> : <Navigate to="/login" />} />
          {/* Redirect invalid routes to the home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
