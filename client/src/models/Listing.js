import BaseModel from "./BaseModel"

/**
 * Listing model representing a property listing
 */
class Listing extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.listing_id = data.listing_id || null
    this.users_id = data.users_id || null
    this.title = data.title || ""
    this.description = data.description || ""
    this.price = data.price || 0
    this.listing_image = data.listing_image || ""
    this.bed = data.bed || 0
    this.bath = data.bath || 0
    this.url = data.url || ""
    this.has_laundry = !!data.has_laundry
    this.has_parking = !!data.has_parking
    this.has_gym = !!data.has_gym
    this.has_hvac = !!data.has_hvac
    this.has_wifi = !!data.has_wifi
    this.has_game_room = !!data.has_game_room
    this.is_pet_friendly = !!data.is_pet_friendly
    this.is_accessible = !!data.is_accessible
    this.street_number = data.street_number || ""
    this.street_name = data.street_name || ""
    this.city = data.city || ""
    this.province = data.province || ""
    this.postal_code = data.postal_code || ""
    this.latitude = data.latitude || null
    this.longitude = data.longitude || null
    this.created_at = data.created_at ? new Date(data.created_at) : new Date()
  }

  /**
   * Get full address
   * @returns {string} Full address
   */
  get fullAddress() {
    return `${this.street_number} ${this.street_name}, ${this.city}, ${this.province} ${this.postal_code}`.trim()
  }

  /**
   * Get formatted price
   * @returns {string} Formatted price
   */
  get formattedPrice() {
    return `$${Number.parseFloat(this.price).toFixed(2)}`
  }

  /**
   * Get image paths for the listing
   * @param {number} count - Number of images to generate paths for
   * @returns {Array} Array of image paths
   */
  getImagePaths(count = 10) {
    return Array.from(
      { length: count },
      (_, i) => `http://localhost:5001/images/listings/${this.listing_id}/${i + 1}.jpg`,
    )
  }

  /**
   * Get amenities as an array of objects
   * @returns {Array} Array of amenity objects
   */
  getAmenities() {
    return [
      { label: "Laundry", value: this.has_laundry, key: "has_laundry" },
      { label: "Parking", value: this.has_parking, key: "has_parking" },
      { label: "Gym", value: this.has_gym, key: "has_gym" },
      { label: "HVAC", value: this.has_hvac, key: "has_hvac" },
      { label: "Wi-Fi", value: this.has_wifi, key: "has_wifi" },
      { label: "Game Room", value: this.has_game_room, key: "has_game_room" },
      { label: "Pet Friendly", value: this.is_pet_friendly, key: "is_pet_friendly" },
      { label: "Accessible", value: this.is_accessible, key: "is_accessible" },
    ]
  }
}

export default Listing

