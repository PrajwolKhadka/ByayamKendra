import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is saved in localStorage

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/login" />; // Redirect to login if not authenticated or not admin
  }

  return children; // Allow access to the protected route if the user is admin
};

export default AdminRoute;
