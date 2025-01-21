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
    <main>
      {/* Home Page Section */}
      <section className="homePage animated">
        <div className="homeContent">
          <a href="Generator.html" className="aa">
            <div className="generator">
              <img
                src="../resources/generator.svg"
                className="generatorimg"
                alt="Workout Generator"
              />
              <br />
              <label id="g">Workout Generator</label>
            </div>
          </a>
          <a href="Protein.html" className="aa">
            <div className="generator">
              <img
                src="../resources/protein.svg"
                className="proteinimg"
                alt="Protein"
              />
              <br />
              <label id="pr">Protein</label>
            </div>
          </a>
          <a href="Profile.html" className="aa">
            <div className="generator">
              <img
                src="../resources/profile.svg"
                className="profileimg"
                alt="Profile"
              />
              <br />
              <label id="p">Profile</label>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
export default Dashboard;
