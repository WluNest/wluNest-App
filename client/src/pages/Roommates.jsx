import React, { useState } from 'react';
import "./Roommates.css";

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
      img: "https://via.placeholder.com/200" 
    },
    { 
      id: 2,
      name: "Mark Smith", 
      age: 22, 
      gender: "Male",
      religion: "Jewish",
      university: "Wilfrid Laurier University", 
      year: "4th",
      program: "Business Administration",
      location: "Kitchener",
      img: "https://via.placeholder.com/200" 
    },
    { 
      id: 3,
      name: "Sophia Lee", 
      age: 20, 
      gender: "Female",
      religion: "Buddhist",
      university: "University of Waterloo", 
      year: "2nd",
      program: "Biology",
      location: "Waterloo",
      img: "https://via.placeholder.com/200" 
    }
  ];

  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    location: "",
    university: "",
    year: "",
    program: "",
  });

  const filteredRoommates = roommatesData.filter((roommate) => 
    Object.entries(filters).every(([key, value]) => value === "" || roommate[key] === value)
  );

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value, 
    }));
  };

  const FilterDropdown = ({ label, options, value, onChange }) => (
    <div className="filter-dropdown">
      <label>{label}:</label>
      <select value={value} onChange={onChange}>
        <option value="">Any {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const clearFilters = () => {
    setFilters({
      gender: "",
      religion: "",
      location: "",
      university: "",
      year: "",
      program: "",
    });
  };

  return (
    <div className="roommate-finder-container">
      <h1 className="page-title">Find Your Roommate</h1>

      <div className="filters-container">
        <div className="filters-grid">
          <FilterDropdown 
            label="Gender" 
            options={["Male", "Female", "Other"]}
            value={filters.gender} 
            onChange={(e) => updateFilter("gender", e.target.value)}
          />

          <FilterDropdown 
            label="Religion" 
            options={["Christian", "Muslim", "Jewish", "Sikh", "Buddhist"]} 
            value={filters.religion} 
            onChange={(e) => updateFilter("religion", e.target.value)}
          />

          <FilterDropdown 
            label="Location" 
            options={["Waterloo", "Kitchener"]} 
            value={filters.location} 
            onChange={(e) => updateFilter("location", e.target.value)}
          />

          <FilterDropdown 
            label="University" 
            options={["University of Waterloo", "Wilfrid Laurier University"]} 
            value={filters.university} 
            onChange={(e) => updateFilter("university", e.target.value)}
          />

          <FilterDropdown 
            label="Year" 
            options={["1st", "2nd", "3rd", "4th"]} 
            value={filters.year} 
            onChange={(e) => updateFilter("year", e.target.value)}
          />

          <FilterDropdown 
            label="Program" 
            options={["Computer Science", "Business Administration", "Biology", "Engineering"]} 
            value={filters.program} 
            onChange={(e) => updateFilter("program", e.target.value)}
          />
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      
      <div className="roommates-grid">
        {filteredRoommates.length > 0 ? (
          filteredRoommates.map((roommate) => (
            <div key={roommate.id} className="roommate-card">
              <img src={roommate.img} alt={roommate.name} className="roommate-image" />
              <div className="roommate-info">
                <h3>{roommate.name}</h3>
                <p><span className="info-label">Age:</span> {roommate.age}</p>
                <p><span className="info-label">Gender:</span> {roommate.gender}</p>
                <p><span className="info-label">Religion:</span> {roommate.religion}</p>
                <p><span className="info-label">University:</span> {roommate.university}</p>
                <p><span className="info-label">Year:</span> {roommate.year}</p>
                <p><span className="info-label">Program:</span> {roommate.program}</p>
                <p><span className="info-label">Location:</span> {roommate.location}</p>
              </div>
              <div className="roommate-actions">
                <button className="profile-btn">View Profile</button>
                <button className="connect-btn">Connect</button>
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
  );
};

export default Roommates;