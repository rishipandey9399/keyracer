/**
 * Verification Service
 * Handles email verification codes
 */

const crypto = require('crypto');
const emailService = require('./emailService');

class VerificationService {
  constructor() {
    this.verificationCodes = new Map();
    this.codeExpiryMinutes = 10; // Code expiry time in minutes
    this.maxAttempts = 3; // Maximum number of verification attempts
  }
  
  /**
   * Generate a random 6-digit code
   * @returns {string} - 6-digit code
   */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Store verification code for an email
   * @param {string} email - Email address
   * @returns {Object} - Code and expiry info
   */
  storeCode(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const code = this.generateCode();
    const expiresAt = Date.now() + (this.codeExpiryMinutes * 60 * 1000);
    
    this.verificationCodes.set(normalizedEmail, {
      code,
      expiresAt,
      attempts: 0
    });
    
    return {
      code,
      expiresAt,
      expiryMinutes: this.codeExpiryMinutes
    };
  }
  
  /**
   * Send verification code to an email
   * @param {string} email - Email address
   * @returns {Promise<Object>} - Result of the operation
   */
  async sendVerificationCode(email) {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check for existing unexpired code
      const existingEntry = this.verificationCodes.get(normalizedEmail);
      
      if (existingEntry && existingEntry.expiresAt > Date.now()) {
        // Calculate remaining minutes
        const remainingMs = existingEntry.expiresAt - Date.now();
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        
        return {
          success: true,
          message: `Verification code already sent. Valid for ${remainingMinutes} more minutes.`,
          expiresInMinutes: remainingMinutes
        };
      }
      
      // Generate and store code
      const { code, expiryMinutes } = this.storeCode(normalizedEmail);
      
      // Send email
      const result = await emailService.sendVerificationEmail(normalizedEmail, code, expiryMinutes);
      
      if (!result.success) {
        this.verificationCodes.delete(normalizedEmail);
        return result;
      }
      
      return {
        success: true,
        message: `Verification code sent to ${normalizedEmail}`,
        expiresInMinutes: expiryMinutes
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: error.message || 'Failed to send verification code'
      };
    }
  }
  
  /**
   * Verify a code for an email
   * @param {string} email - Email address
   * @param {string} code - Verification code
   * @returns {Object} - Result of verification
   */
  verifyCode(email, code) {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const entry = this.verificationCodes.get(normalizedEmail);
      
      if (!entry) {
        return {
          success: false,
          message: 'No verification code found for this email'
        };
      }
      
      // Check expiration
      if (entry.expiresAt < Date.now()) {
        this.verificationCodes.delete(normalizedEmail);
        return {
          success: false,
          message: 'Verification code has expired'
        };
      }
      
      // Check attempts
      if (entry.attempts >= this.maxAttempts) {
        this.verificationCodes.delete(normalizedEmail);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new code.'
        };
      }
      
      // Increment attempts
      entry.attempts++;
      
      // Verify code
      if (entry.code !== code) {
        return {
          success: false,
          message: 'Invalid verification code',
          attemptsLeft: this.maxAttempts - entry.attempts
        };
      }
      
      // Code is valid, remove it
      this.verificationCodes.delete(normalizedEmail);
      
      return {
        success: true,
        message: 'Email successfully verified'
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: error.message || 'Error verifying code'
      };
    }
  }
  
  /**
   * Clean up expired verification codes
   */
  cleanupExpiredCodes() {
    const now = Date.now();
    
    for (const [email, entry] of this.verificationCodes.entries()) {
      if (entry.expiresAt < now) {
        this.verificationCodes.delete(email);
      }
    }
  }
}

module.exports = new VerificationService(); 