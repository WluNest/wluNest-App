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
const BaseService = require('../services/BaseService');
const bcrypt = require('bcrypt');

class UserSettingsService extends BaseService {
  async getUserSettings(userId) {
    const query = `
      SELECT religion, gender, university, year, program,
      about_you, looking_for_roommate, email
      FROM users WHERE users_id = ?`;
    
    const results = await this.query(query, [userId]);
    return results[0] || {};
  }

  async updateUserSettings(userId, settings) {
    const query = `
      UPDATE users SET 
        religion=?, gender=?, university=?,
        year=?, program=?, about_you=?,
        looking_for_roommate=?
      WHERE users_id=?`;
    
    const params = [
      settings.religion,
      settings.gender,
      settings.university,
      settings.year,
      settings.program,
      settings.about_you,
      settings.looking_for_roommate,
      userId
    ];

    await this.query(query, params);
  }

  async updateEmail(userId, email, currentPassword) {
    const user = await this.query('SELECT password FROM users WHERE users_id = ?', [userId]);
    if (!user[0]) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(currentPassword, user[0].password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    await this.query('UPDATE users SET email = ? WHERE users_id = ?', [email, userId]);
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.query('SELECT password FROM users WHERE users_id = ?', [userId]);
    if (!user[0]) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(currentPassword, user[0].password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.query('UPDATE users SET password = ? WHERE users_id = ?', [hashedPassword, userId]);
  }

  async deleteAccount(userId, password) {
    const user = await this.query('SELECT password FROM users WHERE users_id = ?', [userId]);
    if (!user[0]) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    await this.query('DELETE FROM users WHERE users_id = ?', [userId]);
  }
}

const userSettingsService = new UserSettingsService();

class UserSettingsController {
  async getUserSettings(req, res) {
    try {
      const settings = await userSettingsService.getUserSettings(req.user.id);
      res.json(settings);
    } catch (error) {
      console.error('Settings fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  async updateUserSettings(req, res) {
    try {
      const { religion, gender, university, year, program, about_you, looking_for_roommate } = req.body;
      await userSettingsService.updateUserSettings(req.user.id, {
        religion,
        gender,
        university,
        year,
        program,
        about_you,
        looking_for_roommate
      });
      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Settings update error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      await userSettingsService.updatePassword(req.user.id, currentPassword, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      } else if (error.message === 'Invalid password') {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      console.error('Password update error:', error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { currentPassword } = req.body;
      await userSettingsService.deleteAccount(req.user.id, currentPassword);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      } else if (error.message === 'Invalid password') {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      console.error('Account deletion error:', error);
      res.status(500).json({ error: 'Failed to delete account' });
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

      await userSettingsService.updateEmail(req.user.id, email, currentPassword);
      res.json({ message: 'Email updated successfully' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      } else if (error.message === 'Invalid password') {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      console.error('Email update error:', error);
      res.status(500).json({ error: 'Failed to update email' });
    }
  }
}

// Export as a ready-to-use instance
module.exports = new UserSettingsController();
