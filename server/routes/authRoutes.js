const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const emailService = require('../services/emailService');
const verificationService = require('../services/verificationService');
const tokenManager = require('../utils/tokenManager');
const googleAuthService = require('../utils/googleAuthService');

// In-memory token storage (should use a database in production)
const passwordResetTokens = new Map();

/**
 * Generate a secure random token
 * @param {number} bytes - Number of bytes for token
 * @returns {string} - Hex string token
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Validation middleware for email
 */
function validateEmail(req, res, next) {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }
  
  next();
}

/**
 * Request password reset route
 * POST /auth/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Generate password reset token
    const resetToken = generateSecureToken();
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    // Store token (in a real app, store in database with user ID and expiration)
    passwordResetTokens.set(resetToken, {
      email,
      expires: expirationTime
    });
    
    // Generate the reset link 
    // In production, use your full domain
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
    
    // Send the password reset email
    const emailResult = await emailService.sendPasswordResetEmail(email, resetToken, resetLink);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send password reset email'
      });
    }
    
    // Respond with success
    return res.json({ 
      success: true, 
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

/**
 * Reset password with token
 * POST /auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token and new password are required'
      });
    }
    
    // Check if token exists and is valid
    const tokenData = passwordResetTokens.get(token);
    
    if (!tokenData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token'
      });
    }
    
    // Check if token is expired
    if (tokenData.expires < Date.now()) {
      // Remove expired token
      passwordResetTokens.delete(token);
      
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired. Please request a new one.'
      });
    }
    
    // In a real application, update the user's password in the database
    // For this example, we'll just simulate success
    
    // Delete the used token
    passwordResetTokens.delete(token);
    
    return res.json({ 
      success: true, 
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

/**
 * Send account verification code
 * POST /auth/send-verification
 */
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required'
      });
    }
    
    // Use our verification service to send the code
    const result = await verificationService.sendVerificationCode(email);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error sending verification code:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

/**
 * Verify account with code
 * POST /auth/verify
 */
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and verification code are required'
      });
    }
    
    // Use our verification service to verify the code
    const result = verificationService.verifyCode(email, code);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // In a real application, mark the user's email as verified in the database
    // For this example, we'll just return success
    
    return res.json(result);
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

/**
 * Check email service configuration
 * GET /auth/check-email-config
 * For admin/diagnostic use only - not public facing
 */
router.get('/check-email-config', async (req, res) => {
  try {
    // This route should be protected in production
    // Only accessible by admins or in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not available in production' 
      });
    }
    
    const isConfigured = await emailService.checkApiConfiguration();
    
    return res.json({ 
      success: true, 
      configured: isConfigured,
      fromEmail: emailService.fromEmail
    });
  } catch (error) {
    console.error('Error checking email configuration:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

/**
 * Get verification code status (for development/testing)
 * This endpoint should be secured or disabled in production
 */
router.get('/verification-status', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Not available in production'
    });
  }
  
  // Run cleanup to remove expired codes
  verificationService.cleanupExpiredCodes();
  
  // Count active verification codes
  const activeCount = verificationService.verificationCodes.size;
  
  return res.json({
    success: true,
    activeVerificationCodes: activeCount,
    codeExpiryMinutes: verificationService.codeExpiryMinutes
  });
});

/**
 * Send verification code
 * POST /api/send-verification-code
 */
router.post('/send-verification-code', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate and store verification code
    const { code, expiryMinutes } = tokenManager.storeVerificationCode(email);
    
    // Send verification email
    const emailResult = await emailService.sendVerificationEmail(email, code, expiryMinutes);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    return res.json({
      success: true,
      message: `Verification code sent to ${email}`,
      expiresInMinutes: expiryMinutes
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'An error occurred while sending verification code'
    });
  }
});

/**
 * Verify code
 * POST /api/verify-code
 */
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }
    
    // Verify the code
    const isValid = tokenManager.verifyCode(email, code);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
    
    // At this point, you would mark the user as verified in your database
    
    return res.json({
      success: true,
      message: 'Email successfully verified'
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'An error occurred while verifying code'
    });
  }
});

/**
 * Send forgot password email
 * POST /api/send-forgot-password-email
 */
router.post('/send-forgot-password-email', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Here you would typically check if the email exists in your database
    // const user = await User.findOne({ email });
    // if (!user) {
    //   // For security reasons, still return success even if email doesn't exist
    //   return res.json({
    //     success: true,
    //     message: `If a user with this email exists, a password reset link has been sent to ${email}`
    //   });
    // }
    
    // Generate reset token
    const { token, expiryMinutes } = tokenManager.storeResetToken(email);
    
    // Create reset link
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    
    // Send password reset email
    const emailResult = await emailService.sendPasswordResetEmail(email, token, resetLink);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }
    
    return res.json({
      success: true,
      message: `Password reset link sent to ${email}`,
      expiresInMinutes: expiryMinutes
    });
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'An error occurred while sending password reset email'
    });
  }
});

/**
 * Reset password
 * POST /api/reset-password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Verify token
    const email = tokenManager.verifyResetToken(token);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Here you would update the user's password in your database
    // await User.updateOne({ email }, { password: hashedPassword });
    
    // Invalidate the token so it can't be used again
    tokenManager.invalidateResetToken(token);
    
    return res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'An error occurred while resetting password'
    });
  }
});

/**
 * Google OAuth login route
 * GET /auth/google
 */
router.get('/google', (req, res) => {
  try {
    // Generate a unique state to prevent CSRF
    const state = crypto.randomBytes(16).toString('hex');
    
    // In a production app, store this state in a session or cookie
    // For this example, we'll just use it directly
    
    // Generate Google OAuth URL
    const authUrl = googleAuthService.generateAuthUrl(state);
    
    // Redirect to Google OAuth page
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Google auth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Google authentication'
    });
  }
});

/**
 * Google OAuth callback route
 * GET /auth/google/callback
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is missing'
      });
    }
    
    // Exchange code for tokens
    const authData = await googleAuthService.exchangeCodeForTokens(code);
    
    if (!authData.user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified with Google'
      });
    }
    
    // Create a session for the user
    const { token, expiresAt } = googleAuthService.createSession(authData.user);
    
    // Set a cookie with the session token
    // In a real app, use secure cookies with proper options
    res.cookie('auth_token', token, {
      expires: new Date(expiresAt),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Redirect to the app or a success page
    res.redirect('/login-success.html?provider=google');
  } catch (error) {
    console.error('Error processing Google callback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google'
    });
  }
});

/**
 * Get current user route
 * GET /auth/me
 */
router.get('/me', (req, res) => {
  try {
    // Get session token from cookie
    const token = req.cookies && req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Get user from session
    const user = googleAuthService.getSession(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }
    
    // Return user data
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: 'google'
      }
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Logout route
 * POST /auth/logout
 */
router.post('/logout', (req, res) => {
  try {
    // Get session token from cookie
    const token = req.cookies && req.cookies.auth_token;
    
    if (token) {
      // Remove session
      googleAuthService.removeSession(token);
      
      // Clear cookie
      res.clearCookie('auth_token');
    }
    
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 