/**
 * Key Racer - Header Authentication
 * Manages the user authentication status in the header
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const userInfoContainer = document.querySelector('.user-info');
    const userProfilePic = document.querySelector('.profile-pic');
    const userName = document.querySelector('.user-name');
    const loginBtn = document.querySelector('#loginBtn');
    const logoutBtn = document.querySelector('#logoutBtn');
    
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
     * Update the header display based on login status
     */
    function updateUserDisplay() {
        const currentUser = localStorage.getItem('typingTestUser');
        const userType = localStorage.getItem('typingTestUserType');
        
        if (currentUser) {
            // User is logged in
            if (userName) {
                userName.textContent = currentUser;
            }
            
            // Set appropriate profile picture
            if (userProfilePic) {
                // Check if it's a guest user
                if (userType === 'guest') {
                    userProfilePic.src = 'assets/avatars/guest.svg';
                } else {
                    // Use a deterministic avatar based on username
                    const avatarIndex = getAvatarIndex(currentUser);
                    userProfilePic.src = `assets/avatars/avatar${avatarIndex}.png`;
                }
            }
            
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
            // User is not logged in
            if (userName) {
                userName.textContent = 'Guest Racer';
            }
            
            if (userProfilePic) {
                userProfilePic.src = 'assets/avatars/default.svg';
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
        
        // Update the display
        updateUserDisplay();
        
        // Show logout message
        showNotification('You have been logged out successfully');
        
        // Reload the page after a short delay
        setTimeout(() => {
            window.location.reload();
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