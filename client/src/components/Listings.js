import React from "react";
import "./Listings.css";

function Listings() {
  return (
    <div className="listings-container">
      <h2>Available Apartments</h2>
      <div className="listings-grid">
        <div className="listing-card">Apartment 1</div>
        <div className="listing-card">Apartment 2</div>
        <div className="listing-card">Apartment 3</div>
        <div className="listing-card">Apartment 4</div>
        <div className="listing-card">Apartment 5</div>
        <div className="listing-card">Apartment 6</div>
      </div>
    </div>
  );
}

export default Listings;
