const fs = require('fs');
const path = require('path');
const BaseService = require('./BaseService');
const { getCoordinates } = require('../coordinateLookup');

class ListingUploadService extends BaseService {
    async createListingWithImages(userId, listingData, files) {
        try {
            const toBool = (val) => (val === "true" || val === true ? 1 : 0);
            
            // Insert the listing
            const listingResult = await this.query(
                `INSERT INTO listings (
                    users_id, title, description, price, listing_image, bed, bath, url,
                    has_laundry, has_parking, has_gym, has_hvac, has_wifi,
                    has_game_room, is_pet_friendly, is_accessible
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    listingData.title,
                    listingData.description,
                    listingData.price,
                    "",
                    listingData.bed,
                    listingData.bath,
                    listingData.url,
                    toBool(listingData.has_laundry),
                    toBool(listingData.has_parking),
                    toBool(listingData.has_gym),
                    toBool(listingData.has_hvac),
                    toBool(listingData.has_wifi),
                    toBool(listingData.has_game_room),
                    toBool(listingData.is_pet_friendly),
                    toBool(listingData.is_accessible)
                ]
            );

            const listingId = listingResult.insertId;

            // Handle image uploads
            const listingDir = path.join("images", "listings", listingId.toString());
            if (!fs.existsSync(listingDir)) {
                fs.mkdirSync(listingDir, { recursive: true });
            }

            files.forEach((file, index) => {
                const newFileName = `${index + 1}${path.extname(file.originalname)}`;
                const newPath = path.join(listingDir, newFileName);
                if (fs.existsSync(file.path)) {
                    fs.renameSync(file.path, newPath);
                }
            });

            // Update listing with image path
            const relativeImagePath = `images/listings/${listingId}`;
            await this.query(
                "UPDATE listings SET listing_image = ? WHERE listing_id = ?",
                [relativeImagePath, listingId]
            );

            // Get coordinates and create property entry
            const coords = await getCoordinates(listingData.postal_code);
            await this.query(
                `INSERT INTO property (
                    listing_id, street_name, street_number, city, province, postal_code, latitude, longitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    listingId,
                    listingData.street_name,
                    listingData.street_number,
                    listingData.city,
                    listingData.province,
                    listingData.postal_code,
                    coords.latitude,
                    coords.longitude
                ]
            );

            return { listingId };
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = ListingUploadService;
