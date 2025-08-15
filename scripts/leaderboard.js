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
            
            // Log data for debugging
            console.log('[LeaderboardManager] Data received:', data);
            
            // Update the appropriate table
            this.updateTable(data);
            
        } catch (error) {
            console.error('[LeaderboardManager] Error loading leaderboard data:', error);
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
        // Sort data by highest accuracy, then highest WPM
        const sortedData = [...data].sort((a, b) => {
            // Sort by accuracy (descending), then WPM (descending)
            const accuracyA = typeof a.accuracy === 'number' ? (a.accuracy <= 1 ? a.accuracy * 100 : a.accuracy) : 0;
            const accuracyB = typeof b.accuracy === 'number' ? (b.accuracy <= 1 ? b.accuracy * 100 : b.accuracy) : 0;
            if (accuracyB !== accuracyA) return accuracyB - accuracyA;
            const wpmA = typeof a.wpm === 'number' ? a.wpm : 0;
            const wpmB = typeof b.wpm === 'number' ? b.wpm : 0;
            return wpmB - wpmA;
        });
        const tbody = document.getElementById('leaderboard-tbody');
        tbody.innerHTML = '';
        if (sortedData.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="6" style="text-align: center; padding: 20px;">No records found for the selected filters.</td>';
            tbody.appendChild(noDataRow);
            return;
        }
        sortedData.forEach((record, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const accuracyValue = typeof record.accuracy === 'number' ? (record.accuracy <= 1 ? Math.round(record.accuracy * 100) : record.accuracy) : 0;
            const wpmValue = typeof record.wpm === 'number' ? Math.round(record.wpm) : 0;
            row.innerHTML = `
                <td class="rank ${rankClass}">${rank}</td>
                <td class="username">${record.username || 'Anonymous'}</td>
                <td class="highlight">${wpmValue}</td>
                <td>${accuracyValue}%</td>
                <td>${record.difficulty || 'Standard'}</td>
                <td>${record.timestamp ? new Date(record.timestamp).toLocaleDateString() : ''}</td>
            `;
            tbody.appendChild(row);
        });
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
            
            // Ensure accuracy is properly formatted (handle both decimal and percentage formats)
            const accuracyValue = typeof record.accuracy === 'number' ? 
                (record.accuracy <= 1 ? Math.round(record.accuracy * 100) : record.accuracy) : 0;
                
            // Ensure WPM is a valid number
            const wpmValue = typeof record.wpm === 'number' ? Math.round(record.wpm) : 0;
            
            switch (this.currentTab) {
                case 'wpm':
                    row.innerHTML = `
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="username">${this.formatUsername(record.username || 'Anonymous', rank)}</td>
                        <td class="highlight">${wpmValue}</td>
                        <td>${accuracyValue}%</td>
                        <td>${this.capitalizeFirst(record.difficulty || 'Standard')}</td>
                        <td>${this.formatDate(record.timestamp)}</td>
                    `;
                    break;
                    
                case 'accuracy':
                    row.innerHTML = `
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="username">${this.formatUsername(record.username || 'Anonymous', rank)}</td>
                        <td class="highlight">${accuracyValue}%</td>
                        <td>${wpmValue}</td>
                        <td>${this.capitalizeFirst(record.difficulty || 'Standard')}</td>
                        <td>${this.formatDate(record.timestamp)}</td>
                    `;
                    break;
                    
                case 'time':
                    row.innerHTML = `
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="username">${this.formatUsername(record.username || 'Anonymous', rank)}</td>
                        <td class="highlight">${this.formatTime(record.completionTime)}</td>
                        <td>${wpmValue}</td>
                        <td>${accuracyValue}%</td>
                        <td>${this.capitalizeFirst(record.difficulty || 'Standard')}</td>
                    `;
                    break;
            }
            
            tbody.appendChild(row);
        });
    }
    
    // Format username with trophy icon for top ranks
    formatUsername(username, rank) {
        if (rank === 1) {
            return `<i class="fas fa-trophy trophy-icon" style="color: gold;"></i> ${username}`;
        } else if (rank === 2) {
            return `<i class="fas fa-trophy trophy-icon" style="color: silver;"></i> ${username}`;
        } else if (rank === 3) {
            return `<i class="fas fa-trophy trophy-icon" style="color: #cd7f32;"></i> ${username}`;
        } else {
            return username;
        }
    }
    
    // Format date to a readable string
    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } catch (e) {
            console.error('Error formatting date:', e);
            return 'Invalid date';
        }
    }
    
    // Format time in seconds to mm:ss format
    formatTime(seconds) {
        if (seconds === undefined || seconds === null) return 'N/A';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Capitalize first letter of a string
    capitalizeFirst(str) {
        if (!str) return 'N/A';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Show error message
    showError(message) {
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
        
        // Show error message
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #ff4040;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
                    <div>${message}</div>
                    <button id="retry-load" class="accent-btn" style="margin-top: 10px;">Retry</button>
                </td>
            </tr>
        `;
        
        // Add retry button functionality
        const retryButton = document.getElementById('retry-load');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.loadLeaderboardData();
            });
        }
    }

    // Real-time update functionality
    async updateLeaderboardRealTime(newRecord) {
        console.log('Updating leaderboard in real-time with new record:', newRecord);
        
        // Show a live update notification
        this.showLiveUpdateNotification(newRecord);
        
        // Reload leaderboard data to reflect the new record
        try {
            await this.loadLeaderboardData();
            console.log('Leaderboard updated successfully');
        } catch (error) {
            console.error('Error updating leaderboard in real-time:', error);
        }
    }

    // Show live update notification
    showLiveUpdateNotification(record) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'live-update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bolt"></i>
                <span>Leaderboard Updated!</span>
                <div class="update-details">
                    <strong>${record.username}</strong> scored ${record.wpm} WPM with ${Math.round(record.accuracy)}% accuracy
                </div>
            </div>
        `;
        
        // Add CSS styles if not already present
        if (!document.getElementById('live-update-styles')) {
            const style = document.createElement('style');
            style.id = 'live-update-styles';
            style.textContent = `
                .live-update-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10000;
                    transform: translateX(400px);
                    opacity: 0;
                    transition: all 0.3s ease;
                    font-family: 'Roboto', sans-serif;
                    max-width: 350px;
                }
                
                .live-update-notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-content i {
                    font-size: 20px;
                    color: #FFD700;
                    animation: pulse 2s infinite;
                }
                
                .update-details {
                    font-size: 12px;
                    margin-top: 5px;
                    opacity: 0.9;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to document and show
        document.body.appendChild(notification);
        
        // Trigger show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Check for updates periodically (for multi-user scenarios)
    startPeriodicUpdates() {
        // Update leaderboard every 30 seconds to catch updates from other users
        this.updateInterval = setInterval(() => {
            // Only update if user is currently viewing the leaderboard page
            if (window.location.pathname.includes('leaderboard.html')) {
                this.loadLeaderboardData();
            }
        }, 30000); // 30 seconds
    }

    // Stop periodic updates
    stopPeriodicUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Initialize leaderboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if typingDB is available
    if (window.typingDB) {
        window.leaderboardManager = new LeaderboardManager();
        console.log('Leaderboard initialized');
        
        // Create global function for real-time updates
        window.updateLeaderboardRealTime = function(newRecord) {
            if (window.leaderboardManager) {
                window.leaderboardManager.updateLeaderboardRealTime(newRecord);
            }
        };
        
        // Start periodic updates for multi-user scenarios
        if (window.location.pathname.includes('leaderboard.html')) {
            window.leaderboardManager.startPeriodicUpdates();
        }
        
    } else {
        console.error('typingDB not found. Make sure database.js is loaded before leaderboard.js');
        document.body.innerHTML += '<div style="color:red;padding:20px;background:#ffeeee;position:fixed;top:0;left:0;right:0;z-index:9999;">Error: Database not initialized</div>';
    }
});

// Clean up periodic updates when leaving the page
window.addEventListener('beforeunload', () => {
    if (window.leaderboardManager) {
        window.leaderboardManager.stopPeriodicUpdates();
    }
});
````