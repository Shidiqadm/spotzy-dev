// middleware/auth.js
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { handleResponse } = require('../utils/responseHandler');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return handleResponse(res, StatusCodes.UNAUTHORIZED, { message: 'Access token is missing or invalid' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('User Model:', User); 
    
    // Fetch the user from the database using the id in the decoded token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return handleResponse(res, StatusCodes.UNAUTHORIZED, { message: 'User not found' });
    }

    // Attach the full user object to req.user
    req.user = user;

    next();
  } catch (err) {
    console.error("Error in auth middleware:", err); // Log the error for debugging
    return handleResponse(res, StatusCodes.FORBIDDEN, { message: 'Invalid token' });
  }
};

module.exports = authMiddleware;