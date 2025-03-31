const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticateToken } = require("./auth");

router.get("/", (req, res) => {
  let query = `SELECT l.*, p.street_number, p.street_name, p.city, p.province, p.postal_code, p.latitude, p.longitude FROM listings l JOIN property p ON l.listing_id = p.listing_id WHERE 1=1`;
  const values = [];

  if (req.query.bed) {
    query += req.query.bed === "3+" ? " AND l.bed >= 3" : " AND l.bed = ?";
    if (req.query.bed !== "3+") values.push(req.query.bed);
  }
  if (req.query.bath) {
    query += req.query.bath === "3+" ? " AND l.bath >= 3" : " AND l.bath = ?";
    if (req.query.bath !== "3+") values.push(req.query.bath);
  }
  if (req.query.max_price) {
    query += " AND l.price <= ?";
    values.push(req.query.max_price);
  }

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    res.json(results);
  });
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const listingId = parseInt(req.params.id);
  const userId = parseInt(req.user.id);
  const isAdmin = req.user.role === "admin";

  try {
    const [rows] = await db.promise().query("SELECT users_id FROM listings WHERE listing_id = ?", [listingId]);
    if (rows.length === 0) return res.status(404).json({ error: "Listing not found" });
    if (!isAdmin && rows[0].users_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    await db.promise().query("DELETE FROM listings WHERE listing_id = ?", [listingId]);
    res.json({ message: "Listing deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const listingId = parseInt(req.params.id);
  const userId = parseInt(req.user.id);
  const isAdmin = req.user.role === "admin";

  const {
    title, description, price, bed, bath, url,
    has_laundry, has_parking, has_gym, has_hvac, has_wifi,
    has_game_room, is_pet_friendly, is_accessible
  } = req.body;

  try {
    const [rows] = await db.promise().query("SELECT users_id FROM listings WHERE listing_id = ?", [listingId]);
    if (rows.length === 0) return res.status(404).json({ error: "Listing not found" });
    if (!isAdmin && rows[0].users_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    await db.promise().query(
      `UPDATE listings SET title = ?, description = ?, price = ?, bed = ?, bath = ?, url = ?, has_laundry = ?, has_parking = ?, has_gym = ?, has_hvac = ?, has_wifi = ?, has_game_room = ?, is_pet_friendly = ?, is_accessible = ? WHERE listing_id = ?`,
      [title, description, price, bed, bath, url, has_laundry ? 1 : 0, has_parking ? 1 : 0, has_gym ? 1 : 0, has_hvac ? 1 : 0, has_wifi ? 1 : 0, has_game_room ? 1 : 0, is_pet_friendly ? 1 : 0, is_accessible ? 1 : 0, listingId]
    );

    res.json({ message: "Listing updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
