/**
 * UserSettingsController
 *
 * This controller handles operations related to user settings and account management.
 * It interfaces with the database to:
 *   - Retrieve and update user profile settings
 *   - Change user passwords (with current password validation)
 *   - Update user email addresses (with uniqueness check and password confirmation)
 *   - Permanently delete user accounts (with password confirmation)
 *
 * Dependencies:
 *   - bcrypt: for securely hashing and comparing passwords
 *   - db: a configured MySQL database connection using promise-based queries
 *
 * Assumes that:
 *   - `req.user.id` contains the authenticated user's ID (populated by authentication middleware)
 *   - Inputs are received via `req.body` and are expected to be validated by the client or middleware
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
const db = require('../db');
const bcrypt = require('bcrypt');

class UserSettingsController {
  async getUserSettings(req, res) {
    try {
      const [rows] = await db.promise().query(
        `SELECT religion, gender, university, year, program,
         about_you, looking_for_roommate, email
         FROM users WHERE users_id = ?`,
        [req.user.id]
      );
      res.json(rows[0] || {});
    } catch (error) {
      console.error('Settings fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  async updateUserSettings(req, res) {
    try {
      const { religion, gender, university, year, program, about_you, looking_for_roommate } = req.body;
      await db.promise().query(
        `UPDATE users SET 
          religion=?, gender=?, university=?,
          year=?, program=?, about_you=?,
          looking_for_roommate=?
         WHERE users_id=?`,
        [religion, gender, university, year, program, about_you, looking_for_roommate, req.user.id]
      );
      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Settings update error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const [user] = await db.promise().query(
        "SELECT password FROM users WHERE users_id = ?",
        [userId]
      );

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user[0].password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.promise().query(
        "UPDATE users SET password = ? WHERE users_id = ?",
        [hashedPassword, userId]
      );

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password update error:", error);
      res.status(500).json({ error: "Failed to update password" });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { currentPassword } = req.body;
      const userId = req.user.id;

      const [user] = await db.promise().query(
        "SELECT password FROM users WHERE users_id = ?",
        [userId]
      );

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user[0].password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      await db.promise().query(
        "DELETE FROM users WHERE users_id = ?",
        [userId]
      );

      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      console.error("Account deletion error:", err);
      res.status(500).json({ error: "Failed to delete account" });
    }
  }

  async updateEmail(req, res) {
    try {
      const { email, currentPassword } = req.body;
      const userId = req.user.id;

      const [user] = await db.promise().query(
        "SELECT password FROM users WHERE users_id = ?",
        [userId]
      );

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user[0].password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const [existing] = await db.promise().query(
        "SELECT * FROM users WHERE email = ? AND users_id != ?",
        [email, userId]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      await db.promise().query(
        "UPDATE users SET email = ? WHERE users_id = ?",
        [email, userId]
      );

      res.json({ message: "Email updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
}

// Export as a ready-to-use instance
module.exports = new UserSettingsController();
