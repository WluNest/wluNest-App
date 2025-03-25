import React, { useState } from "react";
import "./Listings.css";
import { MapView } from "../App";


const listingsData = [
  {
    id: 1,
    name: "228 Albert St",
    address: "228 Albert St, Waterloo, ON N2L 3T6",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg", // Replace with actual image path
  },
  {
    id: 2,
    name: "345 King St N",
    address: "345 King St N, Waterloo, ON",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
  {
    id: 3,
    name: "81 University Ave",
    address: "81 University Ave, Waterloo, ON",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
  {
    id: 4,
    name: "250 Lester st",
    address: "250 Lester st, Waterloo, ON",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
];

function Listings() {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="listings-page">
      {/* LEFT PANEL (33%) */}
      <div className="left-panel">
        <div className="filter-bar">
          <select><option>All Buildings</option></select>
          <select><option>Rooms</option></select>
          <select><option>Bathrooms</option></select>
          <select><option>Price</option></select>
          <select><option>Favorites</option></select>
          <button className="sort-button">Sort ⬇</button>
        </div>

        <div className="listings-scroll">
          {listingsData.map((listing) => (
            <div key={listing.id} className="listing-card">
              <img src={listing.img} alt="Apartment" />
              <div className="listing-info">
                <h3>{listing.name}</h3>
                <p>{listing.price}</p>
                <p>🛏 {listing.beds} | 🛁 {listing.baths}</p>
              </div>
              <span
                className={`favorite-star ${favorites[listing.id] ? "active" : ""}`}
                onClick={() => toggleFavorite(listing.id)}
              >
                ★
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (67%) */}
      <div className="right-panel">
        <MapView />
      </div>
    </div>
  );
}

export default Listings;
