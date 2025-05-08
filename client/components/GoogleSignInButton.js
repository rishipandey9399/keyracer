import React from 'react';

/**
 * Google Sign-In Button Component
 * Displays a Google sign-in button that redirects to Google OAuth
 */
export default function GoogleSignInButton({ className = '', style = {} }) {
  // The Google auth endpoint URL is handled by our backend
  const handleGoogleSignIn = () => {
    // Show loading state in button
    const button = document.getElementById('google-signin-btn');
    if (button) {
      button.disabled = true;
      const textSpan = button.querySelector('.google-btn-text');
      if (textSpan) {
        const originalText = textSpan.textContent;
        textSpan.innerHTML = '<span class="loading-spinner"></span> Connecting...';
      }
    }
    
    // Redirect to the Google auth endpoint
    window.location.href = '/api/auth/google';
  };

  return (
    <button
      id="google-signin-btn"
      className={`google-signin-btn ${className}`}
      onClick={handleGoogleSignIn}
      style={style}
    >
      <img 
        src="/client/assets/google-logo.svg" 
        alt="Google" 
        className="google-icon" 
        width="18" 
        height="18" 
      />
      <span className="google-btn-text">Sign in with Google</span>
    </button>
  );
}

// Also export a vanilla JS version for non-React pages
export function initGoogleSignInButton() {
  const button = document.getElementById('google-signin-btn');
  if (button) {
    button.addEventListener('click', () => {
      // Show loading state
      button.disabled = true;
      const textSpan = button.querySelector('.google-btn-text');
      if (textSpan) {
        textSpan.innerHTML = '<span class="loading-spinner"></span> Connecting...';
      }
      
      // Redirect to Google auth
      window.location.href = '/api/auth/google';
    });
  }
} 