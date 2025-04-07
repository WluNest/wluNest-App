/**
 * BaseModel Class
 *
 * This is a base class that can be used for creating models that represent data objects.
 * It provides common functionality such as initialization, conversion to JSON, and validation, 
 * which can be extended or overridden in child classes.
 *
 * Key Features:
 *   - Constructor: Accepts an optional `data` object and initializes the instance with the provided data.
 *   - initializeData: Uses `Object.assign()` to copy properties from the provided data object to the model instance.
 *   - toJSON: Returns a shallow copy of the model instance as a plain JavaScript object.
 *   - validate: Placeholder method for validation that can be overridden in child classes to implement custom validation logic.
 *
 * Usage:
 *   - Extend this class in child models and override methods like `validate()` to add specific logic for validation or transformation.
 * 
 * Example:
 *   class User extends BaseModel {
 *     validate() {
 *       // Custom validation for User model
 *       return this.name && this.email;
 *     }
 *   }
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
class BaseModel {
    constructor(data = {}) {
        this.initializeData(data);
    }

    initializeData(data) {
        Object.assign(this, data);
    }

    toJSON() {
        return { ...this };
    }

    validate() {
        return true; // Override in child classes
    }
}

module.exports = BaseModel;
