const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true 
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

app.get("/", (req, res) => {
    res.send("API is running...");
});
const listingsRoute = require("./routes/listings");
app.use("/api/listings", listingsRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


