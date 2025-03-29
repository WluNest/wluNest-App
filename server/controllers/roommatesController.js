
const db = require('../db');

module.exports = {
  getRoommates: async (req, res) => {
    try {
      // Query params for filters
      const { gender, religion, year, program, location } = req.query;

      // Base query: users who are looking_for_roommate
      let sql = `
        SELECT users_id, name, age, gender, religion, university, year, program, location, about_you
        FROM users
        WHERE looking_for_roommate = 1
      `;

      const params = [];

      // Append conditions dynamically
      if (gender) {
        sql += ' AND gender = ?';
        params.push(gender);
      }
      if (religion) {
        sql += ' AND religion = ?';
        params.push(religion);
      }
      if (year) {
        sql += ' AND year = ?';
        params.push(year);
      }
      if (program) {
        sql += ' AND program = ?';
        params.push(program);
      }
      if (location) {
        sql += ' AND location = ?';
        params.push(location);
      }

      const [rows] = await db.promise().query(sql, params);
      res.json(rows);
    } catch (error) {
      console.error('getRoommates error:', error);
      return res.status(500).json({ error: 'Failed to retrieve roommates' });
    }
  },
};
