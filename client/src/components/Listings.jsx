import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Listings.css";
import MapView from "./MapView";

function Listings() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [filters, setFilters] = useState({
    bed: "",
    bath: "",
    max_price: "",
    favoritesOnly: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/listings")
      .then((res) => setListings(res.data))
      .catch((err) => console.error("Failed to fetch listings:", err));
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFilteredListings = () => {
    return listings.filter((listing) => {
      const price = parseFloat(listing.price);
      if (filters.bed) {
        if (filters.bed === "3+" && listing.bed < 3) return false;
        if (filters.bed !== "3+" && listing.bed !== parseInt(filters.bed)) return false;
      }
      if (filters.bath) {
        if (filters.bath === "3+" && listing.bath < 3) return false;
        if (filters.bath !== "3+" && listing.bath !== parseInt(filters.bath)) return false;
      }
      if (filters.max_price && price > parseInt(filters.max_price)) return false;
      if (filters.favoritesOnly && !favorites[listing.listing_id]) return false;

      return true;
    });
  };

  const filteredListings = getFilteredListings();

  return (
    <div className="listings-page">
      <div className="left-panel">
        <div className="filter-bar">
          <select onChange={(e) => setFilters({ ...filters, bed: e.target.value })}>
            <option value="">All Beds</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3+">3+ Beds</option>
          </select>

          <select onChange={(e) => setFilters({ ...filters, bath: e.target.value })}>
            <option value="">All Baths</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3+">3+ Baths</option>
          </select>

          <select onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}>
            <option value="">Any Price</option>
            <option value="1000">Under $1000</option>
            <option value="1500">Under $1500</option>
            <option value="2000">Under $2000</option>
            <option value="2500">Under $2500</option>
          </select>

          <select onChange={(e) => setFilters({ ...filters, favoritesOnly: e.target.value === "true" })}>
            <option value="false">All Listings</option>
            <option value="true">Favorites Only</option>
          </select>
        </div>

        <div className="listings-scroll">
          {filteredListings.length === 0 ? (
            <p>No listings match your filters.</p>
          ) : (
            filteredListings.map((listing) => (
              <div key={listing.listing_id} className="listing-card">
                <img
                  src={`http://localhost:5001/${listing.listing_image}/1.jpg`}
                  alt={listing.title}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p>${listing.price}</p>
                  <p>
                    🛏 {listing.bed} Bed | 🛁 {listing.bath} Bath
                  </p>
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
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-panel">
        <MapView listings={filteredListings} />
      </div>
    </div>
  );
}

export default Listings;
