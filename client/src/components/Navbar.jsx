import React from "react";
import "./Navbar.css";

function Navbar({ setCurrentPage, user }) {
  const handleLogout = () => {
    // Insert your logout logic here
    alert("Logged out!");
  };

  return (
    <div className="navbar">
      {/* Left Section: Logo */}
      <div className="nav-left" onClick={() => setCurrentPage("home")}>
        <span className="logo">wluNest</span>
      </div>

      {/* Center Section: Nav Links */}
      <div className="nav-center">
        <span className="nav-item" onClick={() => setCurrentPage("listings")}>
          Listings
        </span>
        <span className="nav-item" onClick={() => setCurrentPage("roommates")}>
          Roommates
        </span>
        <span className="nav-item" onClick={() => setCurrentPage("buildings")}>
          Buildings
        </span>
        <span className="nav-item" onClick={() => setCurrentPage("settings")}>
          Settings
        </span>
      </div>

      {/* Right Section: Logout */}
      <div className="nav-right">
        <span className="nav-item logout-item" onClick={handleLogout}>
          Logout ➜
        </span>
      </div>
    </div>
  );
}

export default Navbar;
