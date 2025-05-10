/**
 * Authentication Service
 * Handles user registration, login, and password reset
 */

const User = require('../models/User');
const Token = require('../models/Token');
const Session = require('../models/Session');
const emailService = require('./emailService');
const verificationService = require('./verificationService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }
  
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @param {string} baseUrl - Base URL for verification link
   * @returns {Promise<Object>} - Registration result
   */
  async registerUser(userData, baseUrl) {
    try {
      const { email, password, displayName } = userData;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      
      if (existingUser) {
        return {
          success: false,
          message: 'Email is already registered'
        };
      }
      
      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        displayName: displayName || email.split('@')[0],
        authMethod: 'local'
      });
      
      // Save user
      await user.save();
      
      // Send verification email
      await verificationService.sendVerificationEmail(email, baseUrl);
      
      return {
        success: true,
        message: 'Registration successful. Please verify your email.'
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        success: false,
        message: error.message || 'Failed to register user'
      };
    }
  }
  
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} - Login result with token
   */
  async loginUser(email, password, req) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      // Check if user has a password (local auth)
      if (!user.password) {
        return {
          success: false,
          message: 'This account uses social login. Please sign in with Google.'
        };
      }
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      // Check if email is verified
      if (!user.isVerified) {
        return {
          success: false,
          message: 'Please verify your email before logging in',
          requiresVerification: true,
          email: user.email
        };
      }
      
      // Generate token
      const token = this.generateAuthToken(user._id);
      
      // Store session
      await this.createSession(user._id, token, req);
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          username: user.username,
          picture: user.picture,
          hasSetUsername: user.hasSetUsername
        }
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      return {
        success: false,
        message: error.message || 'Failed to login'
      };
    }
  }
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @param {string} baseUrl - Base URL for reset link
   * @returns {Promise<Object>} - Result
   */
  async requestPasswordReset(email, baseUrl) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return {
          success: false,
          message: 'No account found with this email address'
        };
      }
      
      // Check if user uses social login
      if (user.authMethod === 'google' && !user.password) {
        return {
          success: false,
          message: 'This account uses Google login. Please sign in with Google.'
        };
      }
      
      // Generate reset token
      const token = await emailService.generatePasswordResetToken(user._id);
      
      // Create reset link
      const resetLink = `${baseUrl}/reset-password.html?token=${token}`;
      
      // Send reset email
      const emailResult = await emailService.sendPasswordResetEmail(email, resetLink);
      
      if (!emailResult.success) {
        return emailResult;
      }
      
      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return {
        success: false,
        message: error.message || 'Failed to request password reset'
      };
    }
  }
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Result
   */
  async resetPassword(token, newPassword) {
    try {
      // Find token in database
      const tokenDoc = await Token.findOne({ 
        token, 
        type: 'passwordReset' 
      });
      
      if (!tokenDoc) {
        return {
          success: false,
          message: 'Invalid or expired reset token'
        };
      }
      
      // Find user by ID
      const user = await User.findById(tokenDoc.userId);
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      // Delete the reset token
      await Token.deleteOne({ _id: tokenDoc._id });
      
      // Invalidate all existing sessions
      await Session.updateMany(
        { userId: user._id },
        { isActive: false }
      );
      
      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        message: error.message || 'Failed to reset password'
      };
    }
  }
  
  /**
   * Generate JWT auth token
   * @param {string} userId - User ID
   * @returns {string} - JWT token
   */
  generateAuthToken(userId) {
    return jwt.sign(
      { userId },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }
  
  /**
   * Create a new session
   * @param {string} userId - User ID
   * @param {string} token - Auth token
   * @param {Object} req - Express request
   * @returns {Promise<Object>} - Created session
   */
  async createSession(userId, token, req) {
    const expiresAt = new Date(Date.now() + this.sessionDuration);
    
    const session = new Session({
      userId,
      token,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt
    });
    
    return await session.save();
  }
  
  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} - Decoded token or null
   */
  async verifyToken(token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Check if session is active
      const session = await Session.findOne({
        token,
        userId: decoded.userId,
        isActive: true
      });
      
      if (!session) {
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
  
  /**
   * Logout user (invalidate session)
   * @param {string} token - Auth token
   * @returns {Promise<boolean>} - Success status
   */
  async logoutUser(token) {
    try {
      const result = await Session.updateOne(
        { token },
        { isActive: false }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }
}

module.exports = new AuthService(); 