import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/AdminSidebar.css";

const AdminSidebar = () => {
    const sidebarRef = useRef(null);
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        window.location.href = "/login";
    };

    return (
        <>
            {/* Sidebar */}
            <div className="admin-sidebar" ref={sidebarRef}>
                <nav>
                <ul>
    <li className={location.pathname === "/admindash" ? "active" : ""}>
        <Link to="/admindash">
            <span className="icon">📊</span>
            <span>Dashboard</span>
        </Link>
    </li>
    <li className={location.pathname === "/workoutadd" ? "active" : ""}>
        <Link to="/workoutadd">
            <span className="icon">🏋️</span>
            <span>Workout</span>
        </Link>
    </li>
    <li className={location.pathname === "/challenges" ? "active" : ""}>
        <Link to="/challenges">
            <span className="icon">🎯</span>
            <span>Challenges</span>
        </Link>
    </li>
    <li className={location.pathname === "/accounts" ? "active" : ""}>
        <Link to="/accounts">
            <span className="icon">👤</span>
            <span>Accounts</span>
        </Link>
    </li>
    <li>
        <button className="logout-btn" onClick={handleLogout}>
            <span className="icon">↪</span>
            <span>Logout</span>
        </button>
    </li>
</ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
