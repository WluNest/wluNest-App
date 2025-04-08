// Settings Component


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    religion: "",
    gender: "",
    university: "",
    year: "",
    program: "",
    about_you: "",
    looking_for_roommate: false,
    email: "",
    emailNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  //Fetch user data on mount
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
          about_you: data.about_you || "",
          looking_for_roommate: data.looking_for_roommate || false,
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
      const baseUrl = "http://localhost:5001/api/settings";
      
      if (type === "personal") {
        await axios.put(baseUrl, {
          religion: formData.religion,
          gender: formData.gender,
          university: formData.university,
          year: formData.year,
          program: formData.program,
          about_you: formData.about_you,
          looking_for_roommate: formData.looking_for_roommate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage("Personal info updated successfully", "success");
      }
      else if (type === "email") {
        await axios.put(`${baseUrl}/email`, { 
          email: formData.email,
          currentPassword: formData.currentPassword 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage("Email updated successfully. Please log in again.", "success");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }, 2000);
      }
      else if (type === "password") {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await axios.put(`${baseUrl}/password`, {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage("Password updated successfully. Please log in again.", "success");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      showMessage(err.response?.data?.error || err.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5001/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
        data: { currentPassword: formData.currentPassword }
      });
      showMessage("Account deleted successfully", "success");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      showMessage(err.response?.data?.error || "Failed to delete account", "error");
      setDeleteConfirmation(false);
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
                  name="about_you"
                  value={formData.about_you} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-row checkbox-row">
                <label htmlFor="roommate">Would you like your profile to be visible on the roommates tab?</label>
                <input
                  type="checkbox"
                  id="roommate"
                  name="looking_for_roommate"
                  checked={formData.looking_for_roommate}
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
                    required
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

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                {deleteConfirmation ? (
                  <div className="delete-confirmation">
                    <p>Are you sure you want to delete your account? This cannot be undone.</p>
                    <div className="confirmation-buttons">
                      <button 
                        className="confirm-delete-btn" 
                        onClick={handleDeleteAccount}
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Yes, Delete My Account"}
                      </button>
                      <button 
                        className="cancel-delete-btn" 
                        onClick={() => setDeleteConfirmation(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="delete-btn" 
                    onClick={() => setDeleteConfirmation(true)}
                    disabled={loading}
                  >
                    Delete My Account
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;