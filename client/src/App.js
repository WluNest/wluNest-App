import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Listings from "./components/Listings";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {currentPage === "home" ? (
        <div className="app-container">
          <h1>wluNest</h1>
          <p>Discover and compare apartment buildings and floor plans around WLU.</p>
          <div className="button-group">
            <button className="browse-btn" onClick={() => setCurrentPage("listings")}>Browse</button>
            <span className="or-text">or</span>
            <button className="login-btn">Login</button>
          </div>
        </div>
      ) : (
        <Listings />
      )}
    </div>
  );
}

export default App;
