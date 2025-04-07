const express = require("express");
const router = express.Router();
const authService = require("../services/AuthService");

router.post("/signup", async (req, res) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: "Please enter username/email and password." });
        }

        const result = await authService.login(identifier, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = { router, authenticateToken };