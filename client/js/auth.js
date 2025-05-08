/**
 * Authentication Utilities
 * Client-side helpers for auth state across all pages
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

/**
 * Initialize authentication features on page
 */
function initAuth() {
  // Update UI based on authentication state
  updateAuthUI();
  
  // Initialize Google Sign-In buttons
  initGoogleSignInButtons();
  
  // Initialize logout buttons
  initLogoutButtons();
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
  try {
    const user = getCurrentUser();
    
    // Update authenticated vs unauthenticated elements
    const authElements = document.querySelectorAll('[data-auth-link]');
    const unauthElements = document.querySelectorAll('[data-unauth-link]');
    const userProfileElements = document.querySelectorAll('[data-user-profile]');
    
    if (user) {
      // User is logged in
      authElements.forEach(el => el.style.display = '');
      unauthElements.forEach(el => el.style.display = 'none');
      
      // Update user profile display
      userProfileElements.forEach(el => {
        // Show the element
        el.style.display = '';
        
        // Update name
        const nameEl = el.querySelector('[data-user-name]');
        if (nameEl) nameEl.textContent = user.name || 'User';
        
        // Update email
        const emailEl = el.querySelector('[data-user-email]');
        if (emailEl) emailEl.textContent = user.email || '';
        
        // Update avatar
        const avatarEl = el.querySelector('[data-user-avatar]');
        if (avatarEl) {
          avatarEl.src = user.picture || '/client/assets/default-avatar.png';
          avatarEl.alt = user.name || 'User Avatar';
        }
      });
    } else {
      // User is not logged in
      authElements.forEach(el => el.style.display = 'none');
      unauthElements.forEach(el => el.style.display = '');
      userProfileElements.forEach(el => el.style.display = 'none');
    }
  } catch (error) {
    console.error('Error updating auth UI:', error);
  }
}

/**
 * Initialize all Google Sign-In buttons on the page
 */
function initGoogleSignInButtons() {
  const buttons = document.querySelectorAll('#google-signin-btn, .google-signin-btn');
  
  buttons.forEach(button => {
    // Skip if already initialized
    if (button.dataset.initialized) return;
    
    button.addEventListener('click', handleGoogleSignIn);
    button.dataset.initialized = 'true';
  });
}

/**
 * Initialize all logout buttons on the page
 */
function initLogoutButtons() {
  const buttons = document.querySelectorAll('#logout-btn, .logout-btn');
  
  buttons.forEach(button => {
    // Skip if already initialized
    if (button.dataset.initialized) return;
    
    button.addEventListener('click', handleLogout);
    button.dataset.initialized = 'true';
  });
}

/**
 * Handle Google Sign-In button click
 */
function handleGoogleSignIn() {
  // Show loading state
  const button = this;
  const originalContent = button.innerHTML;
  
  button.disabled = true;
  button.innerHTML = '<span class="loading-spinner"></span> Connecting...';
  
  try {
    // Redirect to Google auth endpoint
    window.location.href = '/api/auth/google';
  } catch (error) {
    console.error('Error initiating Google sign-in:', error);
    
    // Restore button on error
    button.disabled = false;
    button.innerHTML = originalContent;
  }
}

/**
 * Handle logout button click
 */
async function handleLogout() {
  try {
    // Show loading state
    const button = this;
    const originalContent = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner"></span> Logging out...';
    
    // Call logout API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Clear cookies regardless of API response
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Update UI
    updateAuthUI();
    
    // Reload page or redirect to home
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
    
    // Still clear cookies and update UI even if API fails
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    updateAuthUI();
    
    alert('You have been logged out.');
  }
}

/**
 * Get the current user from cookies
 * @returns {Object|null} User object or null if not logged in
 */
function getCurrentUser() {
  try {
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
 * Get a cookie value by name
 * @param {string} name Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  
  return null;
}

// Export functions for use in other scripts
window.authUtils = {
  getCurrentUser,
  isAuthenticated: () => !!getCurrentUser(),
  updateAuthUI,
  handleLogout
}; 