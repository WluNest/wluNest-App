"use client"

import { useState } from "react"
import "./Listings.css"

const listingsData = [
  {
    id: 1,
    name: "228 Albert St",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg", // Replace with actual image path
  },
  {
    id: 2,
    name: "228 Albert St",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
  {
    id: 3,
    name: "228 Albert St",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
  {
    id: 4,
    name: "228 Albert St",
    price: "$2,132.00 - $3,444.00",
    beds: "3 Beds",
    baths: "2 Baths",
    img: "apartment.jpg",
  },
]

function Listings({ setCurrentPage }) {
  const [favorites, setFavorites] = useState({})

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleListingClick = (id) => {
    // Navigate to individual listing view
    setCurrentPage("IndivListingView")
  }

  return (
    <div className="listings-page">
      {/* LEFT PANEL (33%) */}
      <div className="left-panel">
        <div className="filter-bar">
          <select>
            <option>All Buildings</option>
          </select>
          <select>
            <option>Rooms</option>
          </select>
          <select>
            <option>Bathrooms</option>
          </select>
          <select>
            <option>Price</option>
          </select>
          <select>
            <option>Favorites</option>
          </select>
          <button className="sort-button">Sort ⬇</button>
        </div>

        <div className="listings-scroll">
          {listingsData.map((listing) => (
            <div key={listing.id} className="listing-card" onClick={() => handleListingClick(listing.id)}>
              <img src={listing.img || "/placeholder.svg"} alt="Apartment" />
              <div className="listing-info">
                <h3>{listing.name}</h3>
                <p>{listing.price}</p>
                <p>
                  🛏 {listing.beds} | 🛁 {listing.baths}
                </p>
              </div>
              <span
                className={`favorite-star ${favorites[listing.id] ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation() // Prevent triggering the card click
                  toggleFavorite(listing.id)
                }}
              >
                ★
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (67%) */}
      <div className="right-panel">
        <div className="map-placeholder"></div>
      </div>
    </div>
  )
}

export default Listings

