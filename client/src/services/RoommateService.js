//RoommateService Class

import BaseService from "./BaseService"
import Roommate from "../models/Roommate"

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

//create singleton instance
const roommateService = new RoommateService()
export default roommateService

