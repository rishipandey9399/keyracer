/**
 * JWT Service
 * Handles JSON Web Token generation and verification
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

class JWTService {
  constructor() {
    // Secret key for signing tokens - in production, use a strong secret
    this.secretKey = process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-this';
    
    // Default token expiration (24 hours)
    this.expiresIn = '24h';
    
    if (!process.env.JWT_SECRET) {
      console.warn('WARNING: JWT_SECRET not set in environment variables, using default secret');
    }
  }
  
  /**
   * Generate a JWT token for a user
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    if (!user || !user.id) {
      throw new Error('Invalid user object for token generation');
    }
    
    // Create payload with user data
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      iat: Math.floor(Date.now() / 1000)
    };
    
    // Generate and return token
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }
  
  /**
   * Verify and decode a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} - Decoded token payload or null if invalid
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return null;
    }
  }
  
  /**
   * Extract token from request
   * @param {Object} req - Express request object
   * @returns {string|null} - JWT token or null if not found
   */
  extractToken(req) {
    try {
      // Check Authorization header first
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
      
      // Then check cookies
      if (req.cookies && req.cookies.auth_token) {
        return req.cookies.auth_token;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting token:', error);
      return null;
    }
  }
}

module.exports = new JWTService(); 