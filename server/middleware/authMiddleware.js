/**
 * Authentication Middleware
 * Checks JWT token in cookies or Authorization header
 */
const jwtService = require('../utils/jwtService');

/**
 * Middleware to authenticate routes
 * If valid token is present, attaches user to request object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
function authenticate(req, res, next) {
  try {
    // Extract token from request
    const token = jwtService.extractToken(req);
    
    if (!token) {
      // No token, continue without authentication
      req.isAuthenticated = false;
      return next();
    }
    
    // Verify token
    const decoded = jwtService.verifyToken(token);
    
    if (!decoded) {
      // Invalid token
      req.isAuthenticated = false;
      return next();
    }
    
    // Token is valid, set user and auth flag in request
    req.user = decoded;
    req.isAuthenticated = true;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.isAuthenticated = false;
    next();
  }
}

/**
 * Middleware to require authentication
 * Redirects to login page if not authenticated
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
function requireAuth(req, res, next) {
  // First run the authenticate middleware
  authenticate(req, res, (err) => {
    if (err) return next(err);
    
    if (!req.isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    next();
  });
}

module.exports = {
  authenticate,
  requireAuth
}; 