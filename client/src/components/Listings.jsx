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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

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

  const handleDelete = async (listingId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5001/api/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setListings((prev) => prev.filter((l) => l.listing_id !== listingId));
      setShowModal(false);
      setSelectedListing(null);
      alert("Listing deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete listing.");
    }
  };

  return (
    <div className="listings-page">
      <div className="left-panel">
        <div className="listings-scroll">
          {listings.map((listing) => (
            <div
              key={listing.listing_id}
              className="listing-card"
              onClick={() => {
                setSelectedListing(listing);
                setShowModal(true);
              }}
            >
              <img
                src={`http://localhost:5001/images/listings/${listing.listing_id}/1.jpg`}
                alt={listing.title}
                onError={(e) => (e.target.src = placeholder)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(listing.listing_id);
                }}
              >
                ★
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">
        <MapView listings={listings} />
      </div>

      {showModal && (
        <ListingModal
          listing={selectedListing}
          onClose={() => {
            setShowModal(false);
            setSelectedListing(null);
          }}
          onDelete={handleDelete}
          user={user}
        />
      )}
    </div>
  );
}

const ListingModal = ({ listing, onClose, onDelete, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  });

  // Generate image paths (1.jpg to 10.jpg)
const imageCount = listing.imageCount || 10; // Default to 10 if not specified

const imagePaths = Array.from({ length: imageCount }, (_, i) => 
    `http://localhost:5001/images/listings/${listing.listing_id}/${i + 1}.jpg`
);
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
        prev === imagePaths.length - 1 ? 0 : prev + 1
    );
};

const prevImage = () => {
    setCurrentImageIndex((prev) => 
        prev === 0 ? imagePaths.length - 1 : prev - 1
    );
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        bed: parseInt(formData.bed),
        bath: parseInt(formData.bath),
        url: formData.url,
        has_laundry: formData.has_laundry ? 1 : 0,
        has_parking: formData.has_parking ? 1 : 0,
        has_gym: formData.has_gym ? 1 : 0,
        has_hvac: formData.has_hvac ? 1 : 0,
        has_wifi: formData.has_wifi ? 1 : 0,
        has_game_room: formData.has_game_room ? 1 : 0,
        is_pet_friendly: formData.is_pet_friendly ? 1 : 0,
        is_accessible: formData.is_accessible ? 1 : 0,
      };
  
      const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
  
      await axios.put(
        `http://localhost:5001/api/listings/${listing.listing_id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
  
      alert("Listing updated successfully.");
      window.location.reload();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed.");
    }
  };

  const amenities = [
    { label: "Laundry", key: "has_laundry" },
    { label: "Parking", key: "has_parking" },
    { label: "Gym", key: "has_gym" },
    { label: "HVAC", key: "has_hvac" },
    { label: "Wi-Fi", key: "has_wifi" },
    { label: "Game Room", key: "has_game_room" },
    { label: "Pet Friendly", key: "is_pet_friendly" },
    { label: "Accessible", key: "is_accessible" },
  ];

  const isOwner = user && (parseInt(user.id) === parseInt(listing.users_id) || user.role === "admin");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>

        <div className="image-gallery-container">
          <div className="main-image-view">
            <img
              className="modal-image"
              src={imagePaths[currentImageIndex]}
              alt={`${listing.title} - Image ${currentImageIndex + 1}`}
              onError={(e) => {
                e.target.src = placeholder;
                e.target.style.display = 'none';
              }}
            />
            
            {imagePaths.length > 1 && (
              <>
                <button className="image-nav prev" onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}>‹</button>
                
                <button className="image-nav next" onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}>›</button>
                
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
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
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
          <textarea className="modal-textarea" name="description" value={formData.description} onChange={handleChange} />
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
              <strong>${listing.price}</strong> | 🛏 {listing.bed} Bed | 🛁 {listing.bath} Bath
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
              {amenities.map(({ label, key }) =>
                listing[key] ? <li key={key}>✔️ {label}</li> : null
              )}
            </ul>
          )}
        </div>

        {isEditing ? (
          <input className="modal-input" name="url" value={formData.url} onChange={handleChange} />
        ) : (
          <button
            className="inquire-button"
            onClick={() => {
              const formattedUrl = listing.url?.startsWith("http") ? listing.url : `https://${listing.url}`;
              window.open(formattedUrl, "_blank");
            }}
          >
            Inquire
          </button>
        )}

        {isOwner && !isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Listing</button>
        )}

        {isOwner && isEditing && (
          <div className="edit-controls">
            <button className="save-button" onClick={handleSave}>Save Changes</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}

        {isOwner && !isEditing && (
          <button className="delete-button" onClick={() => onDelete(listing.listing_id)}>
            Delete Listing
          </button>
        )}
      </div>
    </div>
  );
};

export default Listings;