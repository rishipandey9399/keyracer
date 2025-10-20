/**
 * Verification Service
 * Handles email verification
 */

const crypto = require('crypto');
const emailService = require('./emailService');
const User = require('../models/User');
const Token = require('../models/Token');

class VerificationService {
  constructor() {
    // Token expiry time in hours
    this.tokenExpiryHours = 1;
  }
  
  /**
   * Send verification email to a user
   * @param {string} email - Email address
   * @param {string} baseUrl - Base URL for verification link
   * @returns {Promise<Object>} - Result of the operation
   */
  async sendVerificationEmail(email, baseUrl) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Find user by email
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return {
          success: false,
          message: 'User not found with this email address'
        };
      }

      // Check if user is already verified
      if (user.isVerified) {
        return {
          success: true,
          message: 'Email is already verified'
        };
      }

      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex');

      // Set token and expiry on user
      user.verificationToken = token;
      user.verificationTokenExpires = Date.now() + (this.tokenExpiryHours * 60 * 60 * 1000); // Convert hours to milliseconds

      // Save the user
      await user.save();

      // Create verification link
      const verificationLink = `${baseUrl}/verify-email.html?token=${token}`;

      // Send verification email
      const result = await emailService.sendVerificationEmail(normalizedEmail, verificationLink);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        message: `Verification email sent to ${normalizedEmail}`,
        expiresInHours: this.tokenExpiryHours
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return {
        success: false,
        message: error.message || 'Failed to send verification email'
      };
    }
  }
  
  /**
   * Verify a user's email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} - Result of verification
   */
  async verifyEmail(token) {
    try {
      // Find token in database
      const tokenDoc = await Token.findOne({ 
        token, 
        type: 'emailVerification' 
      });
      
      if (!tokenDoc) {
        return {
          success: false,
          message: 'Invalid or expired verification token'
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
      
      // Mark user as verified
      user.isVerified = true;
      await user.save();
      
      // Delete the verification token
      await Token.deleteOne({ _id: tokenDoc._id });
      
      return {
        success: true,
        message: 'Email successfully verified'
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      return {
        success: false,
        message: error.message || 'Error verifying email'
      };
    }
  }
}

module.exports = new VerificationService(); 