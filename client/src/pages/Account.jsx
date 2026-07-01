/**
 * Account Component
 *
 * This component displays the user's account details, including their name and email.
 * It provides two main actions: an "Edit Profile" button and a "Logout" button.
 * The component conditionally renders based on whether the user object is available.
 * 
 * Key Features:
 *   - Displays a welcome message with the user's name.
 *   - Shows the user's email address.
 *   - Provides options to edit the profile or log out (buttons).
 *   - Displays a "Loading..." message while waiting for user data.
 *
 * Props:
 *   - `user` (object): The user object containing user information such as `name` and `email`.
 * 
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
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
