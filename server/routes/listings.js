const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const query = `
    SELECT 
      l.listing_id, l.title, l.description, l.price, l.bed, l.bath, l.listing_image,
      p.street_number, p.street_name, p.city, p.province, p.postal_code,
      p.latitude, p.longitude
    FROM listings l
    JOIN property p ON l.listing_id = p.listing_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching listings:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

module.exports = router;
