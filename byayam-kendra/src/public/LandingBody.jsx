import React, { Suspense } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import '../css/Landingpage.css';
const Collab=React.lazy(()=>import('./Collab.jsx'))
const images = [
  '/resources/scroll1.png',
  '/resources/scroll2.png',
  '/resources/scroll3.png',
  '/resources/scroll4.png',
  '/resources/scroll5.png',
];
function LandingBody() {

const [currentSlide, setCurrentSlide] = useState(0);
useEffect(() => {
  const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  }, 4000);
  return () => clearInterval(slideInterval);
}, []);
  return (
    <>
      <section className="scrolling-banner">
        <div className="slideshow fade-in-slow">
        {images.map((image, index) => (
          <img
            key={index}
           src={image}
            alt={`Slide ${index + 1}`}
            className={`${index === currentSlide ? 'active' : 'inactive'}`}
           loading="lazy"
           />
           ))}
        </div>
      </section>
      
      <section className="bar animated">
        <div className="info" id="about">
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
          <img src="../resources/info.png" alt="Who are we?" loading='lazy'/>
        </div>
      </section>
      <Suspense>
      <Collab/>
      </Suspense>
    </>
  );
}

export default LandingBody;
