"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import "./Roommates.css"

const Roommates = () => {
  const [roommatesData, setRoommatesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState("user")

  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    university: "",
    year: "",
    program: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setCurrentUserRole(decoded.role || "user")
      } catch (err) {
        console.error("Error decoding token:", err)
      }
    }
  }, [])

  const handleDeleteRoommate = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the roommates page?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.patch(
        `http://localhost:5001/api/roommates/${userId}`,
        { looking_for_roommate: false },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.success) {
        setRoommatesData((prev) => prev.filter((roommate) => roommate.users_id !== userId))
      } else {
        throw new Error(response.data.message || "Failed to update roommate status")
      }
    } catch (err) {
      console.error("Delete error:", err)
      alert(err.response?.data?.message || err.message || "Failed to remove roommate")
    }
  }

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5001/api/roommates", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRoommatesData(response.data)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load roommates")
      } finally {
        setLoading(false)
      }
    }

    fetchRoommates()
  }, [])

  const filteredRoommates = roommatesData.filter((roommate) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === "") return true
      return roommate[key]?.toString().toLowerCase() === value.toLowerCase()
    }),
  )

  const getUniqueOptions = (key) => {
    const uniqueValues = new Set()
    roommatesData.forEach((roommate) => {
      if (roommate[key]) {
        uniqueValues.add(roommate[key])
      }
    })
    return Array.from(uniqueValues).sort()
  }

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const FilterDropdown = ({ label, keyName, options, value }) => (
    <div className="filter-dropdown">
      <label>{label}:</label>
      <select value={value} onChange={(e) => updateFilter(keyName, e.target.value)}>
        <option value="">Any {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )

  const clearFilters = () => {
    setFilters({
      gender: "",
      religion: "",
      university: "",
      year: "",
      program: "",
    })
  }

  const handleEmailClick = (email) => {
    if (!email) {
      alert("This user hasn't provided an email address")
      return
    }
    window.location.href = `mailto:${email}`
  }

  if (loading) return <div className="loading">Loading roommates...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="roommate-finder-container">
      <div className="filters-container">
        <div className="filters-grid">
          <FilterDropdown label="Gender" keyName="gender" options={getUniqueOptions("gender")} value={filters.gender} />

          <FilterDropdown
            label="Religion"
            keyName="religion"
            options={getUniqueOptions("religion")}
            value={filters.religion}
          />

          <FilterDropdown
            label="University"
            keyName="university"
            options={getUniqueOptions("university")}
            value={filters.university}
          />

          <FilterDropdown label="Year" keyName="year" options={getUniqueOptions("year")} value={filters.year} />

          <FilterDropdown
            label="Program"
            keyName="program"
            options={getUniqueOptions("program")}
            value={filters.program}
          />
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      <div className="vertical-scroll-container">
        <div className="roommates-horizontal-rows">
          {filteredRoommates.length > 0 ? (
            filteredRoommates.map((roommate) => (
              <div key={roommate.users_id} className="horizontal-roommate-row">
                <div className="roommate-content">
                  <div className="roommate-header">
                    <h3 className="roommate-name">
                      {roommate.first_name} {roommate.last_name}
                    </h3>
                    <div className="roommate-details">
                      <p>
                        <span className="info-label">Gender:</span> {roommate.gender || "Not specified"}
                      </p>
                      <p>
                        <span className="info-label">Religion:</span> {roommate.religion || "Not specified"}
                      </p>
                      <p>
                        <span className="info-label">University:</span> {roommate.university || "Not specified"}
                      </p>
                      <p>
                        <span className="info-label">Year:</span> {roommate.year || "Not specified"}
                      </p>
                      <p>
                        <span className="info-label">Program:</span> {roommate.program || "Not specified"}
                      </p>
                      <p>
                        <span className="info-label">Location:</span> {roommate.city || "Not specified"}
                      </p>
                    </div>
                  </div>
                  {roommate.about_you && (
                    <div className="about-you-container">
                      <p className="about-you">{roommate.about_you}</p>
                    </div>
                  )}
                </div>
                <div className="roommate-actions">
                  <button className="email-btn" onClick={() => handleEmailClick(roommate.email)}>
                    Email
                  </button>
                  {currentUserRole === "admin" && (
                    <button className="delete-btn" onClick={() => handleDeleteRoommate(roommate.users_id)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No matches found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Roommates

