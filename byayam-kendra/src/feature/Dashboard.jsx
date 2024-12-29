import React from "react";
import "../css/ByayamDashboard.css"; // Update this path as necessary

function Dashboard() {
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

      {/* Who Are We Section */}
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

      {/* Search Section */}
      <section className="searchtour animated">
        <div className="icon">
          <h3>Search through our wide range of workouts</h3>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Workout Type/Name"
          />
          <button type="submit" id="searchbtn">
            Search
          </button>
        </div>
        <div className="plans">
          <h3>Also, all the variations of workout you need to sweat the best!</h3>
          <p>
            At Byayam Kendra, we acknowledge that working out is not just an
            hour of exercise; it’s a commitment to a healthier lifestyle and a
            testament to the inner strength that fuels our journey. We believe
            in the power of community and support, which is why we provide a
            variety of pre-built{" "}
            <a href="ByayamSuggestions.html">workout plans</a> tailored to meet
            the needs of beginners and professionals alike. Our programs are
            designed to be flexible and adaptable, ensuring that everyone can
            find a routine that fits their schedule and fitness level.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services animated">
        <div className="servicescontent">
          <h3>Our Services</h3>
        </div>
        <div className="servicedemo">
          <ServiceCard
            imgSrc="../resources/personal.svg"
            altText="Personalized Plans"
            label="Personalized Plans"
          />
          <ServiceCard
            imgSrc="../resources/track.svg"
            altText="Keep Track"
            label="Keep Track"
          />
          <ServiceCard
            imgSrc="../resources/pt.svg"
            altText="Personal Training"
            label="Personal Training"
          />
        </div>
      </section>
    </main>
  );
}

// Reusable ServiceCard Component
function ServiceCard({ imgSrc, altText, label }) {
  return (
    <div className="source">
      <div className="svr">
        <img src={imgSrc} className="generatorimg" alt={altText} />
        <br />
        <label>{label}</label>
      </div>
    </div>
  );
}

export default Dashboard;
