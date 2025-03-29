import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Listings.css";
import placeholder from "./placeholder.jpg";
import MapView from "./MapView";

function Listings() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
              <div
                key={listing.listing_id}
                className="listing-card"
                onClick={() => {
                  setSelectedListing(listing);
                  setShowModal(true);
                }}
              >
                <img
                  src={`http://localhost:5001/${listing.listing_image}/1.jpg`}
                  alt={listing.title}
                  onError={(e) => (e.target.src = placeholder)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(listing.listing_id);
                  }}
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

      {showModal && (
        <ListingModal
          listing={selectedListing}
          onClose={() => {
            setShowModal(false);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
}

const ListingModal = ({ listing, onClose }) => {
  if (!listing) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <img
          src={`http://localhost:5001/${listing.listing_image}/1.jpg`}
          alt={listing.title}
          onError={(e) => (e.target.src = placeholder)}
        />

        <h2 className="modal-title">{listing.title}</h2>
        <p className="modal-price"><strong>Price:</strong> ${listing.price}</p>

        <div className="modal-info">
          <p><strong>Beds:</strong> {listing.bed}</p>
          <p><strong>Baths:</strong> {listing.bath}</p>
        </div>

        <p className="modal-address">
          <strong>Address:</strong> {listing.street_number} {listing.street_name}, {listing.city}, {listing.province}, {listing.postal_code}
        </p>

        <p className="modal-description">{listing.description}</p>

        <button
          className="inquire-button"
          onClick={() => {
            // Placeholder for future redirect
            window.location.href = "#"; 
          }}
        >
          Inquire
        </button>
      </div>
    </div>
  );
};


export default Listings;
