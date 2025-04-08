const BaseService = require("./BaseService.js")
const Listing = require("../models/Listing.js")

class ListingService extends BaseService {
  async getListings(filters = {}) {
    try {
      let query = "SELECT l.*, p.* FROM listings l LEFT JOIN property p ON l.listing_id = p.listing_id WHERE 1=1"
      const params = []

      if (filters.minPrice) {
        query += " AND price >= ?"
        params.push(filters.minPrice)
      }
      if (filters.maxPrice) {
        query += " AND price <= ?"
        params.push(filters.maxPrice)
      }
      if (filters.beds) {
        query += " AND bed >= ?"
        params.push(filters.beds)
      }
      if (filters.baths) {
        query += " AND bath >= ?"
        params.push(filters.baths)
      }

      console.log("Executing query:", query, "with params:", params)
      const results = await this.query(query, params)
      console.log("Sample listing data:", results.length > 0 ? results[0] : "No results")
      return results.map((result) => Listing.fromDatabase(result))
    } catch (error) {
      this.handleError(error)
    }
  }

  async getListingById(id) {
    try {
      const query =
        "SELECT l.*, p.* FROM listings l LEFT JOIN property p ON l.listing_id = p.listing_id WHERE l.listing_id = ?"
      const results = await this.query(query, [id])
      console.log("Listing by ID data:", results.length > 0 ? results[0] : "Not found")
      return results.length ? Listing.fromDatabase(results[0]) : null
    } catch (error) {
      this.handleError(error)
    }
  }

  async createListing(listingData) {
    try {
      const listing = new Listing(listingData)
      listing.validate()

      const query = "INSERT INTO listings SET ?"
      const result = await this.query(query, [listing])
      return this.getListingById(result.insertId)
    } catch (error) {
      this.handleError(error)
    }
  }

  async updateListing(id, data) {
    try {
      // Update the listing
      const listingQuery = `UPDATE listings SET 
                title = ?, description = ?, price = ?, bed = ?, bath = ?, url = ?,
                has_laundry = ?, has_parking = ?, has_gym = ?, has_hvac = ?, has_wifi = ?,
                has_game_room = ?, is_pet_friendly = ?, is_accessible = ?
                WHERE listing_id = ?`

      const listingParams = [
        data.title,
        data.description,
        data.price,
        data.bed,
        data.bath,
        data.url,
        data.has_laundry ? 1 : 0,
        data.has_parking ? 1 : 0,
        data.has_gym ? 1 : 0,
        data.has_hvac ? 1 : 0,
        data.has_wifi ? 1 : 0,
        data.has_game_room ? 1 : 0,
        data.is_pet_friendly ? 1 : 0,
        data.is_accessible ? 1 : 0,
        id,
      ]

      await this.query(listingQuery, listingParams)

      // Update the property
      if (data.property) {
        const propertyQuery = `UPDATE property SET 
                    street_name = ?, street_number = ?, city = ?, province = ?, postal_code = ?
                    WHERE listing_id = ?`

        const propertyParams = [
          data.property.street_name,
          data.property.street_number,
          data.property.city,
          data.property.province,
          data.property.postal_code,
          id,
        ]

        await this.query(propertyQuery, propertyParams)
      }

      return this.getListingById(id)
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteListing(id) {
    try {
      const query = "DELETE FROM listings WHERE listing_id = ?"
      await this.query(query, [id])
      return true
    } catch (error) {
      this.handleError(error)
    }
  }
}

module.exports = ListingService
