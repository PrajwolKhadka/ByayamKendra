import React from "react";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-cards">
                <div className="card">
                    <h2>Total Users</h2>
                    <p>500</p>
                </div>
                <div className="card">
                    <h2>Total Workouts</h2>
                    <p>120</p>
                </div>
                <div className="card">
                    <h2>Pending Messages</h2>
                    <p>15</p>
                </div>
                <div className="card">
                    <h2>Active Accounts</h2>
                    <p>450</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
