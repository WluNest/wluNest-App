/**
 * RoommateService Class
 *
 * This service class provides methods to manage and interact with roommates in the application. It extends from 
 * the `BaseService` class and includes methods to fetch, update, filter, and retrieve unique options for roommates.
 * The class also leverages the `Roommate` model to handle data related to individual roommates.
 *
 * Key Features:
 *   - `getRoommates`: Fetches all roommates from the backend.
 *   - `updateRoommateStatus`: Updates a roommate's status, specifically whether they are looking for a roommate.
 *   - `filterRoommates`: Filters a list of roommates based on specified criteria.
 *   - `getUniqueOptions`: Retrieves unique options for a specific field (e.g., gender, interests) among roommates.
 *
 * Usage:
 *   - This service can be used to interact with the roommates' data stored in the backend.
 *   - It provides methods to fetch, update, and filter roommates as well as obtain unique options for various fields.
 *   - The `axios` instance from the `BaseService` class is used for making API calls, which automatically handles 
 *     authentication tokens.
 *
 * Example Usage:
 *   const roommates = await roommateService.getRoommates()
 *   const updatedStatus = await roommateService.updateRoommateStatus(1, true)
 *   const filteredRoommates = roommateService.filterRoommates(roommates, { gender: 'Female' })
 *   const uniqueGenders = roommateService.getUniqueOptions(roommates, 'gender')
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
import BaseService from "./BaseService"
import Roommate from "../models/Roommate"

/**
 * Service for roommate operations
 */
class RoommateService extends BaseService {
  /**
   * Get all roommates
   * @returns {Promise<Array<Roommate>>} Array of roommates
   */
  async getRoommates() {
    try {
      const response = await this.axios.get("/api/roommates")
      return response.data.map((roommate) => new Roommate(roommate))
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update roommate status
   * @param {number} userId - User ID
   * @param {boolean} lookingForRoommate - Looking for roommate status
   * @returns {Promise<Object>} Response data
   */
  async updateRoommateStatus(userId, lookingForRoommate) {
    try {
      const response = await this.axios.patch(`/api/roommates/${userId}`, {
        looking_for_roommate: lookingForRoommate,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Filter roommates by criteria
   * @param {Array<Roommate>} roommates - Roommates to filter
   * @param {Object} filters - Filter criteria
   * @returns {Array<Roommate>} Filtered roommates
   */
  filterRoommates(roommates, filters) {
    return roommates.filter((roommate) =>
      Object.entries(filters).every(([key, value]) => {
        if (value === "") return true
        return roommate[key]?.toString().toLowerCase() === value.toLowerCase()
      }),
    )
  }

  /**
   * Get unique options for a specific field
   * @param {Array<Roommate>} roommates - Roommates to extract options from
   * @param {string} field - Field to get options for
   * @returns {Array<string>} Unique options
   */
  getUniqueOptions(roommates, field) {
    const uniqueValues = new Set()
    roommates.forEach((roommate) => {
      if (roommate[field]) {
        uniqueValues.add(roommate[field])
      }
    })
    return Array.from(uniqueValues).sort()
  }
}

// Create singleton instance
const roommateService = new RoommateService()
export default roommateService

