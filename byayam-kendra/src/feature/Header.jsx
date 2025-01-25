import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importing Link component from react-router-dom
import "../css/Header_footer.css";

function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false); // Close sidebar
    };
    const handelLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
      
        // Redirect the user to the login page
        window.location.href = '/login';
      };
    return (
        <section className="navbar">
            {/* Logo Section */}
            <div className="logodash">
                <Link to="/ByayamDashboard">
                    <img src="../public/resources/logonew.png" alt="BYAYAM.com" title="BYAYAM.com" />
                </Link>
            </div>
            <h2>EAT . LIFT . REPEAT</h2>

            {/* Menu Button */}
            <button
                className="open-btn"
                onClick={toggleSidebar}
                title="Menu"
                id="menu"
            >
                <img src="/resources/menu.svg" alt="Menu" />
            </button>

            {/* Sidebar */}
            <div
                className={`sidebar ${isSidebarOpen ? "open" : ""}`}
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
                    <Link to="/dashboard" className="w3-bar-item w3-button">
                        Home
                    </Link>
                    <Link to="/suggest" className="w3-bar-item w3-button">
                        Suggested Workout
                    </Link>
                    <Link to="/tracker" className="w3-bar-item w3-button">
                        Tracker
                    </Link>
                    <Link to="/dashboard" className="w3-bar-item w3-button">
                        Contact Us
                    </Link>
                </div>
                <Link to="/login" className="logout" onClick={handelLogout}>
                    Logout
                </Link>
            </div>
        </section>
    );
}

export default Header;
