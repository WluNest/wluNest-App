const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { getCoordinates } = require("./coordinateLookup");
const { deleteListing, updateListing } = require("./controllers/listingController");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
const { router: authRoutes, authenticateToken } = require("./routes/auth");
app.use("/api", authRoutes);

// Static file serving
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/images",
  express.static(path.join(__dirname, "images"), (err, req, res, next) => {
    console.error("Static file error:", err);
    next();
  })
);

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg images are allowed!"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload endpoint
// Upload endpoint
app.post("/upload", authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const {
      title, description, price, bed, bath, url,
      has_laundry, has_parking, has_gym, has_hvac,
      has_wifi, has_game_room, is_pet_friendly, is_accessible,
      street_name, street_number, city, province, postal_code
    } = req.body;

    const toBool = (val) => (val === "true" || val === true ? 1 : 0);
    const userId = req.user.id;

    const [result] = await db.promise().query(`
      INSERT INTO listings (
        users_id, title, description, price, listing_image, bed, bath, url,
        has_laundry, has_parking, has_gym, has_hvac, has_wifi,
        has_game_room, is_pet_friendly, is_accessible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, title, description, price, "", bed, bath, url,
      toBool(has_laundry), toBool(has_parking), toBool(has_gym), toBool(has_hvac),
      toBool(has_wifi), toBool(has_game_room), toBool(is_pet_friendly), toBool(is_accessible)
    ]);

    const listingId = result.insertId;
    const listingDir = path.join("images", "listings", listingId.toString());
    if (!fs.existsSync(listingDir)) fs.mkdirSync(listingDir, { recursive: true });

    req.files.forEach((file, index) => {
      const newFileName = `${index + 1}${path.extname(file.originalname)}`;
      const newPath = path.join(listingDir, newFileName);
      if (fs.existsSync(file.path)) fs.renameSync(file.path, newPath);
    });

    const relativeImagePath = `images/listings/${listingId}`;
    await db.promise().query("UPDATE listings SET listing_image = ? WHERE listing_id = ?", [
      relativeImagePath, listingId
    ]);

    const coords = await getCoordinates(postal_code);
    await db.promise().query(`
      INSERT INTO property (
        listing_id, street_name, street_number, city, province, postal_code, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      listingId, street_name, street_number, city, province, postal_code, coords.latitude, coords.longitude
    ]);

    res.json({ message: "Upload successful", listingId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


   


// DELETE and PUT listing routes
app.delete("/api/listings/:id", authenticateToken, deleteListing);
app.put("/api/listings/:id", authenticateToken, updateListing);

// Admin routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Listings routes
const listingsRoute = require("./routes/listings");
app.use("/api/listings", listingsRoute);

// Settings routes
const settingsRoutes = require("./routes/userSettingsRoutes");
app.use("/api/settings", settingsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
