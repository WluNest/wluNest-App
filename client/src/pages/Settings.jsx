import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Combined form state
  const [formData, setFormData] = useState({
    religion: "",
    gender: "",
    university: "",
    year: "",
    program: "",
    description: "",
    lookingForRoommate: false,
    email: "",
    emailNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });



  // Fetch user data on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5001/api/settings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setFormData(prev => ({
          ...prev,
          religion: data.religion || "",
          gender: data.gender || "",
          university: data.university || "",
          year: data.year || "",
          program: data.program || "",
          description: data.description || "",
          lookingForRoommate: data.lookingForRoommate || false,
          email: data.email || "",
          emailNotifications: data.emailNotifications || true
        }));
      } catch (err) {
        setMessage({
          text: err.response?.data?.error || "Failed to load settings",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (type, e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (type === "personal") {
        await axios.put("/api/settings", {
          religion: formData.religion,
          gender: formData.gender,
          university: formData.university,
          year: formData.year,
          program: formData.program,
          description: formData.description,
          lookingForRoommate: formData.lookingForRoommate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage("Personal info updated successfully", "success");
      }
      else if (type === "email") {
        await axios.put("/api/settings", { 
          email: formData.email 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage("Email updated successfully", "success");
      }
      else if (type === "password") {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await axios.put("/api/settings/password", {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage("Password updated successfully", "success");
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }
    } catch (err) {
      showMessage(err.response?.data?.error || err.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Left Panel: Tabs */}
        <div className="settings-tabs">
          <div
            className={`tab-item ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </div>
          <div
            className={`tab-item ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account Details
          </div>
        </div>

        {/* Right Panel: Tab Content */}
        <div className="settings-content">
          {message.text && (
            <div className={`alert ${message.type}`}>{message.text}</div>
          )}

          {activeTab === "personal" && (
            <form className="personal-info" onSubmit={(e) => handleSubmit("personal", e)}>
              <h2>Personal Information</h2>
              <div className="form-row">
                <label>Religion:</label>
                <select 
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                >
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
                <label>Gender:</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="other">Other</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-row">
                <label>University:</label>
                <select 
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                >
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
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Program:</label>
                <select 
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                >
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
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row checkbox-row">
                <label htmlFor="roommate">Are you looking for a roommate?</label>
                <input
                  type="checkbox"
                  id="roommate"
                  name="lookingForRoommate"
                  checked={formData.lookingForRoommate}
                  onChange={handleChange}
                />
              </div>

              <button 
                className="save-btn" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {activeTab === "account" && (
            <div className="account-details">
              <h2>Account Details</h2>
              <form onSubmit={(e) => handleSubmit("email", e)}>
                <div className="form-row">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <button 
                    className="update-btn" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Email"}
                  </button>
                </div>
              </form>

              <form onSubmit={(e) => handleSubmit("password", e)}>
                <div className="form-row">
                  <label>Current Password:</label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label>New Password:</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  className="update-btn" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>

              <div className="form-row checkbox-row">
                <label htmlFor="notifications">Email Notifications</label>
                <input
                  type="checkbox"
                  id="notifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                />
              </div>

              <div className="danger-zone">
                <button 
                  className="deactivate-btn" 
                  onClick={() => alert("Account deactivated!")}
                  disabled={loading}
                >
                  Deactivate My Account
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => alert("Account deleted!")}
                  disabled={loading}
                >
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