// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controller/authController');

const router = express.Router();

// Public routes (no authentication needed)
router.post('/register', register);
router.post('/login', login);

module.exports = router;