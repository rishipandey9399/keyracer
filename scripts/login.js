document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded for Login Page');
    
    // DOM Elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const guestBtn = document.getElementById('guest-btn');
    const loginMessage = document.getElementById('login-message');
    
    // Check if all elements are found
    if (!usernameInput || !passwordInput || !loginBtn || !registerBtn || !guestBtn || !loginMessage) {
        console.error('Some DOM elements not found on login page');
        alert('There was an error loading the page. Please refresh and try again.');
        return;
    }
    
    // Check if database is available
    let dbCheckAttempts = 0;
    const maxDbCheckAttempts = 5;
    
    function checkDatabase() {
        if (window.typingDB) {
            console.log('Database found, proceeding with initialization');
            setupEventListeners();
            return true;
        } else {
            dbCheckAttempts++;
            if (dbCheckAttempts >= maxDbCheckAttempts) {
                console.error('Database not initialized after multiple attempts');
                showMessage('Database not available. Please refresh the page and try again.', 'error');
                // Enable guest mode even if DB fails
                guestBtn.addEventListener('click', handleGuestLogin);
                return false;
            }
            
            console.warn(`Database not found, attempt ${dbCheckAttempts}/${maxDbCheckAttempts}`);
            showMessage('Connecting to database...', 'info');
            setTimeout(checkDatabase, 1000);
            return false;
        }
    }
    
    // Initial DB check with a slight delay to ensure scripts are loaded
    setTimeout(checkDatabase, 500);
    
    function setupEventListeners() {
        // Event Listeners
        loginBtn.addEventListener('click', handleLogin);
        registerBtn.addEventListener('click', handleRegister);
        guestBtn.addEventListener('click', handleGuestLogin);
        
        // Also add keyboard event listeners for better UX
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
        
        // Check if user is already logged in
        const currentUser = localStorage.getItem('typingTestUser');
        if (currentUser) {
            redirectToApp(currentUser);
        }
    }
    
    // Login function
    async function handleLogin() {
        try {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username || !password) {
                showMessage('Please enter both username and password', 'error');
                return;
            }
            
            // Disable the login button to prevent multiple submissions
            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';
            
            showMessage('Logging in...', 'info');
            
            if (!window.typingDB) {
                throw new Error('Database is not available. Please refresh and try again.');
            }
            
            console.log('Attempting to login user:', username);
            const user = await window.typingDB.loginUser(username, password);
            console.log('Login successful:', username);
            
            // Show success message briefly before redirecting
            showMessage('Login successful! Redirecting...', 'success');
            
            localStorage.setItem('typingTestUser', username);
            localStorage.setItem('typingTestUserType', 'registered');
            
            // Short delay for the success message to be seen
            setTimeout(() => {
                redirectToApp(username);
            }, 800);
        } catch (error) {
            console.error('Login error:', error);
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
            showMessage(typeof error === 'string' ? error : 'Login failed. Please check your credentials and try again.', 'error');
        }
    }
    
    // Register function
    async function handleRegister() {
        try {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username || !password) {
                showMessage('Please enter both username and password', 'error');
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
            
            // Disable the register button to prevent multiple submissions
            registerBtn.disabled = true;
            registerBtn.textContent = 'Creating account...';
            
            showMessage('Creating account...', 'info');
            
            if (!window.typingDB) {
                throw new Error('Database is not available. Please refresh and try again.');
            }
            
            console.log('Attempting to register user:', username);
            await window.typingDB.registerUser(username, password);
            console.log('Registration successful:', username);
            
            showMessage('Account created successfully! Logging you in...', 'success');
            
            // Auto-login after registration
            setTimeout(() => {
                localStorage.setItem('typingTestUser', username);
                localStorage.setItem('typingTestUserType', 'registered');
                redirectToApp(username);
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
            showMessage(typeof error === 'string' ? error : 'Registration failed. Please try a different username.', 'error');
        }
    }
    
    // Guest login function
    function handleGuestLogin() {
        try {
            // Generate a unique guest ID
            const guestId = 'guest_' + Date.now();
            localStorage.setItem('typingTestUser', guestId);
            localStorage.setItem('typingTestUserType', 'guest');
            
            showMessage('Continuing as guest...', 'info');
            
            // Add a slight delay to show the message
            setTimeout(() => {
                redirectToApp(guestId);
            }, 500);
        } catch (error) {
            console.error('Guest login error:', error);
            showMessage('Failed to continue as guest. Please try again.', 'error');
        }
    }
    
    // Helper functions
    function showMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = 'message ' + type;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (loginMessage.textContent === message) {
                    loginMessage.className = 'message';
                }
            }, 5000);
        }
    }
    
    function redirectToApp(username) {
        console.log('Redirecting to app with username:', username);
        // Set a flag to show race intro animation on the main page
        localStorage.setItem('showRaceIntro', 'true');
        // Use a small delay to ensure localStorage is updated
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    }

    console.log('Login page initialization complete');
});
