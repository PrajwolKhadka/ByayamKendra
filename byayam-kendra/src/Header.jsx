import React, { useState } from "react";
import "../src/css/ByayamDashboard.css";

function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false); // Close sidebar
    };

    return (
        <section className="navbar">
            {/* Logo Section */}
            <div className="logo">
                <a href="/ByayamDashboard.html">
                    <img src="/resources/Untitled1.png" alt="BYAYAM.com" title="BYAYAM.com" />
                </a>
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
                <div className="searchelements">
                    <input
                        type="search"
                        id="searchbar"
                        name="searchbar"
                        placeholder="Search"
                    />
                    <button className="search-btn" id="button">
                        <img src="/resources/search.svg" alt="Search" />
                    </button>
                    <br />
                </div>

                {/* Sidebar Links */}
                <div className="lists">
                    <a href="/ByayamDashboard.html" className="w3-bar-item w3-button">
                        Home
                    </a>
                    <a href="/ByayamSuggestions.html" className="w3-bar-item w3-button">
                        Suggested Workout
                    </a>
                    <a href="/ByayamTracker.html" className="w3-bar-item w3-button">
                        Tracker
                    </a>
                    <a href="/ByayamContact.html" className="w3-bar-item w3-button">
                        Contact Us
                    </a>
                </div>
                <a href="/ByayamLogin.html" className="logout">
                    Logout
                </a>
            </div>
        </section>
    );
}

export default Header;
