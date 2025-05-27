/**
 * Key Racer Preloader
 * Common preloader functionality for all pages
 */

// Preloader handling - executed as early as possible
(function() {
    // Set no-js class if JavaScript is enabled
    document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
    
    // Try to hide preloader immediately
    hidePreloader();
    
    // Multiple triggers to ensure preloader is hidden
    document.addEventListener('DOMContentLoaded', function() {
        hidePreloader();
        // Initialize components with a slight delay to ensure UI is responsive
        setTimeout(initComponents, 50);
    });
    
    // Also hide on window load
    window.addEventListener('load', hidePreloader);
    
    // Fallback timeout
    setTimeout(hidePreloader, 2000);
    
    /**
     * Hide the preloader
     */
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('preloader-hidden')) {
            preloader.classList.add('preloader-hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                    console.log('Preloader removed');
                }
            }, 300);
        }
    }
    
    /**
     * Initialize components after preloader is hidden
     */
    function initComponents() {
        console.log('Key Racer components initializing');
        
        // Initialize database if available
        if (typeof window.initDatabase === 'function') {
            window.initDatabase();
        } else if (!window.typingDB) {
            // Create fallback database functionality if needed
            try {
                console.log('Initializing database...');
                window.typingDB = new TypingDatabase();
                
                // Verify database initialization with a timeout
                verifyDatabaseInitialization();
            } catch (error) {
                console.error('Error initializing database:', error);
                createFallbackDatabase();
                
                // Show a small notification to user
                showDatabaseFailureNotification();
            }
        }
        
        // Add "loaded" class to body
        document.body.classList.add('page-loaded');
    }
    
    /**
     * Verify that database initialized correctly
     */
    function verifyDatabaseInitialization() {
        let attempts = 0;
        const maxAttempts = 3;
        
        function checkDB() {
            if (window.typingDB && window.typingDB.initSuccess) {
                console.log('Database verified as initialized successfully');
                return true;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
                console.error('Database failed to initialize after multiple attempts');
                createFallbackDatabase();
                showDatabaseFailureNotification();
                return false;
            }
            
            console.log(`Waiting for database... attempt ${attempts}/${maxAttempts}`);
            setTimeout(checkDB, 1000);
        }
        
        setTimeout(checkDB, 1000);
    }
    
    /**
     * Show a notification when database fails
     */
    function showDatabaseFailureNotification() {
        // Only show if not already shown
        if (document.getElementById('db-error-notification')) return;
        
        const notification = document.createElement('div');
        notification.id = 'db-error-notification';
        notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background:rgba(255,74,74,0.9);color:white;padding:10px 15px;border-radius:5px;font-size:14px;z-index:9999;max-width:300px;box-shadow:0 5px 15px rgba(0,0,0,0.3);';
        notification.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
                <strong>Offline Mode Active</strong>
                <span style="cursor:pointer;padding:3px;" onclick="this.parentNode.parentNode.remove()">✕</span>
            </div>
            <p style="margin:0;font-size:12px;">Your progress will be saved locally. Connect to the internet to sync your data.</p>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }
    
    /**
     * Create fallback database functionality
     */
    function createFallbackDatabase() {
        window.typingDB = {
            initSuccess: false,
            isOffline: true,
            loginUser: (username, password) => {
                console.log('Using fallback login for:', username);
                return Promise.resolve({ username });
            },
            getTypingRecords: () => {
                console.log('Using fallback getTypingRecords');
                // Try to get from localStorage
                const records = localStorage.getItem('typingRecords');
                return Promise.resolve(records ? JSON.parse(records) : []);
            },
            saveTypingRecord: (record) => {
                console.log('Using fallback saveTypingRecord');
                // Save to localStorage
                let records = localStorage.getItem('typingRecords');
                records = records ? JSON.parse(records) : [];
                records.push({...record, id: Date.now()}); // Add a fake ID
                localStorage.setItem('typingRecords', JSON.stringify(records));
                return Promise.resolve(Date.now()); // Return a fake ID
            },
            saveUserProgress: (username, progressData) => {
                console.log('Using fallback progress save for:', username);
                localStorage.setItem('lessonProgress', JSON.stringify(progressData));
                return Promise.resolve(true);
            },
            getUserProgress: (username) => {
                console.log('Using fallback progress retrieval for:', username);
                const data = localStorage.getItem('lessonProgress');
                return Promise.resolve(data ? JSON.parse(data) : {});
            }
        };
    }
})(); 