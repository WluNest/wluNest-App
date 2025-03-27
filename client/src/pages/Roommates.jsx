"use client"

import { useState } from "react"
import "./Roommates.css"

const Roommates = () => {
  const roommatesData = [
    {
      id: 1,
      name: "Alice Johnson",
      age: 21,
      gender: "Female",
      religion: "Christian",
      university: "University of Waterloo",
      year: "3rd",
      program: "Computer Science",
      location: "Waterloo",
      img: "https://via.placeholder.com/200",
    },
    {
      id: 2,
      name: "Mark Smith",
      age: 22,
      gender: "Male",
      religion: "Atheist",
      university: "Wilfrid Laurier University",
      year: "2nd",
      program: "Business Administration",
      location: "Waterloo",
      img: "https://via.placeholder.com/200",
    },
    {
      id: 3,
      name: "Sophia Lee",
      age: 20,
      gender: "Female",
      religion: "Buddhist",
      university: "University of Waterloo",
      year: "1st",
      program: "Engineering",
      location: "Kitchener",
      img: "https://via.placeholder.com/200",
    },
    {
      id: 4,
      name: "James Wilson",
      age: 23,
      gender: "Male",
      religion: "Muslim",
      university: "Wilfrid Laurier University",
      year: "4th",
      program: "Psychology",
      location: "Waterloo",
      img: "https://via.placeholder.com/200",
    },
    {
      id: 5,
      name: "Emma Davis",
      age: 21,
      gender: "Female",
      religion: "Jewish",
      university: "University of Waterloo",
      year: "2nd",
      program: "Biology",
      location: "Kitchener",
      img: "https://via.placeholder.com/200",
    },
  ]

  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    location: "",
    university: "",
    year: "",
    program: "",
  })

  const filteredRoommates = roommatesData.filter((roommate) =>
    Object.entries(filters).every(([key, value]) => value === "" || roommate[key] === value),
  )

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      gender: "",
      religion: "",
      location: "",
      university: "",
      year: "",
      program: "",
    })
  }

  return (
    <div className="roommates-page">
      <div className="roommates-container">
        <div className="roommates-header">
          <h1>Find Your Perfect Roommate</h1>
          <p>Connect with students who match your lifestyle and preferences</p>
        </div>

        <div className="filter-section">
          <div className="filter-header">
            <h2>Filter Roommates</h2>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>

          <div className="filter-grid">
            <div className="filter-item">
              <label>Gender</label>
              <select value={filters.gender} onChange={(e) => updateFilter("gender", e.target.value)}>
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Religion</label>
              <select value={filters.religion} onChange={(e) => updateFilter("religion", e.target.value)}>
                <option value="">Any Religion</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
                <option value="Atheist">Atheist</option>
                <option value="Jewish">Jewish</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Location</label>
              <select value={filters.location} onChange={(e) => updateFilter("location", e.target.value)}>
                <option value="">Any Location</option>
                <option value="Waterloo">Waterloo</option>
                <option value="Kitchener">Kitchener</option>
              </select>
            </div>

            <div className="filter-item">
              <label>University</label>
              <select value={filters.university} onChange={(e) => updateFilter("university", e.target.value)}>
                <option value="">Any University</option>
                <option value="University of Waterloo">University of Waterloo</option>
                <option value="Wilfrid Laurier University">Wilfrid Laurier University</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Year</label>
              <select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)}>
                <option value="">Any Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Program</label>
              <select value={filters.program} onChange={(e) => updateFilter("program", e.target.value)}>
                <option value="">Any Program</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Biology">Biology</option>
                <option value="Engineering">Engineering</option>
                <option value="Psychology">Psychology</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>Matching Roommates</h2>
            <span className="results-count">{filteredRoommates.length} matches found</span>
          </div>

          <div className="roommate-list">
            {filteredRoommates.length > 0 ? (
              filteredRoommates.map((roommate) => (
                <div key={roommate.id} className="roommate-card">
                  <div className="roommate-image">
                    <img src={roommate.img || "/placeholder.svg"} alt={roommate.name} />
                  </div>
                  <div className="roommate-info">
                    <h3>{roommate.name}</h3>
                    <p className="roommate-age">{roommate.age} years old</p>
                    <div className="roommate-details">
                      <div className="detail-item">
                        <span className="detail-label">Gender:</span>
                        <span className="detail-value">{roommate.gender}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">University:</span>
                        <span className="detail-value">{roommate.university}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Program:</span>
                        <span className="detail-value">{roommate.program}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Year:</span>
                        <span className="detail-value">{roommate.year}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{roommate.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="roommate-actions">
                    <button className="view-profile-btn">View Profile</button>
                    <button className="connect-btn">Connect</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No matches found. Try adjusting your preferences.</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Roommates

