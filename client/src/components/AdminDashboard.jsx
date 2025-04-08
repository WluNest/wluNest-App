//AdminDashboard

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/listings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setListings(res.data))
      .catch((err) => console.error("Error fetching admin listings", err));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5001/api/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setListings((prev) => prev.filter((l) => l.listing_id !== id));
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  const filteredListings = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <input
        className="search-bar"
        type="text"
        placeholder="Search by title or username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Posted By</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => (
              <tr key={listing.listing_id}>
                <td>{listing.listing_id}</td>
                <td>{listing.title}</td>
                <td>${parseFloat(listing.price).toFixed(2)}</td>
                <td>{listing.username}</td>
                <td>{listing.email}</td>
                <td>
                 
                  <button className="delete-btn" onClick={() => handleDelete(listing.listing_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
