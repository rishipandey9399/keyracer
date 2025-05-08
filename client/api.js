/**
 * Email Authentication API
 * Frontend client code for interacting with the email verification APIs
 */

// API base URL - adjust for development vs production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

/**
 * Send a verification code to user's email during signup
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response data
 */
export async function sendVerificationCode(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send verification code');
    }

    return data;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
}

/**
 * Verify a code sent to user's email
 * 
 * @param {string} email - User's email address
 * @param {string} code - Verification code
 * @returns {Promise<Object>} Response data
 */
export async function verifyCode(email, code) {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify code');
    }

    return data;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
}

/**
 * Request a password reset email
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response data
 */
export async function sendForgotPasswordEmail(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/send-forgot-password-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send password reset email');
    }

    return data;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

/**
 * Reset password using token from email
 * 
 * @param {string} token - Reset token from the email link
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response data
 */
export async function resetPassword(token, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

/**
 * Format time to show minutes:seconds
 * 
 * @param {number} minutes - Minutes
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time string
 */
export function formatTime(minutes, seconds) {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Create a countdown timer for verification code expiry
 * 
 * @param {number} expiryMinutes - Minutes until code expires
 * @param {Function} onTick - Callback function on each tick with (minutes, seconds, formattedTime)
 * @param {Function} onExpire - Callback function when timer expires
 * @returns {Object} Timer control with stop() method
 */
export function createExpiryTimer(expiryMinutes, onTick, onExpire) {
  let totalSeconds = expiryMinutes * 60;
  const timer = setInterval(() => {
    totalSeconds--;
    
    if (totalSeconds <= 0) {
      clearInterval(timer);
      if (onExpire) onExpire();
      return;
    }
    
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    
    if (onTick) onTick(min, sec, formatTime(min, sec));
  }, 1000);
  
  return {
    stop: () => clearInterval(timer)
  };
} 