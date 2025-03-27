import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Listings from "./components/Listings";
import Account from "./pages/Account";
import IndivListingView from "./pages/IndivListingView";
import Landing from "./pages/Landing";
import ListingCreate from "./pages/ListingCreate";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Buildings from "./pages/Buildings";
import Roommates from "./pages/Roommates";
import ListingDetails from "./pages/ListingDetails";

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
            <button className="login-btn" onClick={() => setCurrentPage("ListingCreate")}>CreateListing</button>
          </div>
        </div>
      ) : currentPage === "listings" ? (
        <Listings />
      )  : currentPage === "login" ? (
          <Login />
      ) : currentPage === "account" ? (
        <Account />
      ) : currentPage === "IndivListingView" ? (
        <IndivListingView />
      ) : currentPage === "Landing" ? (
        <Landing />
      ) : currentPage === "ListingCreate" ? (
        <ListingCreate />
      ) : currentPage === "settings" ? (
        <Settings />
      ) : currentPage === "buildings" ? (
        <Buildings />
      ) : currentPage === "roommates" ? (
        <Roommates />
      ) : currentPage === "listing-details" ? (
        <ListingDetails />
      ) : null}
    </div>
  );
}

export default App;

