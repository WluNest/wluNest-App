"use client"

import { useState } from "react"
import "./IndivListingView.css"

const IndivListingView = ({ setCurrentPage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  // Sample data for the listing
  const listing = {
    id: 1,
    name: "228 Albert St",
    price: "$2,132.00 - $3,444.00",
    beds: 3,
    baths: 2,
    sqft: 1200,
    description:
      "Luxury student apartment located just minutes from Wilfrid Laurier University. This spacious 3-bedroom unit features modern appliances, in-suite laundry, and a private balcony with city views. Building amenities include a fitness center, study rooms, and 24/7 security.",
    features: [
      "In-suite laundry",
      "Stainless steel appliances",
      "Hardwood floors",
      "Central air conditioning",
      "High-speed internet included",
      "Private balcony",
      "Secured building access",
      "Fitness center",
      "Study rooms",
      "Bike storage",
    ],
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    address: "228 Albert Street, Waterloo, ON N2L 3V8",
    availability: "September 1, 2025",
    landlord: "University Housing Inc.",
    utilities: "Water included, electricity and internet extra",
    petPolicy: "No pets allowed",
    nearbyAmenities: [
      "5 min walk to Wilfrid Laurier University",
      "10 min walk to University of Waterloo",
      "Grocery store across the street",
      "Bus stop at the corner",
      "Multiple restaurants within walking distance",
    ],
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitContact = (e) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    alert(`Contact request submitted for ${listing.name}!`)
    setShowContactForm(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
  }

  const handleBackToListings = () => {
    // Navigate back to listings page
    if (setCurrentPage) {
      setCurrentPage("listings")
    }
  }

  return (
    <div className="indiv-listing-view">
      <div className="listing-container">
        {/* Back button */}
        <button className="back-button" onClick={handleBackToListings}>
          ← Back to Listings
        </button>

        {/* Image carousel */}
        <div className="image-carousel">
          <button className="carousel-btn prev" onClick={handlePrevImage}>
            ❮
          </button>
          <img
            src={listing.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${listing.name} - Image ${currentImageIndex + 1}`}
            className="listing-image"
          />
          <button className="carousel-btn next" onClick={handleNextImage}>
            ❯
          </button>
          <div className="image-counter">
            {currentImageIndex + 1} / {listing.images.length}
          </div>
        </div>

        {/* Listing header */}
        <div className="listing-header">
          <div className="listing-title-section">
            <h1>{listing.name}</h1>
            <p className="listing-address">{listing.address}</p>
          </div>
          <div className="listing-price-section">
            <h2 className="listing-price">{listing.price}</h2>
            <button
              className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? "❤ Remove from Favorites" : "❤ Add to Favorites"}
            </button>
          </div>
        </div>

        {/* Listing details */}
        <div className="listing-details">
          <div className="listing-specs">
            <div className="spec-item">
              <span className="spec-icon">🛏️</span>
              <span className="spec-value">{listing.beds} Beds</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🚿</span>
              <span className="spec-value">{listing.baths} Baths</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📏</span>
              <span className="spec-value">{listing.sqft} sqft</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📅</span>
              <span className="spec-value">Available: {listing.availability}</span>
            </div>
          </div>

          <div className="listing-description">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>

          <div className="listing-features">
            <h3>Features & Amenities</h3>
            <ul className="features-list">
              {listing.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="listing-nearby">
            <h3>Location & Nearby</h3>
            <ul className="nearby-list">
              {listing.nearbyAmenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          <div className="listing-additional-info">
            <h3>Additional Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Landlord/Property Manager:</span>
                <span className="info-value">{listing.landlord}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Utilities:</span>
                <span className="info-value">{listing.utilities}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pet Policy:</span>
                <span className="info-value">{listing.petPolicy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="contact-section">
          {!showContactForm ? (
            <button className="contact-btn" onClick={() => setShowContactForm(true)}>
              Contact Landlord
            </button>
          ) : (
            <div className="contact-form-container">
              <h3>Contact about {listing.name}</h3>
              <form onSubmit={handleSubmitContact} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Send Message
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowContactForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IndivListingView

