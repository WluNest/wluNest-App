/**
 * ListingController
 *
 * This controller manages operations related to rental or roommate listings.
 * It provides methods to:
 *   - Delete a listing (with authorization check)
 *   - Update a listing (with user ownership or admin override)
 *
 * Features:
 *   - Ensures only the listing owner or an admin can modify or delete a listing
 *   - Converts boolean feature flags to integers (0 or 1) for database storage
 *   - Handles invalid or unauthorized access with appropriate HTTP status codes
 *
 * Assumptions:
 *   - `req.user.id` and `req.user.role` are populated by authentication middleware
 *   - Listing existence is verified before performing updates/deletion
 *   - Listing fields (title, price, etc.) are provided via `req.body` and assumed validated beforehand
 *
 * Dependencies:
 *   - MySQL database connection (`db`) using promise-based query interface
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
const db = require("../db");

class ListingController {
  async deleteListing(req, res) {
    const listingId = req.params.id;
    const userId = req.user.id;

    try {
      const [rows] = await db.promise().query(
        "SELECT users_id FROM listings WHERE listing_id = ?",
        [listingId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Listing not found" });
      }

      if (rows[0].users_id !== userId) {
        return res.status(403).json({ error: "You are not authorized to delete this listing." });
      }

      await db.promise().query("DELETE FROM listings WHERE listing_id = ?", [listingId]);
      res.json({ message: "Listing deleted successfully." });
    } catch (error) {
      console.error("Delete listing error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateListing(req, res) {
    const listingId = parseInt(req.params.id);
    const userId = parseInt(req.user.id);
    const isAdmin = req.user.role === "admin";

    const {
      title, description, price, bed, bath, url,
      has_laundry, has_parking, has_gym, has_hvac,
      has_wifi, has_game_room, is_pet_friendly, is_accessible
    } = req.body;

    try {
      const [rows] = await db.promise().query(
        "SELECT users_id FROM listings WHERE listing_id = ?",
        [listingId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Listing not found" });
      }

      if (!isAdmin && rows[0].users_id !== userId) {
        return res.status(403).json({ error: "You are not authorized to update this listing." });
      }

      await db.promise().query(
        `UPDATE listings SET 
          title = ?, description = ?, price = ?, bed = ?, bath = ?, url = ?,
          has_laundry = ?, has_parking = ?, has_gym = ?, has_hvac = ?, has_wifi = ?,
          has_game_room = ?, is_pet_friendly = ?, is_accessible = ?
        WHERE listing_id = ?`,
        [
          title, description, price, bed, bath, url,
          has_laundry ? 1 : 0,
          has_parking ? 1 : 0,
          has_gym ? 1 : 0,
          has_hvac ? 1 : 0,
          has_wifi ? 1 : 0,
          has_game_room ? 1 : 0,
          is_pet_friendly ? 1 : 0,
          is_accessible ? 1 : 0,
          listingId
        ]
      );

      res.json({ message: "Listing updated successfully." });
    } catch (error) {
      console.error("Update listing error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new ListingController();
