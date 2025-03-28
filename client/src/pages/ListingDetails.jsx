import React, { useEffect, useState } from 'react';
import "./Buildings";
import { useParams } from "react-router-dom";
import "./ListingDetails.css";
import axios from "axios";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    axios
    .get(`http://localhost:5001/api/listings/${id}`)
    .then((res) => setListing(res.data))
    .catch((err) => {
      console.error("Failed to fetch listing:", err) 
      setListing(null)
    });
  }, [id]);

  if (!listing) return <p>Loading...</p>;
  if (listing === null) return <p>Failed to load listing details.</p>;

  return (
    <div className="listing-details">
      <h2>{listing.title}</h2>
      <p>Price: {listing.price}</p>
      <p>🛏 {listing.bed} Bed | 🛁 {listing.bath} Bath</p>
      <img src={`http://localhost:5001/${listing.listing_image}`} alt={listing.title} />

      {/* button to redirect users to external website */}
      <a href={listing.bookingUrl} target="_blank" rel='noopener noreferrer'>
        <button>Book Now</button>
      </a>
    </div>
  );
}

export default ListingDetails;