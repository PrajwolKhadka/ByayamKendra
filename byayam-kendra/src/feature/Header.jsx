import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/Header_footer.css";

function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // Close sidebar when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <section className="navbar">
            {/* Logo Section */}
            <div className="logodash">
                <Link to="/ByayamDashboard">
                    <img src="../resources/logonew.png" alt="BYAYAM.com" title="BYAYAM.com" />
                </Link>
            </div>
            <h2>EAT . LIFT . REPEAT</h2>

            {/* Menu Button */}
            <button className="open-btn" onClick={toggleSidebar} title="Menu" id="menu">
                <img src="/resources/menu.svg" alt="Menu" />
            </button>

            {/* Sidebar */}
            <div
                className={`sidebar ${isSidebarOpen ? "open" : ""}`}
                ref={sidebarRef}
                id="mySidebar"
                style={{
                    right: isSidebarOpen ? "0px" : "-250px",
                }}
            >
                <button className="close-btn" onClick={closeSidebar}>
                    <img src="/resources/cl.svg" alt="Close" />
                </button>
                <br />
                {/* Sidebar Links */}
                <div className="lists">
                    <Link to="/dashboard" className="w3-bar-item w3-button" onClick={closeSidebar}>
                        Home
                    </Link>
                    <Link to="/suggest" className="w3-bar-item w3-button" onClick={closeSidebar}>
                        Suggested Workout
                    </Link>
                    <Link to="/tracker" className="w3-bar-item w3-button" onClick={closeSidebar}>
                        Tracker
                    </Link>
                    <Link to="/contact" className="w3-bar-item w3-button" onClick={closeSidebar}>
                        Contact Us
                    </Link>
                </div>
                <Link to="/login" className="logout" onClick={handleLogout}>
                    Logout
                </Link>
            </div>
        </section>
    );
}

export default Header;
