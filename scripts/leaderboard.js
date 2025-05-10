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
                // Update active class
                this.tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update current tab
                this.currentTab = button.getAttribute('data-tab');
                
                // Update tab content visibility
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${this.currentTab}-tab`).classList.add('active');
                
                // Load data with the new filter
                this.loadLeaderboardData();
            });
        });

        // Difficulty filter
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active class
                this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update current difficulty
                this.currentDifficulty = button.getAttribute('data-difficulty');
                
                // Load data with the new filter
                this.loadLeaderboardData();
            });
        });

        // Time period filter
        this.timeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active class
                this.timeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update current time period
                this.currentTimePeriod = button.getAttribute('data-time');
                
                // Load data with the new filter
                this.loadLeaderboardData();
            });
        });
    }

    // Load leaderboard data based on current filters
    async loadLeaderboardData() {
        try {
            // Show loading state
            this.showLoadingState();
            
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

    // Show loading state in the current tab
    showLoadingState() {
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
        
        // Show loading message
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    <div class="loading-spinner"></div>
                    <div style="margin-top: 10px;">Loading leaderboard data...</div>
                </td>
            </tr>
        `;
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
        
        // Add sorting functionality to table headers
        this.addSortingToTableHeaders(tableElement, data);
    }
    
    // Add sorting functionality to table headers
    addSortingToTableHeaders(tableElement, data) {
        const headers = tableElement.querySelectorAll('thead th');
        const tbody = tableElement.querySelector('tbody');
        const self = this;
        
        // Remove any existing event listeners by cloning and replacing headers
        headers.forEach((header, index) => {
            // Skip the rank column (index 0)
            if (index === 0) return;
            
            const newHeader = header.cloneNode(true);
            
            // Add sort indicator and cursor style
            newHeader.style.cursor = 'pointer';
            newHeader.title = 'Click to sort';
            
            // If it doesn't already have the sort icon, add it
            if (!newHeader.innerHTML.includes('sort-icon')) {
                newHeader.innerHTML += ' <span class="sort-icon">↕</span>';
            }
            
            // Add click event
            newHeader.addEventListener('click', function() {
                self.sortTableByColumn(tableElement, index, data);
            });
            
            // Replace the old header with the new one
            header.parentNode.replaceChild(newHeader, header);
        });
    }
    
    // Sort table by column
    sortTableByColumn(table, columnIndex, data) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Get all headers
        const headers = table.querySelectorAll('thead th');
        
        // Determine sort direction
        let sortDirection = 'asc';
        const header = headers[columnIndex];
        
        // Check current sort direction from the header
        if (header.getAttribute('data-sort') === 'asc') {
            sortDirection = 'desc';
        }
        
        // Update sort indicators on all headers
        headers.forEach(h => {
            // Reset all headers
            h.setAttribute('data-sort', '');
            
            // Find and reset sort icon
            const icon = h.querySelector('.sort-icon');
            if (icon) icon.textContent = '↕';
        });
        
        // Set sort direction on current header
        header.setAttribute('data-sort', sortDirection);
        
        // Update sort icon
        const sortIcon = header.querySelector('.sort-icon');
        if (sortIcon) {
            sortIcon.textContent = sortDirection === 'asc' ? '↑' : '↓';
        }
        
        // Sort the data
        const sortedData = [...data].sort((a, b) => {
            let valueA, valueB;
            
            // Determine which values to compare based on column index and current tab
            switch (this.currentTab) {
                case 'wpm':
                    switch (columnIndex) {
                        case 1: // Username
                            valueA = a.username?.toLowerCase() || '';
                            valueB = b.username?.toLowerCase() || '';
                            break;
                        case 2: // WPM
                            valueA = a.wpm || 0;
                            valueB = b.wpm || 0;
                            break;
                        case 3: // Accuracy
                            valueA = a.accuracy || 0;
                            valueB = b.accuracy || 0;
                            break;
                        case 4: // Difficulty
                            valueA = a.difficulty?.toLowerCase() || '';
                            valueB = b.difficulty?.toLowerCase() || '';
                            break;
                        case 5: // Date
                            valueA = new Date(a.timestamp || 0);
                            valueB = new Date(b.timestamp || 0);
                            break;
                        default:
                            return 0;
                    }
                    break;
                    
                case 'accuracy':
                    switch (columnIndex) {
                        case 1: // Username
                            valueA = a.username?.toLowerCase() || '';
                            valueB = b.username?.toLowerCase() || '';
                            break;
                        case 2: // Accuracy
                            valueA = a.accuracy || 0;
                            valueB = b.accuracy || 0;
                            break;
                        case 3: // WPM
                            valueA = a.wpm || 0;
                            valueB = b.wpm || 0;
                            break;
                        case 4: // Difficulty
                            valueA = a.difficulty?.toLowerCase() || '';
                            valueB = b.difficulty?.toLowerCase() || '';
                            break;
                        case 5: // Date
                            valueA = new Date(a.timestamp || 0);
                            valueB = new Date(b.timestamp || 0);
                            break;
                        default:
                            return 0;
                    }
                    break;
                    
                case 'time':
                    switch (columnIndex) {
                        case 1: // Username
                            valueA = a.username?.toLowerCase() || '';
                            valueB = b.username?.toLowerCase() || '';
                            break;
                        case 2: // Completion Time
                            valueA = a.completionTime || 0;
                            valueB = b.completionTime || 0;
                            break;
                        case 3: // WPM
                            valueA = a.wpm || 0;
                            valueB = b.wpm || 0;
                            break;
                        case 4: // Accuracy
                            valueA = a.accuracy || 0;
                            valueB = b.accuracy || 0;
                            break;
                        case 5: // Difficulty
                            valueA = a.difficulty?.toLowerCase() || '';
                            valueB = b.difficulty?.toLowerCase() || '';
                            break;
                        default:
                            return 0;
                    }
                    break;
                    
                default:
                    return 0;
            }
            
            // Compare the values
            if (valueA < valueB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        // Update the table with sorted data
        this.updateTableWithSortedData(sortedData);
    }
    
    // Update table with sorted data
    updateTableWithSortedData(sortedData) {
        // Preserve the current table and just update its content
        const tableId = `${this.currentTab}-tab`;
        const tableElement = document.getElementById(tableId);
        if (!tableElement) return;
        
        const tbody = tableElement.querySelector('tbody');
        if (!tbody) return;
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Add sorted rows
        sortedData.forEach((record, index) => {
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