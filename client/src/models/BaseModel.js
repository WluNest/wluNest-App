/**
 * Base model class that all other models will extend
 */
class BaseModel {
  constructor(data = {}) {
    this.initFromData(data)
  }

  /**
   * Initialize model properties from data object
   * @param {Object} data - Data to initialize from
   */
  initFromData(data) {
    Object.assign(this, data)
  }

  /**
   * Convert model to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return { ...this }
  }
}

export default BaseModel

