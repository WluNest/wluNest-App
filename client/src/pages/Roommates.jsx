import React, { useState } from 'react'

const Roommates = () => {
  const [roommates, setRoommates] = useState([
    { id: 1, name: "Alice", interests: "Cooking, Traveling", location: "Waterloo" },
    { id: 2, name: "Bob", interests: "Music, Sports", location: "Waterloo" },
    { id: 3, name: "Charlie", interests: "Photography, Traveling", location: "Waterloo" },
  ]);

  return (
    <div className="roommates-page">
      <h1>Find Your Roommate</h1>
    
    <div className="search-bar">
      <input type="text" placeholder="Search roommates..." />
    </div>

    <div className="roommates-list">
      {roommates.map((roommate) => (
        <div key={roommate.id} className="roommate-card">
          <h3>{rommmate.name}</h3>
          <p><strong>Interests:</strong> {roommate.interests} </p>
          <p><strong>Location:</strong> {roommate.location} </p>
          <button>View Profile</button>
          <button>Connect</button>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Roommates
