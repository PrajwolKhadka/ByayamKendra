import React, { useState, useEffect } from "react";
import "../css/Landingpage.css"; // Import your CSS

function Loading({ onVideoEnd }) {
  // `onVideoEnd` is a callback to notify the parent when the video finishes.

  useEffect(() => {
    const timer = setTimeout(onVideoEnd, 10000); // Fallback in case video doesn't fire `onEnded` (e.g., slow loading)

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onVideoEnd]);

  return (
    <div className="loading-screen">
      <video
        src="/resources/loadingscreen2.mp4" // Replace with your video path
        autoPlay
        muted
        onEnded={onVideoEnd} // Call parent handler when the video ends
        className="loading-video"
      />
    </div>
  );
}

export default Loading;
