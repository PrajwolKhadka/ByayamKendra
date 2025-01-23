import React, { useState, useEffect } from 'react';
import "../css/ByayamDashboard.css"; // Update this path as necessary

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User is not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/protected/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setData(data);
        console.log('Dashboard data:', data);
      } else {
        setError(data.error);
        console.error('Failed to fetch dashboard data:', data.error);
      }
    } catch (err) {
      setError('Error fetching dashboard');
      console.error('Error fetching dashboard:', err);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <main className='homepage-main'>
      <h1>Dashboard</h1>
    </main>
  );
}
export default Dashboard;
