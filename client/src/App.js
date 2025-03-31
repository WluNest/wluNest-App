import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Listings from "./components/Listings";
import Account from "./pages/Account";
import ListingCreate from "./pages/ListingCreate";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Buildings from "./pages/Buildings";
import Roommates from "./pages/Roommates";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      
      {currentPage === "home" ? (
        <div className="app-container">
          <h1>wluNest</h1>
          <p>Discover and compare apartment buildings and floor plans around Waterloo.</p>
          <div className="button-group">
            <button className="browse-btn" onClick={() => setCurrentPage("listings")}>
              Browse
            </button>
            <span className="or-text">or</span>
            <button className="login-btn" onClick={() => setCurrentPage("login")}>
              Login/Signup
            </button>
          </div>
        </div>
      ) : currentPage === "listings" ? (
        <Listings />
      ) : currentPage === "login" ? (
        <Login setCurrentPage={setCurrentPage} />
      ) : currentPage === "account" ? (
        <Account />
      ) : currentPage === "ListingCreate" ? (
        <ListingCreate setCurrentPage={setCurrentPage} />
      ) : currentPage === "settings" ? (
        <Settings />
      ) : currentPage === "buildings" ? (
        <Buildings />
      ) : currentPage === "roommates" ? (
        <Roommates />
      ) : currentPage === "admin" && user?.role === "admin" ? (
        <AdminDashboard />
      ) : null}
    </div>
  );
}

export default App;
