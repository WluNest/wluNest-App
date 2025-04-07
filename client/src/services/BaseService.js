/**
 * BaseService Class
 *
 * This is a base service class that serves as the foundation for all other service classes in the application.
 * It provides essential functionality such as managing API requests, adding authentication headers, and handling errors.
 * All service classes that interact with the backend API should extend this class to utilize its functionality.
 *
 * Key Features:
 *   - `axios`: An instance of the Axios HTTP client, configured with a base URL and interceptors.
 *   - `baseURL`: The base URL for the backend API (set to `http://localhost:5001`).
 *   - `axios.interceptors.request`: Automatically adds an Authorization header with the token (if available) to all outgoing requests.
 *   - `handleError`: A helper function that processes errors returned by the API and formats them in a consistent way.
 *
 * Usage:
 *   - Extend this class in other services to handle API calls in a standardized way.
 *   - Use the `this.axios` instance to make API requests.
 *   - The `handleError` method will return a formatted error object with useful details.
 *
 * Example:
 *   class MyService extends BaseService {
 *     async fetchData() {
 *       try {
 *         const response = await this.axios.get("/api/data")
 *         return response.data
 *       } catch (error) {
 *         const formattedError = this.handleError(error)
 *         console.error(formattedError.message)
 *         throw formattedError
 *       }
 *     }
 *   }
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
import axios from "axios"

/**
 * Base service class that all other services will extend
 */
class BaseService {
  constructor() {
    this.baseURL = "http://localhost:5001"
    this.axios = axios.create({
      baseURL: this.baseURL,
    })

    // Add request interceptor to add auth token
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} Error details
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || error.response.data.error || "Server error",
        status: error.response.status,
        data: error.response.data,
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: "Cannot reach server. Please make sure the backend is running.",
        status: 0,
      }
    } else {
      // Error setting up request
      return {
        message: error.message || "An unexpected error occurred.",
        status: 0,
      }
    }
  }
}

export default BaseService

