import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import * as L from "leaflet";
import "./Listings.css";

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
    name: "228 Albert St",
    address: "228 Albert St, Waterloo, ON",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
];

function Listings() {
  const [favorites, setFavorites] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!L.Control.Geocoder) {
      console.error("Geocoder not loaded correctly.");
      return;
    }
    const geocoder = L.Control.Geocoder.nominatim();
    const fetchCoordinates = async () => {
      console.log("fetchCoordinates() is running");
      const results = await Promise.all(
        listingsData.map(async (listing) => {
          return new Promise((resolve) => {
            geocoder.geocode(listing.address, (result) => {
              if (result.length > 0) {
                console.log("Geocode Success:", listing.address, result[0].center);
                resolve({ ...listing, lat: result[0].center.lat, lng: result[0].center.lng });
              } else {
                console.warn("Geocode Failed:", listing.address);
                resolve({ ...listing, lat: null, lng: null });
              }
            });
          });
        })
      );
      setLocations(results);
    };

    fetchCoordinates();
  }, []);

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
                <p>{listing.address}</p>
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
      <MapContainer center={[43.475, -80.527]} zoom={15} className="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((listing) =>
            listing.lat && listing.lng ? (
              <Marker key={listing.id} position={[listing.lat, listing.lng]}>
                <Popup>
                  <strong>{listing.name}</strong>
                  <br />
                  {listing.address}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Listings;
