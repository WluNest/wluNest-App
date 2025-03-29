
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const roommatesController = require('../controllers/roommatesController');


router.get('/', authenticateToken, roommatesController.getRoommates);

module.exports = router;
