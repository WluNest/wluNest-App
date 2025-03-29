// server/routes/userSettingsRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const settingsController = require('../controllers/userSettingsController');

router.get('/settings', authenticateToken, settingsController.getUserSettings);
router.put('/settings', authenticateToken, settingsController.updateUserSettings);
router.put('/settings/password', authenticateToken, settingsController.updatePassword);


module.exports = router;