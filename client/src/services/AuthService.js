/**
 * AuthService Class
 *
 * This service handles user authentication-related operations such as login, signup, and session management.
 * It is built on top of the `BaseService` class and provides methods for logging in users, signing them up,
 * managing the current user, and checking authentication and user roles.
 *
 * Key Features:
 *   - `loadUserFromStorage`: Loads the user from the local storage and initializes the `currentUser`.
 *   - `getCurrentUser`: Returns the current authenticated user.
 *   - `isAuthenticated`: Checks if the user is authenticated by verifying the presence of the user and token.
 *   - `isAdmin`: Checks if the current user is an admin.
 *   - `login`: Handles user login by sending credentials to the backend and storing the response token and user data.
 *   - `signup`: Handles user registration by sending user data to the backend and returning the response data.
 *   - `logout`: Logs the user out by removing the user data and token from local storage.
 *
 * Usage:
 *   - Use this service for all authentication-related tasks such as logging in, signing up, and checking if the
 *     user is authenticated or an admin.
 *   - The current user's data is stored in both memory (in the `currentUser` property) and local storage.
 *   - This service manages the lifecycle of authentication tokens and user data, ensuring a consistent user experience.
 *
 * Example:
 *   const authService = new AuthService();
 *   authService.login("user@example.com", "password123")
 *     .then(user => {
 *       console.log("Logged in as:", user);
 *     })
 *     .catch(error => {
 *       console.error("Login failed:", error);
 *     });
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
import BaseService from "./BaseService"
import User from "../models/User"

/**
 * Service for authentication operations
 */
class AuthService extends BaseService {
  constructor() {
    super()
    this.currentUser = null
    this.loadUserFromStorage()
  }

  /**
   * Load user from local storage
   */
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

      // Store token and user data
      localStorage.setItem("token", userData.token)

      // Create user model
      this.currentUser = new User({
        ...userData.user,
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

