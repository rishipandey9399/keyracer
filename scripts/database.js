// Database functionality
class TypingDatabase {
    constructor() {
        this.dbName = 'TypingSpeedDB';
        this.dbVersion = 1;
        this.db = null;
        this.initSuccess = false;
        this.useLocalStorage = false;
        
        try {
            console.log('TypingDatabase constructor called');
            this.initialized = this.initDB();
            
            // Set a timeout to check if database initialized successfully
            setTimeout(() => {
                if (!this.initSuccess) {
                    console.warn('Database initialization taking longer than expected. This might indicate an issue.');
                }
            }, 3000);
        } catch (error) {
            console.error('Error in database constructor:', error);
            this.initSuccess = false;
            
            // Show a visible error message
            const errorMsg = 'Database error: ' + (error.message || 'Unknown error');
            const errorElem = document.createElement('div');
            errorElem.style.cssText = 'position:fixed;top:60px;left:10px;right:10px;background:#ff4b4b;color:white;padding:10px;border-radius:5px;z-index:9999;text-align:center;box-shadow:0 3px 6px rgba(0,0,0,0.2);';
            errorElem.innerHTML = errorMsg;
            document.body.appendChild(errorElem);
            
            // Remove after 8 seconds
            setTimeout(() => errorElem.remove(), 8000);
        }
    }

