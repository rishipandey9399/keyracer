/**
 * API Client for Key Racer Backend Services
 * 
 * This module provides client-side functions to interact with
 * the Key Racer Node.js backend API.
 */

// API base URL - adjust for development vs production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api'; // For production

// Auth endpoints
const AUTH_ENDPOINTS = {
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  SEND_VERIFICATION: '/auth/send-verification',
  VERIFY: '/auth/verify'
};

/**
 * Make a request to the API with proper error handling
 * 
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  try {
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if response is successful
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Request a password reset email
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response indicating success or failure
 */
async function requestPasswordReset(email) {
  return apiRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Reset password using a token
 * 
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response indicating success or failure
 */
async function resetPassword(token, newPassword) {
  return apiRequest(AUTH_ENDPOINTS.RESET_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

/**
 * Request a verification code email
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response indicating success or failure and expiry information
 */
async function requestVerificationCode(email) {
  return apiRequest(AUTH_ENDPOINTS.SEND_VERIFICATION, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Verify email with verification code
 * 
 * @param {string} email - User's email address
 * @param {string} code - Verification code
 * @returns {Promise<Object>} - Response indicating success or failure
 */
async function verifyEmail(email, code) {
  return apiRequest(AUTH_ENDPOINTS.VERIFY, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

/**
 * Format verification countdown timer
 * 
 * @param {number} minutes - Minutes remaining
 * @param {number} seconds - Seconds remaining
 * @returns {string} - Formatted countdown string
 */
function formatCountdown(minutes, seconds) {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Start a countdown timer for verification code expiry
 * 
 * @param {number} expiryMinutes - Minutes until expiry
 * @param {Function} onTick - Callback function for each tick with remaining time
 * @param {Function} onExpire - Callback function when timer expires
 * @returns {Object} - Timer control object with stop method
 */
function startVerificationCountdown(expiryMinutes, onTick, onExpire) {
  let timeLeft = expiryMinutes * 60; // Convert to seconds
  
  const timer = setInterval(() => {
    timeLeft--;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Call the tick callback with remaining time
    if (typeof onTick === 'function') {
      onTick(minutes, seconds, formatCountdown(minutes, seconds));
    }
    
    // Check if timer has expired
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (typeof onExpire === 'function') {
        onExpire();
      }
    }
  }, 1000);
  
  // Return control object
  return {
    stop: () => clearInterval(timer)
  };
}

// Export the API functions
window.keyRacerApi = {
  requestPasswordReset,
  resetPassword,
  requestVerificationCode,
  verifyEmail,
  startVerificationCountdown,
  formatCountdown
}; 