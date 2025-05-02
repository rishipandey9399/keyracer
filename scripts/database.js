// Database functionality
class TypingDatabase {
    constructor() {
        this.dbName = 'TypingSpeedDB';
        this.dbVersion = 1;
        this.db = null;
        this.initSuccess = false;
        this.initialized = this.initDB();
        
        console.log('TypingDatabase constructor called');
        
        // Set a timeout to check if database initialized successfully
        setTimeout(() => {
            if (!this.initSuccess) {
                console.warn('Database initialization taking longer than expected. This might indicate an issue.');
            }
        }, 3000);
    }

    // Initialize the database
    async initDB() {
        console.log('Initializing database...');
        return new Promise((resolve, reject) => {
            // Check if IndexedDB is available
            if (!window.indexedDB) {
                console.error('IndexedDB is not supported in this browser');
                document.body.innerHTML += '<div style="color:red;padding:20px;background:#ffeeee;position:fixed;top:0;left:0;right:0;z-index:9999;">Database error: Your browser does not support IndexedDB</div>';
                reject('Your browser does not support the necessary storage features.');
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
    async registerUser(username, password) {
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
