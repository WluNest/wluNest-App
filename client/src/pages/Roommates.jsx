"use client"

import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import roommateService from "../services/RoommateService"
import "./Roommates.css"

class RoommateFilter {
  constructor() {
    this.gender = ""
    this.religion = ""
    this.university = ""
    this.year = ""
    this.program = ""
  }

  clear() {
    this.gender = ""
    this.religion = ""
    this.university = ""
    this.year = ""
    this.program = ""
  }

  clone() {
    const newFilter = new RoommateFilter()
    Object.assign(newFilter, this)
    return newFilter
  }
}

class AuthService {
  static getCurrentUserRole() {
    const token = localStorage.getItem("token")
    if (!token) return "user"

    try {
      const decoded = jwtDecode(token)
      return decoded.role || "user"
    } catch (err) {
      console.error("Error decoding token:", err)
      return "user"
    }
  }
}

const FilterDropdown = ({ label, keyName, options, value, onChange }) => (
  <div className="filter-dropdown">
    <label>{label}:</label>
    <select value={value} onChange={(e) => onChange(keyName, e.target.value)}>
      <option value="">Any {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
)

const RoommateCard = ({ roommate, currentUserRole, onEmailClick, onDelete }) => (
  <div className="horizontal-roommate-row">
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
      <button className="email-btn" onClick={() => onEmailClick(roommate.email)}>
        Email
      </button>
      {currentUserRole === "admin" && (
        <button className="delete-btn" onClick={() => onDelete(roommate.users_id)}>
          Remove
        </button>
      )}
    </div>
  </div>
)

const FiltersSection = ({ roommates, filters, onFilterChange, onClearFilters }) => (
  <div className="filters-container">
    <div className="filters-grid">
      <FilterDropdown
        label="Gender"
        keyName="gender"
        options={roommateService.getUniqueOptions(roommates, "gender")}
        value={filters.gender}
        onChange={onFilterChange}
      />

      <FilterDropdown
        label="Religion"
        keyName="religion"
        options={roommateService.getUniqueOptions(roommates, "religion")}
        value={filters.religion}
        onChange={onFilterChange}
      />

      <FilterDropdown
        label="University"
        keyName="university"
        options={roommateService.getUniqueOptions(roommates, "university")}
        value={filters.university}
        onChange={onFilterChange}
      />

      <FilterDropdown
        label="Year"
        keyName="year"
        options={roommateService.getUniqueOptions(roommates, "year")}
        value={filters.year}
        onChange={onFilterChange}
      />

      <FilterDropdown
        label="Program"
        keyName="program"
        options={roommateService.getUniqueOptions(roommates, "program")}
        value={filters.program}
        onChange={onFilterChange}
      />
    </div>

    <button className="clear-filters-btn" onClick={onClearFilters}>
      Clear Filters
    </button>
  </div>
)

const Roommates = () => {
  const [roommates, setRoommates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState("user")
  const [filters, setFilters] = useState(new RoommateFilter())

  const filteredRoommates = roommateService.filterRoommates(roommates, filters)

  useEffect(() => {
    setCurrentUserRole(AuthService.getCurrentUserRole())
  }, [])

  const handleDeleteRoommate = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the roommates page?")) {
      return
    }

    try {
      await roommateService.updateRoommateStatus(userId, false)
      setRoommates((prev) => prev.filter((roommate) => roommate.users_id !== userId))
    } catch (err) {
      console.error("Delete error:", err)
      alert(err.message || "Failed to remove roommate")
    }
  }

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await roommateService.getRoommates()
        setRoommates(data)
      } catch (err) {
        setError(err.message || "Failed to load roommates")
      } finally {
        setLoading(false)
      }
    }

    fetchRoommates()
  }, [])

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const newFilters = prev.clone()
      newFilters[key] = value
      return newFilters
    })
  }

  const clearFilters = () => {
    setFilters(new RoommateFilter())
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
      <FiltersSection
        roommates={roommates}
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />

      <div className="vertical-scroll-container">
        <div className="roommates-horizontal-rows">
          {filteredRoommates.length > 0 ? (
            filteredRoommates.map((roommate) => (
              <RoommateCard
                key={roommate.users_id}
                roommate={roommate}
                currentUserRole={currentUserRole}
                onEmailClick={handleEmailClick}
                onDelete={handleDeleteRoommate}
              />
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