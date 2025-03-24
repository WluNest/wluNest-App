import React, { useState } from 'react';
import "./Roommates.css";

const Roommates = () => {
  const roommatesData = [
    {/* Dummy Accounts*/},
    {/*...*/},
  ];

  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [program, setProgram] = useState("");  

  const filteredRoommates = roommatesData.filter((roommate) => {
    return (
      (gender === "" || roommate.gender === gender) &&
      (religion === "" || roommate.religion === religion) &&
      (location === "" || roommate.location === location) &&
      (university === "" || roommate.university === university) &&
      (year === "" || roommate.year === year) &&
      (program === "" || roommate.program === program)
    );
  });

  return (
    <div className="roommate-finder">
      <h1>Find Your Roommate</h1>

    <div className="filter-section">
      <div>
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label>Religion:</label>
        <select value={religion} onChange={(e) => setReligion(e.target.value)}>
          <option value="">Any</option>
          <option value="Christian">Christian</option>
          <option value="Muslim">Muslim</option>
          <option value="Atheist">Atheist</option>
          <option value="Jewish">Jewish</option>
          <option value="Sikh">Sikh</option>
          <option value="Buddhist">Buddhist</option>
        </select>
      </div>
    </div>

    <div>
      <label>Location:</label>
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">Any</option>
        <option value="Waterloo">Waterloo</option>
        <option value="Kitchener">Kitchener</option>
      </select>
    </div>

    <div>
      <label>University:</label>
      <select value={university} onChange={(e) => setUniversity(e.target.value)}>
        <option value="">Any</option>
        <option value="University of Waterloo">University of Waterloo</option>
        <option value="Wilfrid Laurier University">Wilfrid Laurier University</option>
      </select>
    </div>

    <div>
      <label>Year:</label>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Any</option>
        <option value="1st">1st</option>
        <option value="2nd">2nd</option>
        <option value="3rd">3rd</option>
        <option value="4th">4th</option>
      </select>
    </div>

    <div>
      <label>Program:</label>
      <select value={program} onChange={(e) => setProgram(e.target.value)}>
        <option value="">Any</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Business Administration">Business Administration</option>      
        <option value="Biology">Biology</option>
        <option value="Engineering">Engineering</option>
      </select>
    </div>

    <button className="clear-filters-btn" 
      onClick={() => {
      setGender("");
      setReligion("");
      setLocation("");
      setUniversity("");
      setYear("");
      setProgram("");
      }}>
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
