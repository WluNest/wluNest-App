// server/routes/userSettingsRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const settingsController = require('../controllers/userSettingsController');

router.get('/', authenticateToken, settingsController.getUserSettings);
router.put('/', authenticateToken, settingsController.updateUserSettings);
router.put('/password', authenticateToken, settingsController.updatePassword);

module.exports = router;