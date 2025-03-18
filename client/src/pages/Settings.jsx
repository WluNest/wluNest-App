import React, { useState } from "react";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");

  // Sample data for demonstration
  const [religion, setReligion] = useState("Christian");
  const [gender, setGender] = useState("Male");
  const [university, setUniversity] = useState("Wilfrid Laurier University");
  const [year, setYear] = useState("3");
  const [program, setProgram] = useState("Computer Science");
  const [contact, setContact] = useState("Instagram");
  const [handle, setHandle] = useState("@johnappleseed");
  const [description, setDescription] = useState(
    "Computer Science student looking for a roommate..."
  );

  const [email, setEmail] = useState("JohnAppleseed@gmail.com");
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
                <input
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Gender:</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>University:</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Year:</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Program:</label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Contact:</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Handle:</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Description:</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Change Password:</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-row checkbox-row">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <label htmlFor="notifications">Email Notifications</label>
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
