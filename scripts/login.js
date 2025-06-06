// login.js - Key Racer login functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded for Login Page');
    
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form'); 
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerUsername = document.getElementById('register-username');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const registerConfirm = document.getElementById('register-confirm');
    const guestBtn = document.getElementById('guest-btn');
    const forgotLink = document.querySelector('.forgot-link');
    
    // Tab switching functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const tabIndicator = document.querySelector('.tab-indicator');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Setup tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Move the tab indicator
            const tabIndex = Array.from(authTabs).indexOf(tab);
            tabIndicator.style.left = `${tabIndex * 50}%`;
            
            // Show the corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
    
    // Input focus effects
    const inputContainers = document.querySelectorAll('.input-with-icon');
    inputContainers.forEach(container => {
        const input = container.querySelector('input');
        
        input.addEventListener('focus', () => {
            container.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                container.classList.remove('focused');
            }
        });
    });
    
    // Setup event listeners
    setupEventListeners();
    
    function setupEventListeners() {
        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
        
        // Register form submission
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleRegistration();
            });
        }
        
        // Guest login button
        if (guestBtn) {
            guestBtn.addEventListener('click', handleGuestLogin);
        }
        
        // Forgot password link
        if (forgotLink) {
            forgotLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'forgot-password.html';
            });
        }
        
        // Check if user is already logged in
        const currentUser = localStorage.getItem('typingTestUser');
        if (currentUser) {
            // If user is logged in, show them a message and option to continue or logout
            const preferencesComplete = localStorage.getItem('preferencesComplete');
            
            // Create a notification for already logged-in users
            showMessage(`You're already logged in as ${currentUser}. ${!preferencesComplete ? 'Continue to complete your preferences.' : 'Continue to the app.'}`, 'info');
            
            // Add "Continue" and "Logout" buttons to the login form
            addLoggedInOptions(currentUser, preferencesComplete);
        }
        
        // Google sign-in button handler
        const googleBtn = document.querySelector('.social-btn.google');
        if (googleBtn) {
            googleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '/auth/google';
            });
        }
    }
    
    // Login function
    async function handleLogin() {
        try {
            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();
            
            if (!email || !password) {
                showMessage('Please enter both email and password', 'error');
                return;
            }
            
            // Disable the login button
            const submitBtn = loginForm.querySelector('.auth-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Signing in... <i class="fas fa-spinner fa-spin"></i>';
            
            try {
                // In a real app, you would validate with a server
                // Since this is for a demonstration, we'll simulate a successful login
                
                // Extract username from email (before @)
                const username = email.split('@')[0];
                
                // Store user info
                console.log('Login successful for:', username);
                localStorage.setItem('typingTestUser', username);
                localStorage.setItem('typingTestUserEmail', email);
                localStorage.setItem('typingTestUserType', 'registered');
            
            // Show success message briefly before redirecting
            showMessage('Login successful! Redirecting...', 'success');
            
                // Redirect after a short delay
            setTimeout(() => {
                redirectToApp(username);
            }, 800);
            } catch (error) {
                console.error('Login validation error:', error);
                showMessage('Login failed. Please check your credentials and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In <i class="fas fa-sign-in-alt"></i>';
            }
        } catch (error) {
            console.error('Login error:', error);
            const submitBtn = loginForm.querySelector('.auth-btn');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign In <i class="fas fa-sign-in-alt"></i>';
            showMessage('Login failed. Please check your credentials and try again.', 'error');
        }
    }
    
    // Registration function
    async function handleRegistration() {
        try {
            const username = registerUsername.value.trim();
            const email = registerEmail.value.trim();
            const password = registerPassword.value.trim();
            const confirmPassword = registerConfirm.value.trim();
            
            if (!username || !email || !password || !confirmPassword) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (username.length < 3) {
                showMessage('Username must be at least 3 characters long', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Disable the registration button
            const submitBtn = registerForm.querySelector('.auth-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Creating account... <i class="fas fa-spinner fa-spin"></i>';
            
            try {
                // In a real app, you would register with a server
                // Since this is for a demonstration, we'll simulate a successful registration
                
                console.log('Registration successful for:', username);
                localStorage.setItem('typingTestUser', username);
                localStorage.setItem('typingTestUserEmail', email);
                localStorage.setItem('typingTestUserType', 'registered');
                
                // Show success message briefly before redirecting
                showMessage('Account created successfully! Redirecting...', 'success');
                
                // Redirect after a short delay
                    setTimeout(() => {
                    redirectToApp(username);
                }, 800);
            } catch (error) {
                console.error('Registration validation error:', error);
                showMessage('Registration failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account <i class="fas fa-user-plus"></i>';
            }
        } catch (error) {
            console.error('Registration error:', error);
            const submitBtn = registerForm.querySelector('.auth-btn');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Create Account <i class="fas fa-user-plus"></i>';
            showMessage('Registration failed. Please try again.', 'error');
        }
    }
    
    // Guest login function
    function handleGuestLogin() {
        // Create a guest username with timestamp to make it unique
        const timestamp = new Date().getTime();
        const guestUsername = `Guest_${timestamp.toString().slice(-6)}`;
        
        console.log('Guest login successful:', guestUsername);
        localStorage.setItem('typingTestUser', guestUsername);
            localStorage.setItem('typingTestUserType', 'guest');
            
        // Redirect to app
        redirectToApp(guestUsername);
    }
    
    // Message display function
    function showMessage(message, type) {
        // Create message element if it doesn't exist
        let messageElement = document.getElementById('auth-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'auth-message';
            messageElement.style.padding = '10px';
            messageElement.style.margin = '10px 0';
            messageElement.style.borderRadius = '5px';
            messageElement.style.textAlign = 'center';
            document.querySelector('.auth-container').prepend(messageElement);
        }
        
        // Set message content and style
        messageElement.textContent = message;
        
        // Set styling based on message type
        if (type === 'error') {
            messageElement.style.backgroundColor = 'rgba(255, 74, 74, 0.1)';
            messageElement.style.color = '#FF4A4A';
            messageElement.style.border = '1px solid rgba(255, 74, 74, 0.3)';
        } else if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(0, 255, 221, 0.1)';
            messageElement.style.color = '#00FFDD';
            messageElement.style.border = '1px solid rgba(0, 255, 221, 0.3)';
        } else {
            messageElement.style.backgroundColor = 'rgba(0, 194, 255, 0.1)';
            messageElement.style.color = '#00C2FF';
            messageElement.style.border = '1px solid rgba(0, 194, 255, 0.3)';
        }
        
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
    
    // Redirect function
    function redirectToApp(username) {
        // Store user data for the new interface
        const userData = {
            name: username,
            id: 'user_' + Date.now(),
            type: localStorage.getItem('typingTestUserType') || 'guest',
            email: localStorage.getItem('typingTestUserEmail') || ''
        };
        localStorage.setItem('typingTestUserData', JSON.stringify(userData));
        localStorage.setItem('typingTestUser', username); // Ensure this is set for header auth
        
        // Redirect to preference page first
        window.location.href = 'preference.html';
    }

    // Handle already logged-in users
    function addLoggedInOptions(username, preferencesComplete) {
        // Find the login form container
        const authContainer = document.querySelector('.auth-container');
        if (!authContainer) return;

        // Create logged-in user notification
        const loggedInNotification = document.createElement('div');
        loggedInNotification.className = 'logged-in-notification';
        loggedInNotification.style.cssText = `
            background: rgba(0, 255, 221, 0.1);
            border: 2px solid rgba(0, 255, 221, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            color: #00FFDD;
            font-weight: 600;
        `;

        loggedInNotification.innerHTML = `
            <div style="margin-bottom: 15px;">
                <i class="fas fa-user-check" style="font-size: 24px; margin-bottom: 10px;"></i>
                <h3 style="margin: 0; color: #00FFDD;">Already Logged In</h3>
                <p style="margin: 10px 0; color: rgba(255,255,255,0.8);">Welcome back, ${username}!</p>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button id="continueAppBtn" style="
                    background: linear-gradient(90deg, #00FFDD 0%, #00C2FF 100%);
                    color: #111827;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-arrow-right"></i> ${preferencesComplete ? 'Continue to App' : 'Complete Setup'}
                </button>
                <button id="logoutBtn" style="
                    background: transparent;
                    color: #ff4444;
                    border: 2px solid #ff4444;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;

        // Insert the notification at the top of the auth container
        authContainer.insertBefore(loggedInNotification, authContainer.firstChild);

        // Add event listeners
        document.getElementById('continueAppBtn').addEventListener('click', function() {
            if (preferencesComplete) {
                window.location.href = 'code-racer.html';
            } else {
                redirectToApp(username);
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', function() {
            // Clear all user data
            localStorage.removeItem('typingTestUser');
            localStorage.removeItem('typingTestUserType');
            localStorage.removeItem('typingTestUserEmail');
            localStorage.removeItem('typingTestUserData');
            localStorage.removeItem('preferencesComplete');
            
            // Reload the page to show normal login form
            window.location.reload();
        });

        // Hide the regular login forms since user is already logged in
        const authForms = document.querySelector('.auth-forms');
        if (authForms) {
            authForms.style.display = 'none';
        }

        const authTabs = document.querySelector('.auth-tabs');
        if (authTabs) {
            authTabs.style.display = 'none';
        }
    }

    // Set the current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});