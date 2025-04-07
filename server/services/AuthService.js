const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BaseService = require("./BaseService");

class AuthService extends BaseService {
    async signup(userData) {
        const { username, first_name, last_name, email, password } = userData;

        // Check if user exists
        const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
        const existingUsers = await this.query(checkQuery, [username, email]);
        
        if (existingUsers.length > 0) {
            throw new Error("Username or email already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const insertQuery = `INSERT INTO users (username, first_name, last_name, email, password) 
                           VALUES (?, ?, ?, ?, ?)`;
        await this.query(insertQuery, [username, first_name, last_name, email, hashedPassword]);

        return { message: "Signup successful" };
    }

    async login(identifier, password) {
        // Find user
        const query = "SELECT * FROM users WHERE username = ? OR email = ?";
        const users = await this.query(query, [identifier, identifier]);

        if (users.length === 0) {
            throw new Error("Invalid credentials");
        }

        const user = users[0];

        // Verify password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid credentials");
        }

        // Generate token
        const token = jwt.sign(
            { id: user.users_id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove password from user object
        delete user.password;

        return {
            message: "Login successful",
            token,
            user
        };
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}

module.exports = new AuthService();
