const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const AdminService = require('../services/AdminService');
const adminService = new AdminService();

const requireAdmin = (req, res, next) => {
    console.log("🔍 Checking user role:", req.user);
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

router.get("/listings", authenticateToken, requireAdmin, async (req, res) => {
    console.log("🔐 AUTH CHECK - user in token:", req.user);
  
    try {
        const listings = await adminService.getAllListings();
        res.json(listings);
    } catch (error) {
        console.error("Admin fetch error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
