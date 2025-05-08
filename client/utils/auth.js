/**
 * Authentication Utilities
 * Client-side helpers for auth state management
 */

/**
 * Get the current user from cookies
 * @returns {Object|null} User object or null if not authenticated
 */
export function getCurrentUser() {
  try {
    // Read user_data cookie
    const userCookie = getCookie('user_data');
    
    if (!userCookie) {
      return null;
    }
    
    return JSON.parse(userCookie);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  return !!getCurrentUser();
}

/**
 * Log out the current user
 * @returns {Promise} Promise that resolves when logout is complete
 */
export async function logout() {
  try {
    // Call the logout API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Clear cookies
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Return the response
    return await response.json();
  } catch (error) {
    console.error('Error logging out:', error);
    // Still clear cookies even if API call fails
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    throw error;
  }
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    const cookieName = cookiePair[0].trim();
    
    if (cookieName === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  
  return null;
}

/**
 * Update user interface based on authentication state
 * Call this when the page loads to update UI elements
 */
export function updateAuthUI() {
  const user = getCurrentUser();
  const authLinks = document.querySelectorAll('[data-auth-link]');
  const unauthLinks = document.querySelectorAll('[data-unauth-link]');
  const userProfileElements = document.querySelectorAll('[data-user-profile]');
  
  if (user) {
    // User is authenticated
    authLinks.forEach(el => el.style.display = 'block');
    unauthLinks.forEach(el => el.style.display = 'none');
    
    // Update user profile elements
    userProfileElements.forEach(el => {
      // Set user name
      const nameEl = el.querySelector('[data-user-name]');
      if (nameEl) nameEl.textContent = user.name;
      
      // Set user email
      const emailEl = el.querySelector('[data-user-email]');
      if (emailEl) emailEl.textContent = user.email;
      
      // Set user avatar
      const avatarEl = el.querySelector('[data-user-avatar]');
      if (avatarEl) avatarEl.src = user.picture || '/client/assets/default-avatar.png';
      
      // Show the element
      el.style.display = 'block';
    });
  } else {
    // User is not authenticated
    authLinks.forEach(el => el.style.display = 'none');
    unauthLinks.forEach(el => el.style.display = 'block');
    userProfileElements.forEach(el => el.style.display = 'none');
  }
} 