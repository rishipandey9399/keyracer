/**
 * Authentication Middleware
 * Handles JWT authentication and route protection
 */

const authService = require('../services/authService');
const User = require('../models/User');

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
async function authenticate(req, res, next) {
  try {
    // Get token from header or cookie
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Verify token
    const decoded = await authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Extract token from request
 * @param {Object} req - Express request
 * @returns {string|null} - Token or null
 */
function getTokenFromRequest(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
}

/**
 * Middleware to check if email is verified
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function requireVerifiedEmail(req, res, next) {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      requiresVerification: true
    });
  }
  
  next();
}

module.exports = {
  authenticate,
  requireVerifiedEmail
}; 