import React, { useEffect, useState } from "react";
import "../css/AdminDashboard.css";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalChallenges: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token');
        
        if (!token) {
          // If no token is found, you can redirect the user to the login page or show an error message
          console.error('No token found, please log in');
          return;
        }

        // Include the token in the Authorization header
        const response = await fetch("http://localhost:3000/api/protected/dash/dashAdmin", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Add token in the Authorization header
            "Content-Type": "application/json",
          },
        });

        // Handle non-200 responses (like 401 Unauthorized)
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Welcome Admin!</h1>
      <div className="dashboard-cards">
        <Link to='/accounts'>
        <div className="card">
          <h2>Total Users</h2>
          <p>{dashboardData.totalUsers}</p>
        </div>
        </Link>
        <Link to='/workoutview'>
        <div className="card">
          <h2>Total Workouts</h2>
          <p>{dashboardData.totalWorkouts}</p>
        </div>
        </Link>
        <Link to='/challenges'>
        <div className="card">
          <h2>Total Challenges</h2>
          <p>{dashboardData.totalChallenges}</p>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
