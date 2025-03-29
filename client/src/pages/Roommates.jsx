import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Roommates.css";

function Roommates() {
  // Filters
  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    year: "",
    program: "",
    location: ""
  });

  // Fetched roommates from the server
  const [roommates, setRoommates] = useState([]);

  // For "Connect" toggles (Request Sent)
  const [connectStatus, setConnectStatus] = useState({});

  // For "View Profile" modal
  const [selectedRoommate, setSelectedRoommate] = useState(null);

  // 1. Fetch Roommates Whenever Filters Change
  useEffect(() => {
    fetchRoommates();
    // eslint-disable-next-line
  }, [filters]);

  const fetchRoommates = async () => {
    try {
      const token = localStorage.getItem("token");
      // Build query string from filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const res = await axios.get(
        `http://localhost:5001/api/roommates?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoommates(res.data);
    } catch (error) {
      console.error("Failed to fetch roommates:", error);
    }
  };

  // 2. Update a specific filter
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 3. Clear all filters
  const clearFilters = () => {
    setFilters({
      gender: "",
      religion: "",
      year: "",
      program: "",
      location: "",
    });
  };

  // 4. Connect button toggles
  const handleConnect = (userId) => {
    setConnectStatus((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // 5. View Profile modal
  const handleViewProfile = (roommate) => {
    setSelectedRoommate(roommate);
  };

  const handleCloseProfile = () => {
    setSelectedRoommate(null);
  };

  return (
    <div className="roommates-page">
      <h1 className="page-title">Find Your Roommate</h1>

      {/* Filters Container */}
      <div className="filters-container">
        <div className="filters-grid">
          {/* Gender Filter */}
          <div className="filter-dropdown">
            <label>Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => updateFilter("gender", e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Religion Filter */}
          <div className="filter-dropdown">
            <label>Religion</label>
            <select
              value={filters.religion}
              onChange={(e) => updateFilter("religion", e.target.value)}
            >
              <option value="">All</option>
              <option value="Christian">Christian</option>
              <option value="Jewish">Jewish</option>
              <option value="Muslim">Muslim</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Sikh">Sikh</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="filter-dropdown">
            <label>Year</label>
            <select
              value={filters.year}
              onChange={(e) => updateFilter("year", e.target.value)}
            >
              <option value="">All</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
          </div>

          {/* Program Filter */}
          <div className="filter-dropdown">
            <label>Program</label>
            <select
              value={filters.program}
              onChange={(e) => updateFilter("program", e.target.value)}
            >
              <option value="">All</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Biology">Biology</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-dropdown">
            <label>Location</label>
            <select
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            >
              <option value="">All</option>
              <option value="Waterloo">Waterloo</option>
              <option value="Kitchener">Kitchener</option>
            </select>
          </div>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Display Roommates */}
      <div className="roommates-row">
        {roommates.length > 0 ? (
          roommates.map((rm) => (
            <div key={rm.users_id} className="roommate-card">
              {/* The server doesn't store images in "users" table by default, 
                  so you might add a default or placeholder. */}
              <img
                src="https://via.placeholder.com/200?text=User"
                alt={rm.name}
                className="roommate-image"
              />
              <div className="roommate-info">
                <h3>{rm.name}</h3>
                <p>
                  <span className="info-label">Age:</span> {rm.age || "N/A"}
                </p>
                <p>
                  <span className="info-label">Gender:</span> {rm.gender || "N/A"}
                </p>
                <p>
                  <span className="info-label">Religion:</span> {rm.religion || "N/A"}
                </p>
                <p>
                  <span className="info-label">University:</span> {rm.university || "N/A"}
                </p>
                <p>
                  <span className="info-label">Year:</span> {rm.year || "N/A"}
                </p>
                <p>
                  <span className="info-label">Program:</span> {rm.program || "N/A"}
                </p>
                <p>
                  <span className="info-label">About You:</span> {rm.about_you || ""}
                </p>
                <p>
                  <span className="info-label">Location:</span> {rm.location || "N/A"}
                </p>
              </div>
              <div className="roommate-actions">
                <button
                  className="profile-btn"
                  onClick={() => handleViewProfile(rm)}
                >
                  View Profile
                </button>
                <button
                  className={
                    connectStatus[rm.users_id]
                      ? "connect-btn connected"
                      : "connect-btn"
                  }
                  onClick={() => handleConnect(rm.users_id)}
                >
                  {connectStatus[rm.users_id] ? "Request Sent" : "Connect"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No matches found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedRoommate && (
        <div className="modal-overlay" onClick={handleCloseProfile}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseProfile}>
              ✕
            </button>
            <h2 className="modal-name">{selectedRoommate.name}</h2>
            <p>
              <span className="info-label">Age:</span> {selectedRoommate.age || "N/A"}
            </p>
            <p>
              <span className="info-label">Gender:</span> {selectedRoommate.gender || "N/A"}
            </p>
            <p>
              <span className="info-label">Religion:</span>{" "}
              {selectedRoommate.religion || "N/A"}
            </p>
            <p>
              <span className="info-label">University:</span>{" "}
              {selectedRoommate.university || "N/A"}
            </p>
            <p>
              <span className="info-label">Year:</span> {selectedRoommate.year || "N/A"}
            </p>
            <p>
              <span className="info-label">Program:</span>{" "}
              {selectedRoommate.program || "N/A"}
            </p>
            <p>
              <span className="info-label">About You:</span>{" "}
              {selectedRoommate.about_you || ""}
            </p>
            <p>
              <span className="info-label">Location:</span>{" "}
              {selectedRoommate.location || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roommates;
