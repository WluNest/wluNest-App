const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const { createDirectoryFromListingID } = require("./imagehandler.js");

const app = express();
const port = 5001;

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "omar",
  database: "wlunest",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Log to see if the files are reaching this step
      console.log("File destination:", file.originalname);
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      // Ensure unique filenames by using the original file's timestamp or generating a random number
      const timestamp = Date.now();
      const uniqueName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
      console.log("Generated filename:", uniqueName);
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Temporarily remove file filter to see if files are being received
      if (file.mimetype === "image/jpeg") {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg images are allowed!"), false);
      }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  });
  
  app.post("/upload", upload.array("images", 10), (req, res) => {
    // Check if files are being received
    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded");
      return res.status(400).json({ error: "No files uploaded" });
    }
  
    // Log the files received
    console.log("Files received:", req.files);
  
    const {
      title,
      description,
      price,
      bed,
      bath,
      street_name,
      street_number,
      city,
      province,
      postal_code,
    } = req.body;
  
    const sql = `INSERT INTO listings (users_id, title, description, price, listing_image, bed, bath) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(sql, [1, title, description, price, "", bed, bath], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database insertion failed" });
      }
  
      const listingId = result.insertId;
      const listingDir = `images/listings/${listingId}`;
  
      // Ensure the listing directory exists
      if (!fs.existsSync(listingDir)) {
        fs.mkdirSync(listingDir, { recursive: true });
      }
  
      // Move images to the listing folder with new unique filenames
      req.files.forEach((file, index) => {
        const newFileName = `${index + 1}${path.extname(file.originalname)}`; // Ensure filename is a number starting from 1
        const newPath = path.join(listingDir, newFileName); // Construct the new file path
  
        console.log(`Renaming file: ${file.path} -> ${newPath}`); // Log the renaming action
  
        // Ensure the file exists before renaming
        if (fs.existsSync(file.path)) {
          fs.renameSync(file.path, newPath); // Rename and move the file
        } else {
          console.error(`File not found: ${file.path}`);
        }
      });
  
      // Update listing_image column with directory path
      const updateSql = "UPDATE listings SET listing_image = ? WHERE listing_id = ?";
      db.query(updateSql, [listingDir, listingId], (updateErr) => {
        if (updateErr) {
          console.error("Failed to update listing image path:", updateErr);
          return res.status(500).json({ error: "Failed to update image path" });
        }
        res.json({ message: "Upload successful", listingId});
  
      });
    });
  });
  
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});