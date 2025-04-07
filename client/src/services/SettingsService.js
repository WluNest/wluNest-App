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

