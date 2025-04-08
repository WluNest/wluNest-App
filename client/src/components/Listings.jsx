/**
 * Listings Component
 *
 * This component displays a list of real estate listings and provides functionality
 * for users to filter, view, and interact with the listings. It also includes
 * features for managing favorites, viewing details of a selected listing in a modal,
 * and interacting with a map view to see listing locations.
 *
 * Key Features:
 *   - Fetches and displays listings from an external API.
 *   - Allows users to filter listings by number of beds, baths, price, and favorites.
 *   - Displays listing information like title, price, and address.
 *   - Supports adding/removing listings to/from favorites.
 *   - Clicking a listing opens a modal with more detailed information.
 *   - In the modal, users can view images, description, and amenities.
 *   - Authenticated users can edit or delete their own listings.
 *   - Displays a map view of the filtered listings on the right panel.
 *
 * Functionality:
 *   - `getFilteredListings`: Filters the listings based on user-selected filters.
 *   - `toggleFavorite`: Toggles the favorite status of a listing.
 *   - `handleDelete`: Deletes a listing after user confirmation.
 *   - `ListingModal`: A modal for viewing and editing the selected listing.
 *
 * Dependencies:
 *   - React (useState, useEffect)
 *   - listingService (API calls for listings)
 *   - authService (User authentication and session management)
 *   - MapView (A component that displays listings on a map)
 *   - CSS for styling (`Listings.css`)
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
"use client"

import { useState, useEffect } from "react"
import "./Listings.css"
import placeholder from "./placeholder.jpg"
import MapView from "./MapView"
import listingService from "../services/ListingService"
import authService from "../services/AuthService"

function Listings() {
  const [listings, setListings] = useState([])
  const [favorites, setFavorites] = useState({})
  const [selectedListing, setSelectedListing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    bed: "",
    bath: "",
    max_price: "",
    favoritesOnly: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Get current user
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)

        // Fetch listings
        const fetchedListings = await listingService.getListings()
        setListings(fetchedListings)
      } catch (err) {
        setError(err.message || "Failed to fetch listings")
        console.error("Failed to fetch listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getFilteredListings = () => {
    return listings.filter((listing) => {
      const price = Number.parseFloat(listing.price)

      // Bed filter
      if (filters.bed) {
        if (filters.bed === "3+" && listing.bed < 3) return false
        if (filters.bed !== "3+" && listing.bed !== Number.parseInt(filters.bed)) return false
      }

      // Bath filter
      if (filters.bath) {
        if (filters.bath === "3+" && listing.bath < 3) return false
        if (filters.bath !== "3+" && listing.bath !== Number.parseInt(filters.bath)) return false
      }

      // Price filter
      if (filters.max_price && price > Number.parseInt(filters.max_price)) return false

      // Favorites filter
      if (filters.favoritesOnly && !favorites[listing.listing_id]) return false

      return true
    })
  }

  const handleDelete = async (listingId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this listing?")
      if (!confirmDelete) return

      await listingService.deleteListing(listingId)

      setListings((prev) => prev.filter((l) => l.listing_id !== listingId))
      setShowModal(false)
      setSelectedListing(null)
      alert("Listing deleted successfully.")
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Failed to delete listing.")
    }
  }

  const filteredListings = getFilteredListings()

  if (loading) return <div className="loading">Loading listings...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="listings-page">
      <div className="left-panel">
        <div className="filter-bar">
          <select value={filters.bed} onChange={(e) => setFilters({ ...filters, bed: e.target.value })}>
            <option value="">All Beds</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3+">3+ Beds</option>
          </select>

          <select value={filters.bath} onChange={(e) => setFilters({ ...filters, bath: e.target.value })}>
            <option value="">All Baths</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3+">3+ Baths</option>
          </select>

          <select value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}>
            <option value="">Any Price</option>
            <option value="1000">Under $1000</option>
            <option value="1500">Under $1500</option>
            <option value="2000">Under $2000</option>
            <option value="2500">Under $2500</option>
          </select>

          <select
            value={filters.favoritesOnly}
            onChange={(e) => setFilters({ ...filters, favoritesOnly: e.target.value === "true" })}
          >
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
                  setSelectedListing(listing)
                  setShowModal(true)
                }}
              >
                <img
                  src={`http://localhost:5001/images/listings/${listing.listing_id}/1.jpg`}
                  alt={listing.title}
                  onError={(e) => (e.target.src = placeholder)}
                />
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p>{listing.formattedPrice}</p>
                  <p>
                    🛏 {listing.bed} Bed | 🛁 {listing.bath} Bath
                  </p>
                  <p className="text-sm text-gray-500">{listing.fullAddress}</p>
                </div>
                <span
                  className={`favorite-star ${favorites[listing.listing_id] ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(listing.listing_id)
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
            setShowModal(false)
            setSelectedListing(null)
          }}
          onDelete={handleDelete}
          user={user}
        />
      )}
    </div>
  )
}

const ListingModal = ({ listing, onClose, onDelete, user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [formData, setFormData] = useState({
    ...listing,
    has_laundry: !!listing.has_laundry,
    has_parking: !!listing.has_parking,
    has_gym: !!listing.has_gym,
    has_hvac: !!listing.has_hvac,
    has_wifi: !!listing.has_wifi,
    has_game_room: !!listing.has_game_room,
    is_pet_friendly: !!listing.is_pet_friendly,
    is_accessible: !!listing.is_accessible,
  })

  // Generate image paths
  const imageCount = listing.imageCount || 10 // Default to 10 if not specified
  const imagePaths = listing.getImagePaths(imageCount)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagePaths.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagePaths.length - 1 : prev - 1))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSave = async () => {
    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        bed: Number.parseInt(formData.bed),
        bath: Number.parseInt(formData.bath),
        url: formData.url,
        has_laundry: formData.has_laundry ? 1 : 0,
        has_parking: formData.has_parking ? 1 : 0,
        has_gym: formData.has_gym ? 1 : 0,
        has_hvac: formData.has_hvac ? 1 : 0,
        has_wifi: formData.has_wifi ? 1 : 0,
        has_game_room: formData.has_game_room ? 1 : 0,
        is_pet_friendly: formData.is_pet_friendly ? 1 : 0,
        is_accessible: formData.is_accessible ? 1 : 0,
        street_name: formData.street_name,
        street_number: formData.street_number,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postal_code,
      }

      console.log("Sending update with data:", updatedData)
      await listingService.updateListing(listing.listing_id, updatedData)

      alert("Listing updated successfully.")
      window.location.reload()
    } catch (err) {
      console.error("Update failed:", err)
      alert("Update failed: " + (err.message || "Unknown error"))
    }
  }

  const amenities = listing.getAmenities()

  const isOwner = user && (Number.parseInt(user.id) === Number.parseInt(listing.users_id) || user.isAdmin())

  const handleInquireClick = () => {
    console.log("Listing URL:", listing.url)

    // More robust check for URL existence
    if (!listing.url || listing.url.trim() === "") {
      alert("No URL provided for this listing")
      return
    }

    // Ensure URL has proper protocol
    let formattedUrl = listing.url.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`
    }

    console.log("Opening URL:", formattedUrl)
    window.open(formattedUrl, "_blank")
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="image-gallery-container">
          <div className="main-image-view">
            <img
              className="modal-image"
              src={imagePaths[currentImageIndex] || "/placeholder.svg"}
              alt={`${listing.title} - Image ${currentImageIndex + 1}`}
              onError={(e) => {
                e.target.src = placeholder
                e.target.style.display = "none"
              }}
            />

            {imagePaths.length > 1 && (
              <>
                <button
                  className="image-nav prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                >
                  ‹
                </button>

                <button
                  className="image-nav next"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                >
                  ›
                </button>

                <div className="image-counter">
                  {currentImageIndex + 1} / {imagePaths.length}
                </div>
              </>
            )}
          </div>

          <div className="thumbnail-container">
            {imagePaths.map((img, index) => (
              <div key={index} className="thumbnail-wrapper">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {isEditing ? (
          <input className="modal-input" name="title" value={formData.title} onChange={handleChange} />
        ) : (
          <h2 className="modal-title">{listing.title}</h2>
        )}

        {isEditing ? (
          <textarea
            className="modal-textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        ) : (
          <p className="modal-description">{listing.description}</p>
        )}

        <div className="modal-info">
          {isEditing ? (
            <>
              <input className="modal-input small" name="price" value={formData.price} onChange={handleChange} />
              <input className="modal-input small" name="bed" value={formData.bed} onChange={handleChange} />
              <input className="modal-input small" name="bath" value={formData.bath} onChange={handleChange} />
            </>
          ) : (
            <p className="modal-stats">
              <strong>{listing.formattedPrice}</strong> | 🛏 {listing.bed} Bed | 🛁 {listing.bath} Bath
            </p>
          )}
        </div>

        <div className="modal-amenities">
          <h4>Amenities</h4>
          {isEditing ? (
            <div className="amenities-checkboxes">
              {amenities.map(({ label, key }) => (
                <label key={key}>
                  <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} /> {label}
                </label>
              ))}
            </div>
          ) : (
            <ul>
              {amenities
                .filter((amenity) => amenity.value)
                .map(({ label, key }) => (
                  <li key={key}>✔️ {label}</li>
                ))}
            </ul>
          )}
        </div>

        {isEditing ? (
          <input className="modal-input" name="url" value={formData.url} onChange={handleChange} />
        ) : (
          <button className="inquire-button" onClick={handleInquireClick}>
            Inquire
          </button>
        )}

        {isOwner && !isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Listing
          </button>
        )}

        {isOwner && isEditing && (
          <div className="edit-controls">
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}

        {isOwner && !isEditing && (
          <button className="delete-button" onClick={() => onDelete(listing.listing_id)}>
            Delete Listing
          </button>
        )}
      </div>
    </div>
  )
}

export default Listings
