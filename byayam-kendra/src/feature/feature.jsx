import React, { Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = React.lazy(() => import("./Header.jsx"));
const Dashboard = React.lazy(() => import("./Dashboard.jsx"));
const Tracker = React.lazy(() => import("./Tracker.jsx"));
const Suggest = React.lazy(() => import("./Suggestion.jsx"));
const Generator = React.lazy(() => import("./Generator.jsx"));
const Feature = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  // Create a map of routes to components
  const routeComponents = {
    '/dashboard': <Dashboard />,
    '/tracker': <Tracker />,
    '/suggest': <Suggest />,
    '/generate': <Generator />,
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      {routeComponents[location.pathname] || <div>404 Page Not Found</div>}
    </Suspense>
  );
};

export default Feature;
