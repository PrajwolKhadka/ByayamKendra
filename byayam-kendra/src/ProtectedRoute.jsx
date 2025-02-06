import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token); // Extract role from token
    if (!allowedRoles.includes(decodedToken.role)) {
      return <Navigate to={decodedToken.role === "admin" ? "/admindash" : "/dashboard"} replace />;
    }
    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token"); // Remove invalid token
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
