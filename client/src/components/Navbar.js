import React from "react";
import "./Navbar.css";
import { useState } from "react";

function Navbar({ setCurrentPage, user }) {
  const handleAccountClick = () => {
    if (user) {
      setCurrentPage("account");
    } else {
      setCurrentPage("login");
    }
  }
  
  return (
    <nav className="navbar">
      <span className="logo" onClick={() => setCurrentPage("home")}>wluNest</span>
      <div className="nav-links">
        <span className="nav-item" onClick={() => setCurrentPage("listings")}>Browse Listings</span>
        <span className="nav-item" onClick={() => setCurrentPage(handleAccountClick)}>{ user ? "Account" : "Login"}</span>
      </div>
    </nav>
  );
}

export default Navbar;
