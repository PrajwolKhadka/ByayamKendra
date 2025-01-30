import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Loading from "./public/Loading";
import LandingPage from "./public/LandingPage";
import Signup from "./public/Signup.jsx";
import Login from "./public/Login";
import Feature from "./feature/feature.jsx";

// ProtectedRoute Component
const ProtectedRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const setTokenHandler = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Redirect to dashboard if logged in */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setToken={setTokenHandler} />} />
          {/* Protected Dashboard */}
          <Route path="/dashboard"element={<ProtectedRoute token={token}><Feature />
          </ProtectedRoute>}/>
          <Route path="/tracker"element={<ProtectedRoute token={token}><Feature />
          </ProtectedRoute>}/>
          <Route path="/suggest"element={<ProtectedRoute token={token}><Feature />
          </ProtectedRoute>}/>
          <Route path="/generate"element={<ProtectedRoute token={token}><Feature />
          </ProtectedRoute>}/>
          {/* Redirect invalid routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
