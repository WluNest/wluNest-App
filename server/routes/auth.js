const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../db");


// signup 
router.post("/signup", (req, res) => {
    const { username, first_name, last_name, email, password } = req.body;

    if (!username || !first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
  
    try {
        const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
        db.query(
            checkQuery,
            [username, email], async (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });
            
            if (results.length > 0) {
                return res.status(409).json({ message: "Username or email already registered" });
          }
        // thissi so the password is hashed before it is stored in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = `
        INSERT INTO users (username, first_name, last_name, email, password)
        VALUES (?, ?, ?, ?, ?)
      `;


        db.query(
            insertUser,
            [username, first_name, last_name, email, hashedPassword],
            (err) => {
              if (err) return res.status(500).json({ message: "Failed to register user" });
    
              return res.status(201).json({ message: "Signup successful" });
            });
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
// login part
router.post("/login", (req, res) => {
    const { identifier, password } = req.body; // identifier = username or email
  
    if (!identifier || !password) {
      return res.status(400).json({ message: "Please enter username/email and password." });
    }
  
    const query = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(query, [identifier, identifier], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
  
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid username/email or password" });
      }
  
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid username/email or password" });
      }  
  
      const token = jwt.sign(
        {
          id: user.users_id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.users_id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      });
    });
  });

  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user; 
      next();
    });
  };
  
  
  module.exports = {
    router,
    authenticateToken,
  };