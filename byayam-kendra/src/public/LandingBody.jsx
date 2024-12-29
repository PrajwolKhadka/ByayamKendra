import React from 'react';
import '../css/ByayamDashboard.css'

function LandingBody(){
    return(
    <>
      <section className="bar animated">
      <div className="info">
        <h2>Who are we?</h2>
        <p>
          At Bayayam Kendra, we believe that health is the cornerstone of a
          fulfilling life. Our mission is to empower individuals on their
          wellness journey through a holistic approach that combines physical
          fitness, mental well-being, and nutritional education. We offer a
          diverse range of workout programs tailored to all fitness levels,
          from invigorating group classes to personalized training sessions,
          ensuring that everyone can find their path to strength and vitality.
          Our expert trainers are dedicated to providing guidance and support,
          helping you set and achieve your health goals in a motivating and
          inclusive environment. Join us at Bayayam Kendra, where we inspire a
          community of health-conscious individuals committed to living their
          best lives through movement, mindfulness, and a balanced lifestyle.
        </p>
      </div>
      <div className="barcontent">
        <img src="../resources/info.png" alt="Who are we?" />
      </div>
    </section>
    </>
    );
}

export default LandingBody;