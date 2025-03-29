import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Listings from "./components/Listings";
import Account from "./pages/Account";
import Landing from "./pages/Landing";
import ListingCreate from "./pages/ListingCreate";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Buildings from "./pages/Buildings";
import Roommates from "./pages/Roommates";



function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {currentPage === "home" ? (
        <div className="app-container">
          <h1>wluNest</h1>
          <p>Discover and compare apartment buildings and floor plans around Waterloo.</p>
          <div className="button-group">
            <button className="browse-btn" onClick={() => setCurrentPage("listings")}>Browse</button>
            <span className="or-text">or</span>
            <button className="login-btn" onClick={() => setCurrentPage("login")}>Login/Signup</button>
            <span className="or-text">(temp Button)</span>
            <button 
            className="login-btn" 
            onClick={() => {
              const user = localStorage.getItem("user");
              if (!user) {
                alert("Please login to create a listing.");
                setCurrentPage("login");
              } else {
                setCurrentPage("ListingCreate");
              }
              }}
              >
                CreateListing
                </button>          
          </div>
        </div>
      ) : currentPage === "listings" ? (
        <Listings />
      )  : currentPage === "login" ? (
        <Login setCurrentPage={setCurrentPage} />
      ) : currentPage === "account" ? (
        <Account />
      ) : currentPage === "Landing" ? (
        <Landing />
      ) : currentPage === "ListingCreate" ? (
        <ListingCreate setCurrentPage={setCurrentPage} />
      ) : currentPage === "settings" ? (
        <Settings />
      ) : currentPage === "buildings" ? (
        <Buildings />
      ) : currentPage === "roommates" ? (
        <Roommates />
      ) : null}
    </div>
  );
}

export default App;

