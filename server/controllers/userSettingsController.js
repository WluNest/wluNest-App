// server/controllers/userSettingsController.js
const db = require('../db');

module.exports = {
  getUserSettings: async (req, res) => {
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
  },
  
  updateUserSettings: async (req, res) => {
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
  },
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      // Add password verification and update logic here
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }
};