//BaseService Class
import axios from "axios"

class BaseService {
  constructor() {
    this.baseURL = "http://localhost:5001"
    this.axios = axios.create({
      baseURL: this.baseURL,
    })

    //aAdd request interceptor to add auth token
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

