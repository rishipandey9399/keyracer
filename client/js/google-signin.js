/**
 * Google Sign-In Integration
 * Handles Google Identity Services authentication
 */

// Google Sign-In callback function
function handleCredentialResponse(response) {
  console.log("Google Sign-In successful!");
  
  // Display success message if message element exists
  const messageEl = document.getElementById('login-message');
  if (messageEl) {
    messageEl.textContent = 'Google Sign-In successful! Processing...';
    messageEl.className = 'message success';
    messageEl.style.display = 'block';
  }
  
  try {
    // Decode the JWT to get user information
    const payload = parseJwt(response.credential);
    console.log("User data:", payload);
    
    // Store user data in localStorage
    localStorage.setItem('typingTestUser', payload.name);
    localStorage.setItem('typingTestUserType', 'google');
    localStorage.setItem('typingTestUserData', JSON.stringify({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    }));
    
    // Check if we should send the token to the backend
    if (window.SEND_TOKEN_TO_SERVER) {
      sendTokenToServer(response.credential);
    } else {
      // Redirect to the main app after a short delay
      setTimeout(() => {
        window.location.href = '../../index.html';
      }, 1000);
    }
  } catch (error) {
    console.error('Error processing Google Sign-In:', error);
    
    if (messageEl) {
      messageEl.textContent = 'Error processing Google Sign-In. Please try again.';
      messageEl.className = 'message error';
    }
  }
}

// Helper function to parse JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
}

// Send the ID token to the backend for verification and session creation
function sendTokenToServer(idToken) {
  const API_BASE_URL = '/api';  // Use relative path for production compatibility
  
  fetch(`${API_BASE_URL}/auth/google/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
    credentials: 'include' // Important for cookies
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Server verification successful');
      window.location.href = '../../index.html';
    } else {
      console.error('Server verification failed:', data.message);
      const messageEl = document.getElementById('login-message');
      if (messageEl) {
        messageEl.textContent = data.message || 'Server verification failed';
        messageEl.className = 'message error';
      }
    }
  })
  .catch(error => {
    console.error('Error sending token to server:', error);
    // Fall back to client-side only auth if server is unavailable
    window.location.href = '../../index.html';
  });
}

// Check if the user is already signed in
function checkExistingLogin() {
  const userData = localStorage.getItem('typingTestUserData');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('User already logged in:', user.name);
    
    // Optionally redirect to the main app
    // window.location.href = '../../index.html';
    
    return true;
  }
  return false;
}

// Sign out from Google
function googleSignOut() {
  // Clear local storage
  localStorage.removeItem('typingTestUser');
  localStorage.removeItem('typingTestUserType');
  localStorage.removeItem('typingTestUserData');
  
  // If Google Identity Services is loaded
  if (google && google.accounts && google.accounts.id) {
    google.accounts.id.disableAutoSelect();
    console.log('Google Sign-In: Auto-select disabled');
  }
  
  console.log('Signed out successfully');
  
  // Redirect to login page
  window.location.href = '../pages/login.html';
}

// Initialize Google Sign-In
function initGoogleSignIn(clientId, autoSignIn = true) {
  // Set global configuration
  window.GOOGLE_CLIENT_ID = clientId;
  
  // Wait for Google Identity Services to load
  window.onload = function() {
    if (google && google.accounts && google.accounts.id) {
      // Configure Google Sign-In
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: autoSignIn
      });
      
      // Render the button if a container exists
      if (document.querySelector('.g_id_signin')) {
        google.accounts.id.renderButton(
          document.querySelector('.g_id_signin'),
          { theme: 'outline', size: 'large' }
        );
      }
      
      // Display the One Tap UI if auto sign-in is enabled
      if (autoSignIn && !checkExistingLogin()) {
        google.accounts.id.prompt();
      }
    }
  };
}

// Export functions for use in other files
window.googleSignIn = {
  init: initGoogleSignIn,
  signOut: googleSignOut,
  handleResponse: handleCredentialResponse,
  checkLogin: checkExistingLogin
}; 