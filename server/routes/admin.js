const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticateToken } = require("./auth");

const requireAdmin = (req, res, next) => {
    console.log("🔍 Checking user role:", req.user); // ADD THIS LINE
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  };
  

router.get("/listings", authenticateToken, requireAdmin, async (req, res) => {
    console.log("🔐 AUTH CHECK - user in token:", req.user); // ADD THIS LINE
  
    try {
      const [rows] = await db.promise().query(`
        SELECT l.*, u.username, u.email
        FROM listings l
        JOIN users u ON l.users_id = u.users_id
        ORDER BY l.created_at DESC
      `);
      res.json(rows);
    } catch (err) {
      console.error("Admin fetch error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;
