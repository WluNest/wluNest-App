const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { getCoordinates } = require("./coordinateLookup");


const app = express();
app.use(cors());
app.use(express.json());

const { router: authRoutes, authenticateToken } = require("./routes/auth");
app.use("/api", authRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images'), (err, req, res, next) => {
    console.error('Static file error:', err);
    next();
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true 
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

app.post("/upload", authenticateToken, upload.array("images", 10), async (req, res) => {


    try {
        if (!req.files || req.files.length === 0) {
            console.log("No files uploaded");
        }

        console.log("Files received:", req.files);

        const {
            title,
            description,
            price,
            bed,
            bath,
            url,
            has_laundry,
            has_parking,
            has_gym,
            has_hvac,
            has_wifi,
            has_game_room,
            is_pet_friendly,
            is_accessible,
            street_name,
            street_number,
            city,
            province,
            postal_code,
        } = req.body;
        const toBool = (val) => val === 'true' || val === true ? 1 : 0;
        const sql_insert_to_listing = `INSERT INTO listings (users_id, title, description, price, listing_image, bed, bath, url, has_laundry, has_parking, has_gym, has_hvac, has_wifi, has_game_room, is_pet_friendly, is_accessible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const userId = req.user.id; 
        const [result] = await db.promise().query(sql_insert_to_listing, [
            userId,
            title,
            description,
            price,
            "", // placeholder for image path, updated later
            bed,
            bath,
            url,
            toBool(has_laundry),
            toBool(has_parking),
            toBool(has_gym),
            toBool(has_hvac),
            toBool(has_wifi),
            toBool(has_game_room),
            toBool(is_pet_friendly),
            toBool(is_accessible),
          ]);        const listingId = result.insertId;
        const listingDir = path.join('images', 'listings', listingId.toString());

        if (!fs.existsSync(listingDir)) {
        fs.mkdirSync(listingDir, { recursive: true });
        }

        // Update the database with the correct relative path
        const relativeImagePath = `images/listings/${listingId}`;
        await db.promise().query("UPDATE listings SET listing_image = ? WHERE listing_id = ?", 
        [relativeImagePath, listingId]);
        if (!fs.existsSync(listingDir)) {
            fs.mkdirSync(listingDir, { recursive: true });
        }

        req.files.forEach((file, index) => {
            const newFileName = `${index + 1}${path.extname(file.originalname)}`;
            const newPath = path.join(listingDir, newFileName);

            console.log(`Renaming file: ${file.path} -> ${newPath}`);

            if (fs.existsSync(file.path)) {
                fs.renameSync(file.path, newPath);
            } else {
                console.error(`File not found: ${file.path}`);
            }
        });

        await db.promise().query("UPDATE listings SET listing_image = ? WHERE listing_id = ?", [listingDir, listingId]);

        // **Get coordinates**
        const coords = await getCoordinates(postal_code);  // Awaiting the Promise

        const sql_insert_to_property = `INSERT INTO property (listing_id, street_name, street_number, city, province, postal_code, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.promise().query(sql_insert_to_property, [listingId, street_name, street_number, city, province, postal_code, coords.latitude, coords.longitude]);

        res.json({ message: "Upload successful", listingId });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
  

app.get("/", (req, res) => {
    res.send("API is running...");
});
const listingsRoute = require("./routes/listings");
app.use("/api/listings", listingsRoute);

const settingsRoutes = require("./routes/userSettingsRoutes");
app.use("/api/settings", settingsRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


