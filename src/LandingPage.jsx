import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Make sure to import the CSS for animations

const LandingPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000); // 1 second delay to trigger animations
    return () => clearTimeout(timer); // Clear the timer on unmount
  }, []);

  return (
    <div className={`landing-container ${loaded ? "loaded" : ""}`}>
      <div className="landing-content">
        <h1 className="landing-title">Welcome AMOS</h1>
        <p className="landing-subtitle">
          Adaptable Modular Organization System
        </p>
        <Link to="/visualizer" className="cta-button">
          Start Exploring
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
