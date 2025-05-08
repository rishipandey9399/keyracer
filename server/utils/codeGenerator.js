const crypto = require('crypto');

/**
 * Generate a cryptographically secure random 6-digit verification code
 * @returns {string} - 6-digit verification code
 */
function generateVerificationCode() {
  // Using crypto.randomBytes to generate a secure random number
  // This is more secure than Math.random()
  const randomBuffer = crypto.randomBytes(3); // 3 bytes = 24 bits
  const randomValue = randomBuffer.readUIntBE(0, 3);

  // Map to 6 digits (000000-999999)
  // Ensuring it's always 6 digits with leading zeros if needed
  return (randomValue % 1000000).toString().padStart(6, '0');
}

/**
 * Create a verification record with expiry
 * @param {string} email - User's email address
 * @param {string} code - Verification code
 * @param {number} expiresInMinutes - Minutes until expiration (default: 10)
 * @returns {Object} - Verification record with code and expiry timestamp
 */
function createVerificationRecord(email, code, expiresInMinutes = 10) {
  return {
    email,
    code,
    expires: Date.now() + (expiresInMinutes * 60 * 1000)
  };
}

/**
 * Verify if a code is valid and not expired
 * @param {Object} record - Verification record
 * @param {string} code - Code to verify
 * @returns {boolean} - True if code is valid and not expired
 */
function isValidCode(record, code) {
  if (!record || !code) {
    return false;
  }

  // Check if record has expired
  if (record.expires < Date.now()) {
    return false;
  }

  // Check if code matches (using timing-safe comparison)
  return crypto.timingSafeEqual(
    Buffer.from(record.code), 
    Buffer.from(code.padStart(6, '0'))
  );
}

/**
 * Calculate remaining validity time
 * @param {Object} record - Verification record with expires timestamp
 * @returns {Object} - Object with minutes and seconds remaining
 */
function getRemainingTime(record) {
  if (!record || record.expires < Date.now()) {
    return { minutes: 0, seconds: 0 };
  }

  const remainingMs = record.expires - Date.now();
  const minutes = Math.floor(remainingMs / (60 * 1000));
  const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

  return { minutes, seconds };
}

module.exports = {
  generateVerificationCode,
  createVerificationRecord,
  isValidCode,
  getRemainingTime
}; 