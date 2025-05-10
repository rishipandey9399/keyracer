const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const emailService = require('../services/emailService');
const verificationService = require('../services/verificationService');
const tokenManager = require('../utils/tokenManager');
const googleAuthService = require('../utils/googleAuthService');
const authService = require('../services/authService');
const { authenticate } = require('../middleware/authMiddleware');

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
    
    // Get base URL for reset link
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Request password reset
    const result = await authService.requestPasswordReset(email, baseUrl);
    
    return res.status(result.success ? 200 : 400).json(result);
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
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Reset password
    const result = await authService.resetPassword(token, newPassword);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
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
    
    // Get base URL for verification link
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Send verification email
    const result = await verificationService.sendVerificationEmail(email, baseUrl);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error sending verification email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Verify email with token
 * POST /auth/verify-email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }
    
    // Verify email
    const result = await verificationService.verifyEmail(token);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
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