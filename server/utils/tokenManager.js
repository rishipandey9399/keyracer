const crypto = require('crypto');

/**
 * Token Manager
 * Handles verification codes and password reset tokens
 */
class TokenManager {
  constructor() {
    // In production, these would be stored in a database
    this.verificationCodes = new Map();
    this.resetTokens = new Map();
    
    // Configuration
    this.codeExpiryMinutes = 10;
    this.tokenExpiryMinutes = 15;
    this.maxVerificationAttempts = 3;
    
    // Rate limiting
    this.requestLimits = new Map();
    this.maxRequestsPerHour = 5;
  }
  
  /**
   * Generate a secure verification code
   * @returns {string} - 6-digit code
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Generate a secure random token
   * @param {number} bytes - Number of bytes for the token
   * @returns {string} - Hex string token
   */
  generateSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }
  
  /**
   * Store a verification code for an email
   * @param {string} email - Email address
   * @returns {Object} - Code and expiry info
   */
  storeVerificationCode(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check rate limiting
    if (this.isRateLimited(normalizedEmail)) {
      throw new Error('Too many verification code requests. Please try again later.');
    }
    
    // Generate a random code
    const code = this.generateVerificationCode();
    const expiresAt = Date.now() + (this.codeExpiryMinutes * 60 * 1000);
    
    // Store the code
    this.verificationCodes.set(normalizedEmail, {
      code,
      expiresAt,
      attempts: 0
    });
    
    // Track this request for rate limiting
    this.trackRequest(normalizedEmail);
    
    return {
      code,
      expiresAt,
      expiryMinutes: this.codeExpiryMinutes
    };
  }
  
  /**
   * Verify a code for an email
   * @param {string} email - Email address
   * @param {string} code - Verification code
   * @returns {boolean} - True if code is valid
   */
  verifyCode(email, code) {
    const normalizedEmail = email.toLowerCase().trim();
    const codeData = this.verificationCodes.get(normalizedEmail);
    
    if (!codeData) {
      return false;
    }
    
    // Check if code is expired
    if (Date.now() > codeData.expiresAt) {
      this.verificationCodes.delete(normalizedEmail);
      return false;
    }
    
    // Check attempts
    codeData.attempts++;
    if (codeData.attempts > this.maxVerificationAttempts) {
      this.verificationCodes.delete(normalizedEmail);
      return false;
    }
    
    // Verify code using a timing-safe comparison
    const isValid = this.timingSafeEqual(code, codeData.code);
    
    if (isValid) {
      // Code is valid, remove it from storage to prevent reuse
      this.verificationCodes.delete(normalizedEmail);
    }
    
    return isValid;
  }
  
  /**
   * Store a password reset token for an email
   * @param {string} email - Email address
   * @returns {Object} - Token and expiry info
   */
  storeResetToken(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check rate limiting
    if (this.isRateLimited(normalizedEmail)) {
      throw new Error('Too many password reset requests. Please try again later.');
    }
    
    // Generate a secure token
    const token = this.generateSecureToken(64);
    const expiresAt = Date.now() + (this.tokenExpiryMinutes * 60 * 1000);
    
    // Store the token
    this.resetTokens.set(token, {
      email: normalizedEmail,
      expiresAt
    });
    
    // Track this request for rate limiting
    this.trackRequest(normalizedEmail);
    
    return {
      token,
      expiresAt,
      expiryMinutes: this.tokenExpiryMinutes
    };
  }
  
  /**
   * Verify a reset token
   * @param {string} token - Reset token
   * @returns {string|null} - Email if token is valid, null otherwise
   */
  verifyResetToken(token) {
    const tokenData = this.resetTokens.get(token);
    
    if (!tokenData) {
      return null;
    }
    
    // Check if token is expired
    if (Date.now() > tokenData.expiresAt) {
      this.resetTokens.delete(token);
      return null;
    }
    
    return tokenData.email;
  }
  
  /**
   * Invalidate a reset token
   * @param {string} token - Reset token to invalidate
   */
  invalidateResetToken(token) {
    this.resetTokens.delete(token);
  }
  
  /**
   * Track a request for rate limiting
   * @param {string} email - Email address
   */
  trackRequest(email) {
    const now = Date.now();
    const hourFromNow = now + (60 * 60 * 1000);
    
    // Get or create the rate limit record
    let limit = this.requestLimits.get(email);
    
    if (!limit) {
      limit = { count: 0, resetAt: hourFromNow };
      this.requestLimits.set(email, limit);
    }
    
    // Reset if expired
    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = hourFromNow;
    }
    
    // Increment count
    limit.count++;
  }
  
  /**
   * Check if email is rate limited
   * @param {string} email - Email address
   * @returns {boolean} - True if rate limited
   */
  isRateLimited(email) {
    const limit = this.requestLimits.get(email);
    
    if (!limit) {
      return false;
    }
    
    // Reset if expired
    if (Date.now() > limit.resetAt) {
      this.requestLimits.set(email, { count: 0, resetAt: Date.now() + (60 * 60 * 1000) });
      return false;
    }
    
    return limit.count >= this.maxRequestsPerHour;
  }
  
  /**
   * Compare two strings in a timing-safe way
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {boolean} - True if strings are equal
   */
  timingSafeEqual(a, b) {
    // If lengths are different, strings are not equal
    // But still do the comparison to prevent timing attacks
    const equal = a.length === b.length;
    
    let result = equal;
    
    // Compare each character
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const aChar = i < a.length ? a.charCodeAt(i) : 0;
      const bChar = i < b.length ? b.charCodeAt(i) : 0;
      result = result && (aChar === bChar);
    }
    
    return result;
  }
  
  /**
   * Clean up expired data
   */
  cleanup() {
    const now = Date.now();
    
    // Clean up verification codes
    for (const [email, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(email);
      }
    }
    
    // Clean up reset tokens
    for (const [token, data] of this.resetTokens.entries()) {
      if (now > data.expiresAt) {
        this.resetTokens.delete(token);
      }
    }
    
    // Clean up rate limits
    for (const [email, limit] of this.requestLimits.entries()) {
      if (now > limit.resetAt) {
        this.requestLimits.delete(email);
      }
    }
  }
}

module.exports = new TokenManager(); 