    // Initialize the database
    async initDB() {
        console.log('Initializing database...');
        return new Promise((resolve, reject) => {
            // Check if IndexedDB is available
            if (!window.indexedDB) {
                console.warn('IndexedDB is not supported, falling back to localStorage');
                this.useLocalStorage = true;
                this.initSuccess = true;
                resolve(true);
                return;
            }
            
            try {
                const request = indexedDB.open(this.dbName, this.dbVersion);
                
                request.onerror = (event) => {
                    const errorMsg = 'Database error: ' + (event.target.error ? event.target.error.message : 'Unknown error');
                    console.error(errorMsg, event);
                    document.body.innerHTML += `<div style="color:red;padding:20px;background:#ffeeee;position:fixed;top:0;left:0;right:0;z-index:9999;">${errorMsg}</div>`;
                    reject(errorMsg);
                };
                
                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    this.initSuccess = true;
                    console.log('Database initialized successfully');
                    resolve(true);
                    
                    // Add event listener for errors
                    this.db.onerror = (event) => {
                        console.error('Database error:', event.target.error);
                    };
                };
                
                request.onupgradeneeded = (event) => {
                    console.log('Database upgrade needed, creating object stores');
                    const db = event.target.result;
                    
                    // Create users store
                    if (!db.objectStoreNames.contains('users')) {
                        const usersStore = db.createObjectStore('users', { keyPath: 'username' });
                        usersStore.createIndex('username', 'username', { unique: true });
                    }
                    
                    // Create typing records store
                    if (!db.objectStoreNames.contains('typingRecords')) {
                        const recordsStore = db.createObjectStore('typingRecords', { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        recordsStore.createIndex('username', 'username', { unique: false });
                        recordsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                    
                    console.log('Database schema created successfully');
                };
            } catch (error) {
                const errorMsg = 'Error initializing database: ' + (error.message || error);
                console.error(errorMsg, error);
                document.body.innerHTML += `<div style="color:red;padding:20px;background:#ffeeee;position:fixed;top:0;left:0;right:0;z-index:9999;">${errorMsg}</div>`;
                reject(errorMsg);
            }
        });
    }

    // Check if the database is ready
    async ensureDbReady() {
        if (this.initSuccess && this.db) {
            return true;
        }
        
        try {
            await this.initialized;
            return true;
        } catch (error) {
            console.error('Database not ready:', error);
            throw new Error('Database is not ready: ' + error);
        }
    }

    // User-related methods
    async registerUser(username, password, email = '') {
        try {
            await this.ensureDbReady();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['users'], 'readwrite');
                const store = transaction.objectStore('users');
                
                // Check if user already exists
                const getRequest = store.get(username);
                
                getRequest.onsuccess = (event) => {
                    if (event.target.result) {
                        reject('Username already exists');
                    } else {
                        // Add new user
                        const addRequest = store.add({
                            username: username,
                            password: password, // In a real app, this should be hashed
                            email: email,
                            created: new Date().toISOString()
                        });
                        
                        addRequest.onsuccess = () => resolve(true);
                        addRequest.onerror = (e) => reject('Error creating user: ' + e.target.error.message);
                    }
                };
                
                getRequest.onerror = (e) => reject('Error checking username: ' + e.target.error.message);
            });
        } catch (error) {
            console.error('Register user error:', error);
            throw error;
        }
    }

    async loginUser(username, password) {
        try {
            await this.ensureDbReady();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['users'], 'readonly');
                const store = transaction.objectStore('users');
                const request = store.get(username);
                
                request.onsuccess = (event) => {
                    const user = event.target.result;
                    if (user && user.password === password) {
                        resolve(user);
                    } else {
                        reject('Invalid username or password');
                    }
                };
                
                request.onerror = (e) => reject('Error during login: ' + e.target.error.message);
            });
        } catch (error) {
            console.error('Login user error:', error);
            throw error;
        }
    }

    // Typing records methods
    async saveTypingRecord(record) {
        try {
            if (this.useLocalStorage) {
                const records = JSON.parse(localStorage.getItem('typingRecords') || '[]');
                record.id = Date.now(); // Generate unique ID
                records.push(record);
                localStorage.setItem('typingRecords', JSON.stringify(records));
                return record.id;
            }
            
            await this.ensureDbReady();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['typingRecords'], 'readwrite');
                const store = transaction.objectStore('typingRecords');
                
                // Add timestamp if not provided
                if (!record.timestamp) {
                    record.timestamp = new Date().toISOString();
                }
                
                const request = store.add(record);
                
                request.onsuccess = (event) => {
                    resolve(event.target.result); // Returns the ID of the new record
                };
                
                request.onerror = (e) => reject('Error saving typing record: ' + e.target.error.message);
            });
        } catch (error) {
            console.error('Save typing record error:', error);
            throw error;
        }
    }

    async getTypingRecords(username) {
        try {
            if (this.useLocalStorage) {
                const records = JSON.parse(localStorage.getItem('typingRecords') || '[]');
                return records.filter(record => record.username === username);
            }
            
            await this.ensureDbReady();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['typingRecords'], 'readonly');
                const store = transaction.objectStore('typingRecords');
                const index = store.index('username');
                
                let records = [];
                
                // Get all records for the user
                const request = username 
                    ? index.openCursor(IDBKeyRange.only(username))
                    : store.openCursor();
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        records.push(cursor.value);
                        cursor.continue();
                    } else {
                        // Sort by timestamp (newest first)
                        records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        resolve(records);
                    }
                };
                
                request.onerror = (e) => reject('Error retrieving typing records: ' + e.target.error.message);
            });
        } catch (error) {
            console.error('Get typing records error:', error);
            throw error;
        }
    }

    // Get the last record for comparison
    async getLastRecord(username) {
        try {
            const records = await this.getTypingRecords(username);
            return records.length > 0 ? records[0] : null;
        } catch (error) {
            console.error('Get last record error:', error);
            throw error;
        }
    }
    
    // Get leaderboard data with sorting and filtering
    async getLeaderboardData(options = {}) {
        try {
            await this.ensureDbReady();
            
            const {
                sortBy = 'wpm', // 'wpm', 'accuracy', or 'completionTime'
                difficulty = null,
                limit = 10,
                timeRange = null // 'day', 'week', 'month' or null for all time
            } = options;
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['typingRecords'], 'readonly');
                const store = transaction.objectStore('typingRecords');
                
                let records = [];
                let userBestScores = new Map(); // Track best score per user
                
                // Get all records
                const request = store.openCursor();
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const record = cursor.value;
                        
                        // Skip records without a username (anonymous/guest users)
                        // Only include records from authenticated users
                        if (!record.username || record.username === 'Guest') {
                            cursor.continue();
                            return;
                        }
                        
                        // Apply difficulty filter if specified
                        if (difficulty && record.difficulty !== difficulty) {
                            cursor.continue();
                            return;
                        }
                        
                        // Apply time range filter if specified
                        if (timeRange) {
                            const recordDate = new Date(record.timestamp);
                            const now = new Date();
                            
                            let cutoffDate;
                            if (timeRange === 'day') {
                                cutoffDate = new Date(now.setDate(now.getDate() - 1));
                            } else if (timeRange === 'week') {
                                cutoffDate = new Date(now.setDate(now.getDate() - 7));
                            } else if (timeRange === 'month') {
                                cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
                            }
                            
                            if (recordDate < cutoffDate) {
                                cursor.continue();
                                return;
                            }
                        }
                        
                        // Ensure record has all required fields with valid values
                        const validatedRecord = {
                            ...record,
                            // Ensure WPM is a number
                            wpm: typeof record.wpm === 'number' ? record.wpm : 0,
                            // Ensure accuracy is between 0-1 (convert if it's already a percentage)
                            accuracy: typeof record.accuracy === 'number' ? 
                                (record.accuracy > 1 ? record.accuracy / 100 : record.accuracy) : 0,
                            // Ensure completionTime is a number
                            completionTime: typeof record.completionTime === 'number' ? record.completionTime : 0,
                            // Ensure timestamp exists
                            timestamp: record.timestamp || new Date().toISOString()
                        };
                        
                        // Get the metric we're sorting by
                        const metricValue = sortBy === 'wpm' ? validatedRecord.wpm : 
                                          sortBy === 'accuracy' ? validatedRecord.accuracy : 
                                          validatedRecord.completionTime;
                        
                        // For each user, only keep their best score
                        const username = validatedRecord.username;
                        
                        if (!userBestScores.has(username)) {
                            userBestScores.set(username, {
                                record: validatedRecord,
                                value: metricValue
                            });
                        } else {
                            const currentBest = userBestScores.get(username);
                            
                            // For WPM and accuracy, higher is better
                            // For time, lower is better
                            const isNewRecordBetter = sortBy === 'time' ? 
                                metricValue < currentBest.value : 
                                metricValue > currentBest.value;
                                
                            if (isNewRecordBetter) {
                                userBestScores.set(username, {
                                    record: validatedRecord,
                                    value: metricValue
                                });
                            }
                        }
                        
                        cursor.continue();
                    } else {
                        // Extract just the records from the Map
                        records = Array.from(userBestScores.values()).map(item => item.record);
                        
                        // Sort records based on the specified field
                        switch (sortBy) {
                            case 'wpm':
                                records.sort((a, b) => b.wpm - a.wpm);
                                break;
                            case 'accuracy':
                                records.sort((a, b) => b.accuracy - a.accuracy);
                                break;
                            case 'time':
                                // For time, lower is better
                                records.sort((a, b) => a.completionTime - b.completionTime);
                                break;
                            default:
                                records.sort((a, b) => b.wpm - a.wpm);
                        }
                        
                        // Apply limit
                        if (limit > 0) {
                            records = records.slice(0, limit);
                        }
                        
                        // Log the data being sent to the leaderboard
                        console.log('Leaderboard data:', {
                            sortBy,
                            difficulty,
                            timeRange,
                            recordCount: records.length,
                            records: records.slice(0, 3) // Log just the first 3 for brevity
                        });
                        
                        resolve(records);
                    }
                };
                
                request.onerror = (e) => {
                    reject('Error retrieving leaderboard data: ' + e.target.error.message);
                };
            });
        } catch (error) {
            console.error('Get leaderboard data error:', error);
            throw error;
        }
    }

    /**
     * Save user progress for lessons
     * @param {string} username - The username
     * @param {object} progressData - The progress data to save
     * @returns {Promise<boolean>} - Whether save was successful
     */
    async saveUserProgress(username, progressData) {
        try {
            await this.ensureDbReady();
            
            const transaction = this.db.transaction(['users'], 'readwrite');
            const userStore = transaction.objectStore('users');
            
            // Get the user record
            const getUserRequest = userStore.get(username);
            
            return new Promise((resolve, reject) => {
                getUserRequest.onerror = (event) => {
                    console.error('Error getting user for progress update:', event.target.error);
                    reject(event.target.error);
                };
                
                getUserRequest.onsuccess = (event) => {
                    const userData = event.target.result;
                    
                    if (userData) {
                        // Update user progress
                        userData.lessonProgress = progressData;
                        
                        // Save the updated user data
                        const updateRequest = userStore.put(userData);
                        
                        updateRequest.onerror = (event) => {
                            console.error('Error updating user progress:', event.target.error);
                            reject(event.target.error);
                        };
                        
                        updateRequest.onsuccess = () => {
                            console.log('User progress saved successfully');
                            resolve(true);
                        };
                    } else {
                        reject(new Error('User not found'));
                    }
                };
            });
        } catch (error) {
            console.error('Error saving user progress:', error);
            return false;
        }
    }

    /**
     * Get user progress for lessons
     * @param {string} username - The username
     * @returns {Promise<object>} - The user's progress data
     */
    async getUserProgress(username) {
        try {
            await this.ensureDbReady();
            
            const transaction = this.db.transaction(['users'], 'readonly');
            const userStore = transaction.objectStore('users');
            
            // Get the user record
            const getUserRequest = userStore.get(username);
            
            return new Promise((resolve, reject) => {
                getUserRequest.onerror = (event) => {
                    console.error('Error getting user progress:', event.target.error);
                    reject(event.target.error);
                };
                
                getUserRequest.onsuccess = (event) => {
                    const userData = event.target.result;
                    
                    if (userData && userData.lessonProgress) {
                        resolve(userData.lessonProgress);
                    } else {
                        // Return empty object if no progress data found
                        resolve({});
                    }
                };
            });
        } catch (error) {
            console.error('Error retrieving user progress:', error);
            return {};
        }
    }
}

// Create a global instance of the database
try {
    window.typingDB = new TypingDatabase();
    console.log('Database instance created:', window.typingDB ? 'Success' : 'Failed');
    
    // Add a global function to check database status
    window.checkDBStatus = function() {
        if (window.typingDB && window.typingDB.initSuccess) {
            console.log('Database is ready and initialized');
            return true;
        } else {
            console.warn('Database is not ready yet or failed to initialize');
            return false;
        }
    };
    
    // Expose a test function
    window.testDB = async function() {
        try {
            if (!window.typingDB) {
                throw new Error('Database instance not found');
            }
            
            // Try to register a test user
            await window.typingDB.registerUser('test_user', 'test_password');
            console.log('Test user registered successfully');
            
            // Try to login with test user
            const user = await window.typingDB.loginUser('test_user', 'test_password');
            console.log('Test login successful', user);
            
            return 'Database test successful';
        } catch (error) {
            console.error('Database test failed:', error);
            return 'Database test failed: ' + error;
        }
    };
} catch (error) {
    console.error('Failed to create database instance:', error);
}
