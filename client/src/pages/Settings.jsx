import React, { useState, useEffect, useMemo } from "react";
import settingsService from "../services/SettingsService";
import "./Settings.css";

class SettingsFormData {
  constructor() {
    this.religion = "";
    this.gender = "";
    this.university = "";
    this.year = "";
    this.program = "";
    this.about_you = "";
    this.looking_for_roommate = false;
    this.email = "";
    this.emailNotifications = true;
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }

  updateFromUser(user) {
    this.religion = user.religion || "";
    this.gender = user.gender || "";
    this.university = user.university || "";
    this.year = user.year || "";
    this.program = user.program || "";
    this.about_you = user.about_you || "";
    this.looking_for_roommate = user.looking_for_roommate || false;
    this.email = user.email || "";
    this.emailNotifications = user.emailNotifications !== false;
  }

  getPersonalData() {
    return {
      religion: this.religion,
      gender: this.gender,
      university: this.university,
      year: this.year,
      program: this.program,
      about_you: this.about_you,
      looking_for_roommate: this.looking_for_roommate
    };
  }

  getEmailData() {
    return {
      email: this.email,
      currentPassword: this.currentPassword
    };
  }

  getPasswordData() {
    return {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
  }
}

class MessageHandler {
  constructor(setMessage) {
    this.setMessage = setMessage;
  }

  show(text, type) {
    this.setMessage({ text, type });
    setTimeout(() => this.setMessage({ text: "", type: "" }), 5000);
  }

  showError(error) {
    const message = error.message || "Operation failed";
    this.show(message, "error");
  }
}

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState(new SettingsFormData());

  const messageHandler = useMemo(() => new MessageHandler(setMessage), []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const user = await settingsService.getUserSettings();
        
        const newFormData = new SettingsFormData();
        newFormData.updateFromUser(user);
        setFormData(newFormData);
      } catch (error) {
        messageHandler.showError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [messageHandler]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = new SettingsFormData();
      Object.assign(newData, prev);
      newData[name] = type === "checkbox" ? checked : value;
      return newData;
    });
  };

  const handleSubmit = async (type, e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (type === "personal") {
        await settingsService.updateUserSettings(formData.getPersonalData());
        messageHandler.show("Personal info updated successfully", "success");
      }
      else if (type === "email") {
        await settingsService.updateEmail(
          formData.email,
          formData.currentPassword
        );
        messageHandler.show("Email updated successfully. Please log in again.", "success");
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
        await settingsService.updatePassword(
          formData.currentPassword,
          formData.newPassword
        );
        messageHandler.show("Password updated successfully. Please log in again.", "success");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      messageHandler.showError(error);
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
      await settingsService.deleteAccount(formData.currentPassword);
      messageHandler.show("Account deleted successfully", "success");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      messageHandler.showError(error);
      setDeleteConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
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