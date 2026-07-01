import BaseModel from "./BaseModel"

/**
 * Roommate model representing a user looking for roommates
 */
class Roommate extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.users_id = data.users_id || null
    this.first_name = data.first_name || ""
    this.last_name = data.last_name || ""
    this.email = data.email || ""
    this.gender = data.gender || ""
    this.religion = data.religion || ""
    this.university = data.university || ""
    this.year = data.year || ""
    this.program = data.program || ""
    this.about_you = data.about_you || ""
    this.looking_for_roommate = !!data.looking_for_roommate
    this.city = data.city || ""
  }

  /**
   * Get full name of roommate
   * @returns {string} Full name
   */
  get fullName() {
    return `${this.first_name} ${this.last_name}`.trim()
  }

  /**
   * Get details as key-value pairs
   * @returns {Array} Array of detail objects
   */
  getDetails() {
    return [
      { label: "Gender", value: this.gender || "Not specified" },
      { label: "Religion", value: this.religion || "Not specified" },
      { label: "University", value: this.university || "Not specified" },
      { label: "Year", value: this.year || "Not specified" },
      { label: "Program", value: this.program || "Not specified" },
      { label: "Location", value: this.city || "Not specified" },
    ]
  }
}

export default Roommate

