/**
 * Listing Class
 *
 * This class represents a listing in the system. It extends the `BaseModel` class, 
 * inheriting common functionality like data initialization, conversion to JSON, and 
 * validation. It provides custom validation logic for the listing data and a static method 
 * to create a `Listing` object from raw database data.
 *
 * Key Features:
 *   - Constructor: Inherits the constructor from `BaseModel` and initializes the instance with the provided data.
 *   - validate: Ensures that required fields (`title`, `description`, and `price`) are present and that `price` is non-negative.
 *   - fromDatabase: A static method that maps raw database data to a `Listing` instance.
 *
 * Usage:
 *   - Use this class to represent a listing in your application. The `validate()` method should be used 
 *     to ensure the listing data is correct before saving it to the database or performing other operations.
 *   - The `fromDatabase()` method is useful for mapping rows from a database query result into `Listing` objects.
 *
 * Example:
 *   const rawData = {
 *     listing_id: 1,
 *     users_id: 123,
 *     title: "Spacious 2-Bedroom Apartment",
 *     description: "Located in downtown, great view!",
 *     price: 1800,
 *     bed: 2,
 *     bath: 1,
 *     listing_image: "image_url",
 *     has_laundry: true,
 *     has_parking: false,
 *     has_gym: true,
 *     has_hvac: true,
 *     has_wifi: true,
 *     created_at: "2023-05-01"
 *   };
 *
 *   const listing = Listing.fromDatabase(rawData);
 *   listing.validate(); // Validates the listing data
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
const BaseModel = require('./BaseModel');


class Listing extends BaseModel {
    constructor(data = {}) {
        super(data);
    }

    validate() {
        if (!this.title || !this.description || !this.price) {
            throw new Error('Missing required fields');
        }
        if (this.price < 0) {
            throw new Error('Price cannot be negative');
        }
        return true;
    }

    static fromDatabase(data) {
        return new Listing({
            listing_id: data.listing_id,
            users_id: data.users_id,
            title: data.title,
            description: data.description,
            price: data.price,
            bed: data.bed,
            bath: data.bath,
            listing_image: data.listing_image,
            has_laundry: data.has_laundry,
            has_parking: data.has_parking,
            has_gym: data.has_gym,
            has_hvac: data.has_hvac,
            has_wifi: data.has_wifi,
            created_at: data.created_at
        });
    }
}

module.exports = Listing;
