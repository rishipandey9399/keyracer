/**
 * Google Authentication API Client
 * Handles client-side interactions with Google OAuth
 */

// API base URL - adjust for development vs production
const API_BASE_URL = process.env.NODE_ENV === 'production' || location.hostname === 'keyracer.in'
  ? 'https://keyracer.in/api' 
  : 'http://localhost:3000/api';

/**
 * Initiate Google OAuth login
 * This will redirect the user to Google's consent page
 */
export function initiateGoogleLogin() {
  // Redirect to the Google auth endpoint
  window.location.href = `${API_BASE_URL}/auth/google`;
}

/**
 * Get the current authenticated user
 * 
 * @returns {Promise<Object>} User data if authenticated
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { authenticated: false };
    }

    const data = await response.json();
    
    return {
      authenticated: true,
      user: data.user
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return { authenticated: false };
  }
}

/**
 * Logout the current user
 * 
 * @returns {Promise<Object>} Response data
 */
export async function logout() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to logout');
    }

    return data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

/**
 * Check if the current URL contains Google auth callback parameters
 * This is useful to handle the Google redirect on your app's page
 * 
 * @returns {boolean} True if the URL has Google auth callback params
 */
export function isGoogleAuthCallback() {
  const url = new URL(window.location.href);
  return url.searchParams.has('code') && url.searchParams.has('state');
}

/**
 * Handle Google auth callback
 * This should be called when the page loads after Google redirects back
 * 
 * @returns {Promise<Object>} Authentication result
 */
export async function handleGoogleAuthCallback() {
  try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code || !state) {
      return { success: false, message: 'Invalid callback URL' };
    }
    
    // In a SPA, redirect to the backend to handle the token exchange
    window.location.href = `${API_BASE_URL}/auth/google/callback?code=${code}&state=${state}`;
    return { success: true };
  } catch (error) {
    console.error('Error handling Google auth callback:', error);
    return { success: false, message: error.message };
  }
} 