//authservice class

import BaseService from "./BaseService"
import User from "../models/User"

class AuthService extends BaseService {
  constructor() {
    super()
    this.currentUser = null
    this.loadUserFromStorage()
  }

  loadUserFromStorage() {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        this.currentUser = new User(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        this.currentUser = null
      }
    }
  }

  /**
   * Get current user
   * @returns {User|null} Current user or null
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.currentUser && !!localStorage.getItem("token")
  }

  /**
   * Check if user is admin
   * @returns {boolean} True if admin
   */
  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin()
  }

  /**
   * Login user
   * @param {string} identifier - Username or email
   * @param {string} password - Password
   * @returns {Promise<User>} Logged in user
   */
  async login(identifier, password) {
    try {
      const response = await this.axios.post("/api/login", { identifier, password })
      const userData = response.data

      localStorage.setItem("token", userData.token)

      this.currentUser = new User({
        ...userData.user,
        id: userData.user.users_id,
        token: userData.token,
      })

      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(this.currentUser))

      return this.currentUser
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Sign up user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Response data
   */
  async signup(userData) {
    try {
      const response = await this.axios.post("/api/signup", userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUser = null
  }
}

// Create singleton instance
const authService = new AuthService()
export default authService
