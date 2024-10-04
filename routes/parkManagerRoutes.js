// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controller/authController');
const { createCheckin } = require('../controller/parkManagerController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/checkin', authMiddleware, createCheckin);

module.exports = router;