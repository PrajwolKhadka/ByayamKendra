import React from 'react';

const Loading = ({ onVideoEnd }) => {
  return (
    <div className="loading-container">
      <video
        autoPlay
        muted
        onEnded={onVideoEnd}
        style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
      >
        <source src="../public/resources/loadingscreen2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Loading;
