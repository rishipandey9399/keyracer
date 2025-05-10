/**
 * Navigation Component
 * Adds a user menu with profile and logout options when signed in
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const isLoggedIn = checkUserLoggedIn();
  
  // Create and insert the navigation bar
  createNavBar(isLoggedIn);
  
  // Add event listeners
  setupEventListeners();
});

// Check if user is logged in
function checkUserLoggedIn() {
  const userData = localStorage.getItem('typingTestUserData');
  return !!userData;
}

// Create navigation bar
function createNavBar(isLoggedIn) {
  // Create navigation container if it doesn't exist
  let navContainer = document.getElementById('app-nav');
  
  if (!navContainer) {
    navContainer = document.createElement('div');
    navContainer.id = 'app-nav';
    document.body.insertBefore(navContainer, document.body.firstChild);
    
    // Add styles
    navContainer.style.backgroundColor = '#fff';
    navContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    navContainer.style.padding = '10px 20px';
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'space-between';
    navContainer.style.alignItems = 'center';
  }
  
  // Create navigation content
  let navContent = `
    <div class="nav-logo">
      <a href="../../index.html" style="text-decoration: none; color: #333; font-weight: bold; font-size: 18px;">
        Typing Test App
      </a>
    </div>
    <div class="nav-links">
      <a href="../../index.html" style="margin-right: 15px; text-decoration: none; color: #555;">Home</a>
  `;
  
  if (isLoggedIn) {
    try {
      const userData = JSON.parse(localStorage.getItem('typingTestUserData'));
      const userName = userData.name || 'User';
      const userPicture = userData.picture || '../assets/default-avatar.png';
      
      navContent += `
        <div class="user-menu" style="position: relative; display: inline-block;">
          <div class="user-menu-trigger" style="display: flex; align-items: center; cursor: pointer;">
            <span style="margin-right: 8px;">${userName}</span>
            <img src="${userPicture}" alt="Profile" style="width: 30px; height: 30px; border-radius: 50%;">
          </div>
          <div class="user-dropdown" style="display: none; position: absolute; right: 0; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 4px; width: 150px; z-index: 100;">
            <a href="../pages/profile.html" style="display: block; padding: 10px 15px; text-decoration: none; color: #333;">Profile</a>
            <a href="#" id="logout-link" style="display: block; padding: 10px 15px; text-decoration: none; color: #333;">Sign Out</a>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error parsing user data:', error);
      navContent += `<a href="../pages/login.html" style="text-decoration: none; color: #555;">Sign In</a>`;
    }
  } else {
    navContent += `<a href="../pages/login.html" style="text-decoration: none; color: #555;">Sign In</a>`;
  }
  
  navContent += `
    </div>
  `;
  
  navContainer.innerHTML = navContent;
}

// Setup event listeners for navigation
function setupEventListeners() {
  // User menu dropdown toggle
  const userMenuTrigger = document.querySelector('.user-menu-trigger');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userMenuTrigger && userDropdown) {
    userMenuTrigger.addEventListener('click', function() {
      if (userDropdown.style.display === 'none') {
        userDropdown.style.display = 'block';
      } else {
        userDropdown.style.display = 'none';
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!userMenuTrigger.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.style.display = 'none';
      }
    });
    
    // Logout functionality
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Use Google Sign-Out if available
        if (window.googleSignIn && window.googleSignIn.signOut) {
          window.googleSignIn.signOut();
        } else {
          // Fallback to manual sign out
          localStorage.removeItem('typingTestUser');
          localStorage.removeItem('typingTestUserType');
          localStorage.removeItem('typingTestUserData');
          
          // Redirect to login page
          window.location.href = '../pages/login.html';
        }
      });
    }
  }
} 