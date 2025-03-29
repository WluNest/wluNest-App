import React, { useState } from "react";
import "./Settings.css";

function Settings() {
  const user = localStorage.getItem("user");
  const [activeTab, setActiveTab] = useState("personal");

  // Sample data for demonstration
  const [religion, setReligion] = useState("");
  const [gender, setGender] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [program, setProgram] = useState("");
  const [lookingForRoommate, setLookingForRoommate] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeactivate = () => {
    alert("Account deactivated!");
  };

  const handleDelete = () => {
    alert("Account deleted!");
  };

  const handlePasswordChange = () => {
    alert("Password Changed");
  }

  const handleEmailChange = () => {
    alert("Email Changed");
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Left Panel: Tabs */}
        <div className="settings-tabs">
          <div
            className={`tab-item ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => handleTabChange("personal")}
          >
            Personal Information
          </div>
          <div
            className={`tab-item ${activeTab === "account" ? "active" : ""}`}
            onClick={() => handleTabChange("account")}
          >
            Account Details
          </div>
        </div>

        {/* Right Panel: Tab Content */}
        <div className="settings-content">
          {activeTab === "personal" && (
            <div className="personal-info">
              <h2>Personal Information</h2>
              <div className="form-row">
                <label>Religion:</label>
                <select value={religion} onChange={(e) => setReligion(e.target.value)}>
                  <option value="" disabled hidden>Select Religion</option>
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Atheist">Atheist</option>
                  <option value="Jewish">Jewish</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
              </div>

              <div className="form-row">
                <label> Gender:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="other">Other</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-row">
                <label>University:</label>
                <select value={university} onChange={(e) => setUniversity(e.target.value)}>
                  <option value="" disabled hidden>Select University</option>
                  <option value="University of Waterloo">University of Waterloo</option>
                  <option value="Wilfrid Laurier University">Wilfrid Laurier University</option>
                </select>
              </div>

              <div className="form-row">
                <label>Year:</label>
                <input
                type="number"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Program:</label>
                <select value={program} onChange={(e) => setProgram(e.target.value)}>
                  <option value="" disabled hidden>Select Program</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Business Administration">Business Administration</option>      
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="form-row">
                <label>About you:</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-row checkbox-row">
              <label htmlFor="notifications">Are you looking for a roommate?</label>
                <input
                  type="checkbox"
                  id="notifications"
                  checked={lookingForRoommate}
                  onChange={() => setLookingForRoommate(!lookingForRoommate)}
                />
                
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="account-details">
              <h2>Account Details</h2>
              <div className="form-row">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  placeholder=""
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="deactivate-btn" onClick={handleEmailChange}>
                  Change Email
                </button>
              </div>

              <div className="form-row">
                <label>Change Password:</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="deactivate-btn" onClick={handlePasswordChange}>
                  Change Password
                </button>
              </div>

              <div className="form-row checkbox-row">
                <label htmlFor="notifications">Email Notifications</label>
                <input
                  type="checkbox"
                  id="notifications"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                
              </div>

              <div className="danger-zone">
                <button className="deactivate-btn" onClick={handleDeactivate}>
                  Deactivate My Account
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
