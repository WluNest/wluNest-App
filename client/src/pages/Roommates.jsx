import React, { useState } from 'react';
import "./Roommates.css";

const Roommates = () => {
  const roommatesData = [
    {/*...*/}, 
  ];

  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    location: "",
    university: "",
    year: "",
    program: "",
  })

  const filteredRoommates = roommatesData.filter((roommate) => 
    Object.entries(filters).every(([key, value]) => value = "" || roommate[key] === value)
  );

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value, 
    }));
  };

  const FilterDropdown = ({ label, options, value, onChange }) => (
    <div>
      <label>{label}:</label>
      <select value={value} onChange={onChange}>
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="roommate-finder">
      <h1>Find Your Roommate</h1>

    <div className="filter-section">
      <div>
        <FilterDropdown 
          label="Gender" 
          options={["Male", "Female", "Other"]}
          value={filters.gender} 
          onChange={(e) => updateFilter("gender", e.target.value)}/>
      </div>

      <div>
        <FilterDropdown 
          label = "Religion" 
          options={["Christian", "Muslim", "Jewish", "Sikh", "Buddhist"]} 
          value={filters.religion} 
          onChange={(e) => updateFilter("religion", e.target.value)}/>
      </div>
    </div>

    <div>
        <FilterDropdown 
          label = "Location" 
          options={["Waterloo", "Kitchener"]} 
          value={filters.location} 
          onChange={(e) => updateFilter("location", e.target.value)}/>
    </div>

    <div>
      <FilterDropdown 
          label = "University" 
          options={["University of Waterloo", "Wilfrid Laurier University"]} 
          value={filters.university} 
          onChange={(e) => updateFilter("university", e.target.value)}/>
    </div>

    <div>
      <FilterDropdown 
          label = "Year" 
          options={["1st", "2nd", "3rd", "4th"]} 
          value={filters.year} 
          onChange={(e) => updateFilter("year", e.target.value)}/>
    </div>

    <div>
      <FilterDropdown 
          label = "Program" 
          options={["Computer Science", "Business Administration", "Biology", "Engineering"]} 
          value={filters.program} 
          onChange={(e) => updateFilter("program", e.target.value)}/>
    </div>

    <button className="clear-filters-btn" 
      onClick={() => setFilters({
      gender: "",
      religion: "",
      location: "",
      university: "",
      year: "",
      program: "",
      })}>
      Clear Filters
    </button>
    
    <div className="roommates-list">
      {filteredRoommates.length > 0 ? (
      filteredRoommates.map((roommate) => (
        <div key={roommate.id} className="roommate-card">
          <h3>{roommate.name}</h3>
          <p><strong>Gender:</strong> {roommate.gender}</p>
          <p><strong>Religion:</strong> {roommate.religion}</p>
          <p><strong>University:</strong> {roommate.university}</p>
          <p><strong>Year:</strong> {roommate.year}</p>
          <p><strong>Program:</strong> {roommate.program}</p>
          <p><strong>Location:</strong> {roommate.location}</p>
          <button>View Profile</button>
          <button>Connect</button>
        </div>
      ))
    ) : (
      <p>No matches found. Try adjusting your preferences.</p>
    )}
    </div>
  </div>
  );
};

export default Roommates;
