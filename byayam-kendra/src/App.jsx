import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import Loading from "./public/Loading";
import LandingPage from "./public/LandingPage";

function App() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true); 
  const [hasToken, setHasToken] = useState(false); 

  useEffect(() => {
    // Check for token on app load
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  const handleVideoEnd = () => {
    // Video chalna banda vayepaxi chalnu parxa yo
    setIsVideoPlaying(false);
  };

  if (isVideoPlaying) {
    // Standby rakhna ko lagi yo loading component paxi
    return <Loading onVideoEnd={handleVideoEnd} />;
  }

  // Conditional Rendering depending on token xa ki xaina
  return hasToken ? (
    <Suspense>
    <div className="main-content">
      <h1>Welcome Back!</h1>
    </div>
    </Suspense>
  ) : (
    <Suspense>
    <LandingPage />
    </Suspense>
  );
}

export default App;
