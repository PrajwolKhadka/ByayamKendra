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
                            <Link to="/admindash">Dashboard</Link>
                        </li>
                        <li className={location.pathname === "/workoutadd" ? "active" : ""}>
                            <Link to="/workoutadd">Workout</Link>
                        </li>
                        <li className={location.pathname === "/challenges" ? "active" : ""}>
                            <Link to="/challenges">Challenges</Link>
                        </li>
                        <li className={location.pathname === "/accounts" ? "active" : ""}>
                            <Link to="/accounts">Accounts</Link>
                        </li>
                        <li>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
