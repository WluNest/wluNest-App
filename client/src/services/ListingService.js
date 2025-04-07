/**
 * ListingService Class
 *
 * This service class handles all operations related to listings in the application. It extends the `BaseService`
 * class and provides methods for interacting with the listings API, including fetching, creating, updating, and deleting
 * listings. It also includes functionality to handle images when creating new listings.
 *
 * Key Features:
 *   - `getListings`: Fetch all listings from the backend, with optional filters.
 *   - `getListingById`: Fetch a single listing by its ID.
 *   - `createListing`: Create a new listing with image files attached using `FormData`.
 *   - `updateListing`: Update an existing listing.
 *   - `deleteListing`: Delete a listing by its ID.
 *
 * Usage:
 *   - Use the methods of this service to perform CRUD operations on listings.
 *   - The `axios` instance from the `BaseService` class is used for making API calls, ensuring that authentication tokens
 *     are automatically added to requests.
 *
 * Example Usage:
 *   const listings = await listingService.getListings({ price: { $gte: 1000 } })
 *   const listing = await listingService.getListingById(1)
 *   const newListing = await listingService.createListing({ title: 'My Listing', price: 2000 }, [imageFile])
 *   const updatedListing = await listingService.updateListing(1, { price: 2500 })
 *   const deletedResponse = await listingService.deleteListing(1)
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
import BaseService from "./BaseService"
import Listing from "../models/Listing"

/**
 * Service for listing operations
 */
class ListingService extends BaseService {
  /**
   * Get all listings with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array<Listing>>} Array of listings
   */
  async getListings(filters = {}) {
    try {
      const response = await this.axios.get("/api/listings", { params: filters })
      return response.data.map((listing) => new Listing(listing))
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get listing by ID
   * @param {number} id - Listing ID
   * @returns {Promise<Listing>} Listing
   */
  async getListingById(id) {
    try {
      const response = await this.axios.get(`/api/listings/${id}`)
      return new Listing(response.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create new listing
   * @param {Object} listingData - Listing data
   * @param {Array} imageFiles - Image files
   * @returns {Promise<Object>} Response data
   */
  async createListing(listingData, imageFiles) {
    try {
      const formData = new FormData()

      // Add listing data
      Object.keys(listingData).forEach((key) => {
        formData.append(key, listingData[key])
      })

      // Add image files
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      const response = await this.axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update listing
   * @param {number} id - Listing ID
   * @param {Object} listingData - Updated listing data
   * @returns {Promise<Object>} Response data
   */
  async updateListing(id, listingData) {
    try {
      const response = await this.axios.put(`/api/listings/${id}`, listingData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete listing
   * @param {number} id - Listing ID
   * @returns {Promise<Object>} Response data
   */
  async deleteListing(id) {
    try {
      const response = await this.axios.delete(`/api/listings/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

// Create singleton instance
const listingService = new ListingService()
export default listingService

