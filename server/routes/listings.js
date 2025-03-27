const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  let query = `
    SELECT 
      l.listing_id, l.title, l.description, l.price, l.bed, l.bath, l.listing_image,
      p.street_number, p.street_name, p.city, p.province, p.postal_code,
      p.latitude, p.longitude
    FROM listings l
    JOIN property p ON l.listing_id = p.listing_id
    WHERE 1=1
  `;
  const values = [];
  if (req.query.bed) {
    if (req.query.bed === "3+") {
      query += " AND l.bed >= 3";
    } else {
      query += " AND l.bed = ?";
      values.push(req.query.bed);
    }
  }
  if (req.query.bath) {
    if (req.query.bath === "3+") {
      query += " AND l.bath >= 3";
    } else {
      query += " AND l.bath = ?";
      values.push(req.query.bath);
    }
  }

  if (req.query.max_price) {
    query += " AND l.price <= ?";
    values.push(req.query.max_price);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

module.exports = router;
