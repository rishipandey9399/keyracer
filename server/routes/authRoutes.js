const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const emailService = require('../services/emailService');
const verificationService = require('../services/verificationService');
const tokenManager = require('../utils/tokenManager');
const googleAuthService = require('../utils/googleAuthService');
const authService = require('../services/authService');
const { authenticate } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendEmail, sendPasswordResetEmail } = require('../utils/emailUtils');

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
 * Register a new user
 * POST /auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Get base URL for verification link
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Register user
    const result = await authService.registerUser(
      { email, password, displayName },
      baseUrl
    );
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Login user
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Login user
    const result = await authService.loginUser(email, password, req);
    
    if (result.success) {
      // Set token cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Logout user
 * POST /auth/logout
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    const success = await authService.logoutUser(req.token);
    
    // Clear cookie
    res.clearCookie('token');
    
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

/**
 * Request password reset
 * POST /auth/forgot-password
 */
router.post('/forgot-password', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find the user
    const user = await User.findOne({ email });
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }
    
    // Generate a JWT token for password reset
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Save the token and expiration to the user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // Send password reset email
    await sendPasswordResetEmail(user.email, token);
    
    res.json({ 
      success: true, 
      message: 'Password reset link sent to your email' 
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request' 
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
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user
    const user = await User.findOne({ 
      email: decoded.email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password reset token is invalid or has expired' 
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Save the user
    await user.save();
    
    // Send confirmation email
    const emailData = {
      to: user.email,
      subject: 'Password Reset Successful',
      html: `
        <h1>Password Reset Successful</h1>
        <p>Your password has been successfully reset.</p>
        <p>If you did not request this change, please contact us immediately.</p>
      `
    };
    
    await sendEmail(emailData);
    
    res.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    
    // Check if error is due to invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset token' 
      });
    }
    
    // Check if token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while resetting your password' 
    });
  }
});

/**
 * Send verification email
 * POST /auth/send-verification
 */
router.post('/send-verification', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already verified' 
      });
    }
    
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 1 hour from now
    const verificationCodeExpires = Date.now() + 3600000;
    
    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    
    // Save the user
    await user.save();
    
    // Send verification email
    const emailData = {
      to: user.email,
      subject: 'Verify Your Email - Key Racer',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering with Key Racer!</p>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 1 hour.</p>
      `
    };
    
    await sendEmail(emailData);
    
    res.json({ 
      success: true, 
      message: 'Verification code sent successfully',
      expiresIn: 3600 // 1 hour in seconds
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while sending verification code' 
    });
  }
});

/**
 * Verify email with verification code
 * POST /auth/verify-email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and verification code are required' 
      });
    }
    
    // Find the user
    const user = await User.findOne({ 
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code' 
      });
    }
    
    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    
    // Save the user
    await user.save();
    
    // Send confirmation email
    const emailData = {
      to: user.email,
      subject: 'Email Verification Successful',
      html: `
        <h1>Email Verification Successful</h1>
        <p>Your email has been successfully verified.</p>
        <p>You can now enjoy all the features of Key Racer!</p>
      `
    };
    
    await sendEmail(emailData);
    
    res.json({ 
      success: true, 
      message: 'Email has been verified successfully',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while verifying your email' 
    });
  }
});

/**
 * Get current user
 * GET /auth/me
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        username: req.user.username,
        picture: req.user.picture,
        hasSetUsername: req.user.hasSetUsername,
        isVerified: req.user.isVerified
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
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
 * Verify Google ID token
 * POST /auth/google/verify
 */
router.post('/google/verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }
    
    // Verify the ID token with Google
    const ticket = await verifyGoogleIdToken(idToken);
    
    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID token'
      });
    }
    
    // Get user info from the ticket
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];
    const emailVerified = payload['email_verified'];
    
    if (!emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified with Google'
      });
    }
    
    // Create a session for the user
    const { token, expiresAt } = googleAuthService.createSession({
      id: userId,
      email,
      name,
      picture,
      email_verified: emailVerified
    });
    
    // Set a cookie with the session token
    res.cookie('auth_token', token, {
      expires: new Date(expiresAt),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: userId,
        name,
        email,
        picture
      }
    });
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify ID token'
    });
  }
});

// Helper function to verify Google ID token
async function verifyGoogleIdToken(idToken) {
  try {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    return ticket;
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    return null;
  }
}

module.exports = router; 