import React, { useState } from "react";
import "./Navbar.css"; // Ensure this file is linked

const Navbar = ({ setActivePage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMenuOpen(false); // Close menu after clicking
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-brand">A.M.O.S.</div>

      {/* Hamburger Menu Button */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation Links inside Hamburger Menu */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li onClick={() => handleNavClick("information")}>Information</li>
        <li onClick={() => handleNavClick("visualizer")}>Visualizer</li>
        <li onClick={() => handleNavClick("catalogue")}>Catalogue</li>
      </ul>
    </nav>
  );
};

export default Navbar;
