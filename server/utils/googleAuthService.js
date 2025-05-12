/**
 * Google Authentication Service
 * Handles OAuth 2.0 authentication with Google
 */

// In a production environment, you'd use passport with proper sessions
// This is a simplified implementation for demonstration purposes
const crypto = require('crypto');
require('dotenv').config();

class GoogleAuthService {
  constructor() {
    this.sessions = new Map();
    
    // Load credentials from environment variables
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!this.clientId || !this.clientSecret) {
      console.error('WARNING: Google OAuth credentials not properly configured in .env file');
    }
    
    // Set redirect URL based on environment
    this.redirectUrl = process.env.NODE_ENV === 'production'
      ? 'https://keyracer.in/auth/google/callback'
      : 'http://localhost:3000/auth/google/callback';
      
    // Setup cleanup interval
    this.setupCleanupInterval();
  }
  
  /**
   * Generate OAuth URL for Google sign-in
   * @param {string} state - Optional state parameter for security
   * @returns {string} - Google OAuth URL
   */
  generateAuthUrl(state = crypto.randomBytes(16).toString('hex')) {
    const scope = encodeURIComponent('profile email');
    const redirectUri = encodeURIComponent(this.redirectUrl);
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  }
  
  /**
   * Exchange authorization code for tokens
   * @param {string} code - Authorization code from Google
   * @returns {Promise<Object>} - User profile and tokens
   */
  async exchangeCodeForTokens(code) {
    try {
      const redirectUri = encodeURIComponent(this.redirectUrl);
      const url = `https://oauth2.googleapis.com/token`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `code=${code}&client_id=${this.clientId}&client_secret=${this.clientSecret}&redirect_uri=${redirectUri}&grant_type=authorization_code`,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to exchange code for tokens');
      }
      
      // Get user profile with access token
      const userProfile = await this.getUserProfile(data.access_token);
      
      return {
        user: userProfile,
        tokens: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in,
        }
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }
  
  /**
   * Get user profile with access token
   * @param {string} accessToken - Google access token
   * @returns {Promise<Object>} - User profile data
   */
  async getUserProfile(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to get user profile');
      }
      
      return {
        id: data.sub,
        email: data.email,
        name: data.name,
        picture: data.picture,
        email_verified: data.email_verified,
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
  
  /**
   * Store user session
   * @param {Object} userData - User data
   * @returns {string} - Session token
   */
  createSession(userData) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    
    this.sessions.set(sessionToken, {
      user: userData,
      expiresAt,
    });
    
    return {
      token: sessionToken,
      expiresAt,
    };
  }
  
  /**
   * Verify and get user session
   * @param {string} sessionToken - Session token
   * @returns {Object|null} - User data or null if session invalid
   */
  getSession(sessionToken) {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return null;
    }
    
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionToken);
      return null;
    }
    
    return session.user;
  }
  
  /**
   * Remove a session
   * @param {string} sessionToken - Session token to invalidate
   */
  removeSession(sessionToken) {
    this.sessions.delete(sessionToken);
  }
  
  /**
   * Clean up expired sessions
   */
  cleanup() {
    const now = Date.now();
    
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }
  
  /**
   * Set up automatic cleanup interval
   */
  setupCleanupInterval() {
    // Run cleanup every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }
}

module.exports = new GoogleAuthService(); 