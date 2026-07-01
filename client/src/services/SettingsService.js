/**
 * SettingsService Class
 *
 * This service class provides methods for handling user settings operations. It extends from 
 * the `BaseService` class and includes functionality for getting and updating user settings,
 * updating email and password, as well as deleting the user's account. The class utilizes 
 * the `User` model to represent the user data and handles all interactions with the backend API.
 *
 * Key Features:
 *   - `getUserSettings`: Fetches the current user's settings from the backend.
 *   - `updateUserSettings`: Updates the user's settings with new data.
 *   - `updateEmail`: Allows the user to update their email after verifying with their current password.
 *   - `updatePassword`: Allows the user to update their password after verifying with their current password.
 *   - `deleteAccount`: Deletes the user's account after confirming the current password.
 *
 * Usage:
 *   - This service can be used to interact with the user's settings and personal information stored in the backend.
 *   - It provides methods to fetch, update, and delete user settings, as well as change the user's email and password.
 *   - The `axios` instance from the `BaseService` class is used for making API calls, which automatically handles 
 *     authentication tokens.
 *
 * Example Usage:
 *   const userSettings = await settingsService.getUserSettings()
 *   const updatedSettings = await settingsService.updateUserSettings({ theme: 'dark' })
 *   const updatedEmail = await settingsService.updateEmail('newemail@example.com', 'currentPassword')
 *   const updatedPassword = await settingsService.updatePassword('currentPassword', 'newPassword')
 *   const deletedAccount = await settingsService.deleteAccount('currentPassword')
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
import BaseService from "./BaseService"
import User from "../models/User"

/**
 * Service for user settings operations
 */
class SettingsService extends BaseService {
  /**
   * Get user settings
   * @returns {Promise<User>} User with settings
   */
  async getUserSettings() {
    try {
      const response = await this.axios.get("/api/settings")
      return new User(response.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user settings
   * @param {Object} settings - Updated settings
   * @returns {Promise<Object>} Response data
   */
  async updateUserSettings(settings) {
    try {
      const response = await this.axios.put("/api/settings", settings)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user email
   * @param {string} email - New email
   * @param {string} currentPassword - Current password
   * @returns {Promise<Object>} Response data
   */
  async updateEmail(email, currentPassword) {
    try {
      const response = await this.axios.put("/api/settings/email", {
        email,
        currentPassword,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Response data
   */
  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await this.axios.put("/api/settings/password", {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete user account
   * @param {string} currentPassword - Current password
   * @returns {Promise<Object>} Response data
   */
  async deleteAccount(currentPassword) {
    try {
      const response = await this.axios.delete("/api/settings", {
        data: { currentPassword },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

// Create singleton instance
const settingsService = new SettingsService()
export default settingsService

