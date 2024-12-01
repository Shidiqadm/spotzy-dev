// controllers/AuthController.js
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { handleResponse } = require('../utils/responseHandler');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return handleResponse(res, StatusCodes.BAD_REQUEST, { error: 'All fields are required' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return handleResponse(res, StatusCodes.BAD_REQUEST, { error: 'User already exists' });
    }

    // Create new user
    user = await User.create({ name, email, password });

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return handleResponse(res, StatusCodes.CREATED, {
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { error: error.message });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleResponse(res, StatusCodes.BAD_REQUEST, { error: 'All fields are required' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return handleResponse(res, StatusCodes.UNAUTHORIZED, { error: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      console.log('Invalid password');
      return handleResponse(res, StatusCodes.UNAUTHORIZED, { error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2 days' });

    return handleResponse(res, StatusCodes.OK, {
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return handleResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { error: error.message });
  }
};