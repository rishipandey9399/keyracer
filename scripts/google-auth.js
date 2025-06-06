/**
 * Google Authentication Helper
 * This standalone script handles the Google sign-in functionality
 */

console.log('Google Auth Helper loaded');

(function() {
    // API base URL - hardcoded for development
    const API_BASE_URL = '/api';
        
    // When DOM is loaded, initialize the Google sign-in button
    document.addEventListener('DOMContentLoaded', function() {
        initGoogleSignIn();
        checkForGoogleCallback();
    });

    // Initialize Google Sign-In
    function initGoogleSignIn() {
        console.log('Initializing Google Sign-In');
        const googleSignInBtn = document.getElementById('google-signin-btn');
        
        if (googleSignInBtn) {
            console.log('Google Sign-In button found, adding click listener');
            googleSignInBtn.addEventListener('click', function(event) {
                event.preventDefault();
                googleSignIn();
            });
        } else {
            console.error('Google Sign-In button not found in DOM');
        }
    }

    // Google Sign-In Handler
    function googleSignIn() {
        console.log('Google sign-in function called');
        
        try {
            // Show message to user
            showMessage('Signing in with Google...', 'info');
            
            // Disable the button to prevent multiple clicks
            const googleButton = document.getElementById('google-signin-btn');
            if (googleButton) {
                googleButton.disabled = true;
                googleButton.style.opacity = '0.7';
                googleButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            }
            
            // Redirect to the Passport.js Google auth endpoint
            window.location.href = `${API_BASE_URL}/auth/google`;
        } catch (error) {
            console.error('Google sign-in error:', error);
            
            // Show error message
            showMessage('Failed to sign in with Google. Please try again.', 'error');
            
            // Re-enable the button
            const googleButton = document.getElementById('google-signin-btn');
            if (googleButton) {
                googleButton.disabled = false;
                googleButton.style.opacity = '1';
                googleButton.innerHTML = '<img src="assets/google-logo.svg" alt="Google" width="18" height="18"> <span class="google-btn-text">Sign in with Google</span>';
            }
        }
    }

    // Check for Google OAuth callback parameters in URL
    function checkForGoogleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('code') && urlParams.has('state')) {
            // This is a callback from Google OAuth
            showMessage('Processing authentication...', 'info');
            
            // Let Passport.js handle the callback
            // No need to manually redirect as Passport.js will handle it
            
            // Check if we have user info in the URL
            if (urlParams.has('user')) {
                try {
                    // The user info is base64 encoded JSON
                    const userInfoBase64 = urlParams.get('user');
                    const userInfoJson = atob(userInfoBase64);
                    const userInfo = JSON.parse(userInfoJson);
                    
                    // Store the Google username in localStorage
                    if (userInfo && userInfo.email) {
                        localStorage.setItem('googleUser', userInfo.email);
                        localStorage.setItem('typingTestUser', userInfo.email);
                        console.log('Google user stored:', userInfo.email);
                        
                        // Show success message
                        showMessage('Successfully signed in with Google!', 'success');
                    }
                } catch (error) {
                    console.error('Error parsing Google user info:', error);
                }
            }
        }
    }

    // Helper function to show messages
    function showMessage(message, type) {
        console.log(`Google Auth - Showing message: ${message} (${type})`);
        
        // Try to find the login message element
        const loginMessage = document.getElementById('login-message');
        
        if (loginMessage) {
            // If message element exists, update it
            loginMessage.textContent = message;
            loginMessage.className = 'message ' + type;
        } else {
            // Create a floating message if the element doesn't exist
            const msgElement = document.createElement('div');
            msgElement.textContent = message;
            msgElement.style.position = 'fixed';
            msgElement.style.top = '20px';
            msgElement.style.right = '20px';
            msgElement.style.zIndex = '9999';
            msgElement.style.padding = '15px';
            msgElement.style.borderRadius = '5px';
            msgElement.style.backgroundColor = type === 'error' ? '#f44336' : 
                                              type === 'success' ? '#4CAF50' : '#2196F3';
            msgElement.style.color = 'white';
            msgElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            
            document.body.appendChild(msgElement);
            
            // Remove after 5 seconds
            setTimeout(() => {
                msgElement.style.opacity = '0';
                msgElement.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    msgElement.remove();
                }, 500);
            }, 5000);
        }
    }

    // Expose the googleSignIn function globally
    window.googleSignIn = googleSignIn;
})(); 