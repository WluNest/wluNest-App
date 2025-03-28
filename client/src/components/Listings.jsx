import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Listings.css";
import MapView from "./MapView";
import { Link } from "react-router-dom";

function Listings() {
  const [favorites, setFavorites] = useState({});
  const [listingsData, setListingsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/listings")
      .then((res) => {
        console.log("API Response:", res.data);
        setListingsData(res.data);
      })
      .catch((err) => console.error("Failed to fetch listings:", err));
  }, []);

  const getFirstImageUrl = (listing) => {
    if (!listing.listing_image) return '/placeholder.jpg';
    
    // Construct the correct URL
    const baseUrl = 'http://localhost:5001';
    const imagePath = listing.listing_image.replace(/\\/g, '/'); // Fix path separators
    return `${baseUrl}/${imagePath}/1.jpg`;
  };

  const handleImageError = (e, listing) => {
    console.error(`Failed to load image for listing ${listing.listing_id}:`, e.target.src);
    e.target.src = '/placeholder.jpg';
    e.target.onerror = null;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="listings-page">
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
          <div key={listing.listing_id} className="listing-card">
            <img
              src={getFirstImageUrl(listing)}
              alt={listing.title}
              onError={(e) => handleImageError(e, listing)}
            />

    {/* linking to listing details page */}
    <Link to={`/listing-details/${listing.listing_id}`} className="listing-card">
          <img 
          src={getFirstImageUrl(listing)}
          alt={listing.title}
          onError={(e) => handleImageError(e, listing)}
          />
      <div className="listing-info">
        <h3>{listing.title}</h3>
        <p>${listing.price}</p>
        <p>🛏 {listing.bed} Bed | 🛁 {listing.bath} Bath</p>
        <p className="text-sm text-gray-500">
          {listing.street_number} {listing.street_name}, {listing.city}, {listing.province} {listing.postal_code}
        </p>
      </div>
      <span
        className={`favorite-star ${favorites[listing.listing_id] ? "active" : ""}`}
        onClick={() => toggleFavorite(listing.listing_id)}
      >
        ★
      </span>
    </Link>
    </div>
  ))}
</div>
</div>

<div className="right-panel">
<MapView listings={listingsData} />
</div>
</div>
);
}

export default Listings;
