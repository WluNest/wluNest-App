import React from "react";
import "./Navbar.css";

function Navbar({ setCurrentPage }) {
  return (
    <nav className="navbar">
      <span className="logo" onClick={() => setCurrentPage("home")}>wluNest</span>
      <div className="nav-links">
        <span className="nav-item" onClick={() => setCurrentPage("listings")}>Browse Listings</span>
      </div>
    </nav>
  );
}

export default Navbar;
