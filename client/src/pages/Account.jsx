//account component
 
import React from 'react';

const Account = ({ user }) => {
  return (
    <div className="account-container">
      {user ? (
        <div className="account-details">
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <div className="account-actions">
            <button className="edit-btn">Edit Profile</button>
            <button className="logout-btn">Logout</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Account;
