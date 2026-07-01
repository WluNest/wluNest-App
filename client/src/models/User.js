import BaseModel from "./BaseModel"

/**
 * User model representing a user in the system
 */
class User extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.id = data.id || data.users_id || null
    this.username = data.username || ""
    this.first_name = data.first_name || ""
    this.last_name = data.last_name || ""
    this.email = data.email || ""
    this.role = data.role || "user"
    this.token = data.token || ""
    this.religion = data.religion || ""
    this.gender = data.gender || ""
    this.university = data.university || ""
    this.year = data.year || ""
    this.program = data.program || ""
    this.about_you = data.about_you || ""
    this.looking_for_roommate = data.looking_for_roommate || false
  }

  /**
   * Get full name of user
   * @returns {string} Full name
   */
  get fullName() {
    return `${this.first_name} ${this.last_name}`.trim()
  }

  /**
   * Check if user is admin
   * @returns {boolean} True if admin
   */
  isAdmin() {
    return this.role === "admin"
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.token
  }
}

export default User

