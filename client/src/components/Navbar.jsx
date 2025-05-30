import React from "react";
import "./Navbar.css";

function Navbar({ setCurrentPage }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentPage("home");
    alert("Logged out successfully!");
    window.location.reload(); // Refresh to reset app state
  };

  const handleLogin = () => {
    setCurrentPage("login");
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
        {user && (
          <span className="nav-item" onClick={() => setCurrentPage("settings")}>
            Settings
          </span>
        )}
        {user && (
          <span className="nav-item" onClick={() => setCurrentPage("ListingCreate")}>
            Create Listing
          </span>
        )}
        {/* Admin Dashboard link */}
        {user?.role === "admin" && (
          <span className="nav-item" onClick={() => setCurrentPage("admin")}>
            Admin Dashboard
          </span>
        )}
      </div>

      {/* Right Section: Auth */}
      <div className="nav-right">
        {user ? (
          <span className="nav-item logout-item" onClick={handleLogout}>
            Logout ➜
          </span>
        ) : (
          <span className="nav-item login-item" onClick={handleLogin}>
            ➜ Log in
          </span>
        )}
      </div>
    </div>
  );
}

export default Navbar;
