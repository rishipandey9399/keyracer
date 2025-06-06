/**
 * Key Racer - Header Authentication
 * Manages the user authentication status in the header
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const headerActions = document.querySelector('.header-actions');
    const loginBtn = document.querySelector('#loginBtn');
    const logoutBtn = document.querySelector('#logoutBtn');
    
    // Check current page and user authentication status
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || 
                        currentPath.endsWith('/') ||
                        currentPath.endsWith('/keyracer/');
    const isLoggedIn = localStorage.getItem('typingTestUser');
    
    // Debug logging to help identify issues
    console.log('Header Auth Debug:', {
        currentPath,
        isIndexPage,
        isLoggedIn: !!isLoggedIn,
        preferencesComplete: localStorage.getItem('preferencesComplete')
    });
    
    // Never redirect from login.html, preference.html, or registration pages
    const isAuthPage = currentPath.includes('login.html') || 
                       currentPath.includes('preference.html') ||
                       currentPath.includes('register.html') ||
                       currentPath.includes('forgot-password.html') ||
                       currentPath.includes('reset-password.html');
    
    if (isAuthPage) {
        console.log('On auth page, skipping redirects');
        updateUserDisplay();
        return;
    }
    
    // Only handle redirects for the actual index/home page (not other pages like code-racer.html)
    if (isIndexPage && !isLoggedIn) {
        console.log('Redirecting to login from index page');
        window.location.href = 'login.html';
        return;
    }
    
    // If user is logged in but hasn't visited preferences page, redirect there first
    // BUT only from the index page, not from other pages like code-racer.html
    const preferencesComplete = localStorage.getItem('preferencesComplete');
    if (isIndexPage && isLoggedIn && !preferencesComplete) {
        console.log('Redirecting to preferences from index page');
        window.location.href = 'preference.html';
        return;
    }
    
    // Check if user is logged in
    updateUserDisplay();
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('typingTestUser');
            
            if (isLoggedIn) {
                // If logged in, clicking should log out
                e.preventDefault();
                logoutUser();
            }
            // If not logged in, default link behavior takes user to login page
        });
    }
    
    /**
     * Create user info section dynamically
     */
    function createUserInfoSection(username, userType) {
        // Remove existing user-info if it exists
        const existingUserInfo = document.querySelector('.user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        
        // Create new user info section
        const userInfoDiv = document.createElement('div');
        userInfoDiv.className = 'user-info';
        
        const profilePic = document.createElement('img');
        profilePic.className = 'profile-pic';
        profilePic.alt = 'User Avatar';
        
        // Get user data to check for Google profile picture
        const userData = JSON.parse(localStorage.getItem('typingTestUserData') || '{}');
        
        // Set appropriate profile picture
        if (userType === 'google' && userData.picture) {
            // Use Google profile picture if available
            profilePic.src = userData.picture;
            profilePic.onerror = function() {
                // Fallback to default avatar if Google image fails to load
                this.src = 'assets/avatars/default.svg';
            };
        } else if (userType === 'guest') {
            // Use guest avatar for guests
            profilePic.src = 'assets/avatars/guest.svg';
        } else {
            // Use default avatar for other users
            profilePic.src = 'assets/avatars/default.svg';
        }
        
        // Create tooltip with username on hover
        profilePic.title = username;
        userInfoDiv.title = username;
        
        userInfoDiv.appendChild(profilePic);
        
        // Insert before login button
        if (headerActions && loginBtn) {
            headerActions.insertBefore(userInfoDiv, loginBtn);
        }
        
        return userInfoDiv;
    }
    
    /**
     * Update the header display based on login status
     */
    function updateUserDisplay() {
        const currentUser = localStorage.getItem('typingTestUser');
        const userType = localStorage.getItem('typingTestUserType');
        
        if (currentUser) {
            // User is logged in - create user info section
            createUserInfoSection(currentUser, userType);
            
            // Toggle login/logout buttons
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'block';
            }
            // Show preference button for logged in users
            const prefBtn = document.querySelector('.pref-btn');
            if (prefBtn) {
                prefBtn.style.display = 'block';
            }
        } else {
            // User is not logged in - remove user info section
            const existingUserInfo = document.querySelector('.user-info');
            if (existingUserInfo) {
                existingUserInfo.remove();
            }
            
            if (loginBtn) {
                loginBtn.style.display = 'block';
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
            // Hide preference button for guests
            const prefBtn = document.querySelector('.pref-btn');
            if (prefBtn) {
                prefBtn.style.display = 'none';
            }
        }
    }
    
    /**
     * Logout the current user
     */
    function logoutUser() {
        localStorage.removeItem('typingTestUser');
        localStorage.removeItem('typingTestUserType');
        localStorage.removeItem('typingTestUserEmail');
        localStorage.removeItem('typingTestUserData');
        localStorage.removeItem('preferencesComplete');
        
        // Update the display
        updateUserDisplay();
        
        // Show logout message
        showNotification('You have been logged out successfully');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
    
    /**
     * Get a deterministic avatar index based on username
     * @param {string} username - The username
     * @returns {number} Avatar index (1-10)
     */
    function getAvatarIndex(username) {
        // Simple hash function to get a number from the username
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = ((hash << 5) - hash) + username.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Ensure positive number and get a value between 1 and 10
        const positiveHash = Math.abs(hash);
        return (positiveHash % 10) + 1;
    }
    
    /**
     * Show a notification message
     * @param {string} message - The message to display
     */
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.background = 'rgba(0, 194, 255, 0.9)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            notification.style.zIndex = '9999';
            notification.style.transition = 'all 0.3s ease';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.style.transform = 'translateX(0)';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            // Remove from DOM after animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});