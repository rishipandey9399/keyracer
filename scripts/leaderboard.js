// Leaderboard functionality
class LeaderboardManager {
    constructor() {
        this.db = window.typingDB;
        this.currentTab = 'wpm'; // Default tab
        this.currentDifficulty = 'all'; // Default difficulty filter
        this.currentTimePeriod = 'all-time'; // Default time period

        // Elements
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.difficultyButtons = document.querySelectorAll('.difficulty-button');
        this.timeButtons = document.querySelectorAll('.time-button');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load initial data
        this.loadLeaderboardData();
    }

    // Initialize event listeners
    initEventListeners() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentTab = button.getAttribute('data-tab');
                this.loadLeaderboardData();
            });
        });

        // Difficulty filter
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentDifficulty = button.getAttribute('data-difficulty');
                this.loadLeaderboardData();
            });
        });

        // Time period filter
        this.timeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentTimePeriod = button.getAttribute('data-time');
                this.loadLeaderboardData();
            });
        });
    }

    // Load leaderboard data based on current filters
    async loadLeaderboardData() {
        try {
            // Ensure database is ready
            await this.db.ensureDbReady();
            
            // Map our UI filter terms to database terms
            const timeRangeMap = {
                'daily': 'day',
                'weekly': 'week',
                'monthly': 'month',
                'all-time': null
            };
            
            // Get data from database with appropriate filters
            const data = await this.db.getLeaderboardData({
                sortBy: this.currentTab,
                difficulty: this.currentDifficulty === 'all' ? null : this.currentDifficulty,
                limit: 10,
                timeRange: timeRangeMap[this.currentTimePeriod]
            });
            
            // Update the appropriate table
            this.updateTable(data);
            
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            this.showError('Failed to load leaderboard data: ' + error.message);
        }
    }

    // Update the table with filtered data
    updateTable(data) {
        const tableId = `${this.currentTab}-tab`;
        const tableElement = document.getElementById(tableId);
        if (!tableElement) {
            console.error(`Table element not found: ${tableId}`);
            return;
        }
        
        const tbody = tableElement.querySelector('tbody');
        if (!tbody) {
            console.error(`Table body not found in ${tableId}`);
            return;
        }
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Check if we have data
        if (data.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 20px;">
                    No records found for the selected filters.
                </td>
            `;
            tbody.appendChild(noDataRow);
            return;
        }
        
        // Add rows based on the current tab
        data.forEach((record, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            
            switch (this.currentTab) {
                case 'wpm':
                    row.innerHTML = `
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="username">${this.formatUsername(record.username, rank)}</td>
                        <td class="highlight">${Math.round(record.wpm)}</td>
                        <td>${Math.round(record.accuracy * 100)}%</td>
                        <td>${this.capitalizeFirst(record.difficulty || 'Standard')}</td>
                        <td>${this.formatDate(record.timestamp)}</td>
                    `;
                    break;
                    
                case 'accuracy':
                    row.innerHTML = `
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="username">${this.formatUsername(record.username, rank)}</td>
                        <td class="highlight">${Math.round(record.accuracy * 100)}%</td>
                        <td>${Math.round(record.wpm)}</td>
                        <td>${this.capitalizeFirst(record.difficulty || 'Standard')}</td>
                        <td>${this.formatDate(record.timestamp)}</td>
                    `;
                    break;
                    
                case 'time':
                    row.innerHTML = `
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="username">${this.formatUsername(record.username, rank)}</td>
                        <td class="highlight">${this.formatTime(record.completionTime)}</td>
                        <td>${Math.round(record.wpm)}</td>
                        <td>${Math.round(record.accuracy * 100)}%</td>
                        <td>${this.capitalizeFirst(record.difficulty || 'Standard')}</td>
                    `;
                    break;
            }
            
            tbody.appendChild(row);
        });
    }

    // Helper: Format username (add badge for top users)
    formatUsername(username, rank) {
        let badge = '';
        
        // Add badges for top ranks
        if (rank === 1) {
            if (this.currentTab === 'wpm') badge = '<span class="badge">Champion</span>';
            else if (this.currentTab === 'accuracy') badge = '<span class="badge">Precision</span>';
            else if (this.currentTab === 'time') badge = '<span class="badge">Speedster</span>';
        }
        
        return `${username} ${badge}`;
    }

    // Helper: Format date
    formatDate(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Helper: Format time in seconds
    formatTime(seconds) {
        if (!seconds) return 'Unknown';
        return `${seconds.toFixed(1)}s`;
    }

    // Helper: Capitalize first letter
    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Helper: Show error message
    showError(message) {
        console.error(message);
        
        // Create error alert
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'color: white; background-color: #ff4444; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center;';
        errorDiv.textContent = message;
        
        // Find a place to show the error
        const container = document.querySelector('.leaderboard-container');
        if (container) {
            // Insert after the header
            const header = container.querySelector('.leaderboard-header');
            if (header) {
                container.insertBefore(errorDiv, header.nextSibling);
            } else {
                container.prepend(errorDiv);
            }
        }
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.5s';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
}

// Create a demo data generator for testing
class DemoDataGenerator {
    constructor(db) {
        this.db = db;
        this.demoUsernames = [
            'Rishi Pandey', 'Etisha Pandey', 'SpeedyFingers', 'TypeMaster42',
            'KeyboardWarrior', 'RacingTypist', 'SwiftKeys', 'FlashFingers',
            'TypeRacer99', 'KeyMaster', 'PreciseTyper', 'AccuracyKing',
            'TypePerfect', 'FlawlessTypist', 'ZeroErrors', 'SpeedRacer',
            'LightningFingers', 'FastFingers', 'SpeedyGonzales', 'QuickTyper'
        ];
        this.difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    }

    // Generate random typing record
    generateRecord(username) {
        // Random values with realistic ranges
        const wpm = 60 + Math.floor(Math.random() * 70); // 60-130 WPM
        const accuracy = 0.90 + (Math.random() * 0.10); // 90-100% accuracy
        const difficulty = this.difficulties[Math.floor(Math.random() * this.difficulties.length)];
        
        // Random date in the last 30 days
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        
        // Completion time (roughly calculated from WPM)
        // Assuming a standard text of 250 characters
        const charsPerMin = wpm * 5; // Avg 5 chars per word
        const minutes = 250 / charsPerMin;
        const completionTime = minutes * 60; // in seconds
        
        return {
            username,
            wpm,
            accuracy,
            difficulty,
            completionTime,
            timestamp: timestamp.toISOString(),
            textLength: 250,
            mode: 'standard'
        };
    }

    // Generate and save demo data
    async generateDemoData() {
        try {
            // First ensure the database is ready
            await this.db.ensureDbReady();
            
            console.log('Generating demo data for leaderboard...');
            
            // For each demo user, create 1-3 records
            for (const username of this.demoUsernames) {
                // Register the user if they don't exist
                try {
                    await this.db.registerUser(username, 'demo_password');
                } catch (e) {
                    // User may already exist, ignore error
                }
                
                // Create 1-3 records per user
                const recordCount = 1 + Math.floor(Math.random() * 3);
                
                for (let i = 0; i < recordCount; i++) {
                    const record = this.generateRecord(username);
                    await this.db.saveTypingRecord(record);
                }
            }
            
            console.log('Demo data generation complete!');
            return true;
        } catch (error) {
            console.error('Error generating demo data:', error);
            return false;
        }
    }
}

// Initialize the leaderboard when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Create leaderboard manager
    const leaderboard = new LeaderboardManager();
    
    // For testing/demo purposes: generate sample data if needed
    if (await checkForExistingData()) {
        console.log('Using existing leaderboard data');
    } else {
        console.log('No leaderboard data found, generating demo data...');
        const demoGenerator = new DemoDataGenerator(window.typingDB);
        await demoGenerator.generateDemoData();
        // Reload data after generation
        leaderboard.loadLeaderboardData();
    }
    
    // Helper function to check if we have existing records
    async function checkForExistingData() {
        try {
            await window.typingDB.ensureDbReady();
            const records = await window.typingDB.getTypingRecords();
            return records && records.length > 0;
        } catch (error) {
            console.error('Error checking for existing data:', error);
            return false;
        }
    }
}); 