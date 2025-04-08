const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { getCoordinates } = require("./coordinateLookup");
const db = require('./db');
const { deleteListing, updateListing } = require("./controllers/listingController");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Auth routes
const { router: authRoutes, authenticateToken } = require("./routes/auth");
app.use("/api", authRoutes);

//Static file serving
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/images",
  express.static(path.join(__dirname, "images"), (err, req, res, next) => {
    console.error("Static file error:", err);
    next();
  })
);

//Settings routes
const userSettingsRoutes = require('./routes/userSettingsRoutes');
app.use('/api/settings', userSettingsRoutes);

//Multer config for file uploads
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
  limits: { fileSize: 10 * 1024 * 1024 },
});

//Upload endpoint
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

    const listingUploadService = new ListingUploadService();
    const result = await listingUploadService.createListingWithImages(
      req.user.id,
      {
        title, description, price, bed, bath, url,
        has_laundry, has_parking, has_gym, has_hvac, has_wifi,
        has_game_room, is_pet_friendly, is_accessible,
        street_name, street_number, city, province, postal_code
      },
      req.files
    );

    res.json({ message: "Upload successful", listingId: result.listingId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Roommate PATCH and GET endpoints
app.patch("/api/roommates/:userId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized: Admin access required" 
      });
    }

    const userId = parseInt(req.params.userId);
    const { looking_for_roommate } = req.body;

    await roommateService.updateRoommateStatus(userId, looking_for_roommate);

    res.json({
      success: true,
      message: "User roommate status updated successfully"
    });
  } catch (error) {
    console.error("Error updating roommate status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
});

const roommateService = require('./services/RoommateService');

app.get("/api/roommates", authenticateToken, async (req, res) => {
  try {
    const roommates = await roommateService.getRoommates();
    res.json(roommates);
  } catch (err) {
    console.error("Error fetching roommates:", err);
    res.status(500).json({ error: "Failed to fetch roommates" });
  }
});

//DELETE and PUT listing routes
app.delete("/api/listings/:id", authenticateToken, deleteListing);
app.put("/api/listings/:id", authenticateToken, updateListing);

//Admin routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

//Listings routes
const listingsRoute = require("./routes/listings");
app.use("/api/listings", listingsRoute);

//ettings routes
const settingsRoutes = require("./routes/userSettingsRoutes");
app.use("/api/settings", settingsRoutes);

//Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

//Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));