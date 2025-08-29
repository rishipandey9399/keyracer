// Leaderboard Manager - Handles real-time leaderboard updates
class LeaderboardManager {
    constructor() {
        this.isLoading = false;
        this.lastUpdateTime = 0;
        this.updateCooldown = 2000; // 2 seconds between updates
        this.pendingUpdateTimeout = null;
        
        this.init();
    }

    init() {
        console.log('[LeaderboardManager] Initializing...');
        
        // Load initial data
        this.loadLeaderboardData();
        
        // Set up periodic refresh
        this.startPeriodicRefresh();
        
        // Listen for real-time updates
        this.setupRealTimeUpdates();
        
        console.log('[LeaderboardManager] Initialized successfully');
    }

    async loadLeaderboardData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            console.log('[LeaderboardManager] Fetching leaderboard data...');
            
            const response = await fetch(`/api/leaderboard?t=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            
            if (result.success && result.data && result.data.leaderboard) {
                console.log(`[LeaderboardManager] Received ${result.data.leaderboard.length} entries`);
                this.updateTable(result.data.leaderboard);
                this.lastUpdateTime = Date.now();
            } else {
                throw new Error(result.message || 'Invalid response format');
            }
            
        } catch (error) {
            console.error('[LeaderboardManager] Error loading data:', error);
            this.showError('Failed to load leaderboard data. Please refresh the page.');
        } finally {
            this.isLoading = false;
        }
    }

    updateTable(data) {
        const tbody = document.getElementById('leaderboard-tbody');
        if (!tbody) {
            console.error('[LeaderboardManager] Table body not found');
            return;
        }

        // Clear existing content
        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #888;">
                        No leaderboard data available
                    </td>
                </tr>
            `;
            return;
        }

        // Sort data by accuracy (descending), then WPM (descending)
        const sortedData = [...data].sort((a, b) => {
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return b.wpm - a.wpm;
        });

        // Create table rows
        sortedData.forEach((entry, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            
            // Sanitize data
            const username = this.sanitizeText(entry.username || 'Anonymous');
            const wpm = Math.round(entry.wpm || 0);
            const accuracy = Math.round(entry.accuracy || 0);
            const difficulty = this.sanitizeText(entry.difficulty || 'beginner');
            const dateStr = this.formatDate(entry.timestamp);
            
            row.innerHTML = `
                <td class="rank ${rankClass}">${rank}</td>
                <td class="username">${this.formatUsername(username, rank)}</td>
                <td class="highlight">${wpm} WPM</td>
                <td>${accuracy}%</td>
                <td>${this.capitalizeFirst(difficulty)}</td>
                <td>${dateStr}</td>
            `;
            
            tbody.appendChild(row);
        });

        console.log(`[LeaderboardManager] Updated table with ${sortedData.length} entries`);
    }

    showLoadingState() {
        const tbody = document.getElementById('leaderboard-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <div class="loading-spinner"></div>
                            <span>Loading leaderboard...</span>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showError(message) {
        const tbody = document.getElementById('leaderboard-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #ff4444;">
                        <div style="margin-bottom: 10px;">⚠️ ${message}</div>
                        <button onclick="window.leaderboardManager.loadLeaderboardData()" 
                                style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Retry
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    // Real-time update handling
    setupRealTimeUpdates() {
        // Listen for custom events
        window.addEventListener('leaderboardUpdate', (event) => {
            this.handleRealTimeUpdate(event.detail);
        });

        // Listen for storage events (cross-tab updates)
        window.addEventListener('storage', (event) => {
            if (event.key === 'leaderboard_update') {
                try {
                    this.handleRealTimeUpdate(JSON.parse(event.newValue || '{}'));
                } catch (error) {
                    console.error('[LeaderboardManager] Error parsing storage update:', error);
                }
            }
        });
    }

    handleRealTimeUpdate(data) {
        const now = Date.now();
        if (now - this.lastUpdateTime < this.updateCooldown) {
            // Clear existing timeout and schedule new one
            if (this.pendingUpdateTimeout) {
                clearTimeout(this.pendingUpdateTimeout);
            }
            this.pendingUpdateTimeout = setTimeout(() => {
                this.pendingUpdateTimeout = null;
                this.loadLeaderboardData();
            }, this.updateCooldown);
            return;
        }

        console.log('[LeaderboardManager] Processing real-time update:', data);
        this.loadLeaderboardData();
    }

    // Trigger real-time update
    triggerUpdate(testRecord) {
        console.log('[LeaderboardManager] Triggering leaderboard update');
        
        // Broadcast to other tabs
        try {
            localStorage.setItem('leaderboard_update', JSON.stringify({
                ...testRecord,
                timestamp: Date.now()
            }));
            
            // Clear after short delay
            setTimeout(() => {
                localStorage.removeItem('leaderboard_update');
            }, 1000);
        } catch (error) {
            console.error('[LeaderboardManager] Error broadcasting update:', error);
        }

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('leaderboardUpdate', {
            detail: testRecord
        }));

        // Immediate refresh for current page
        this.loadLeaderboardData();
    }

    // Add missing method for real-time updates
    updateLeaderboardRealTime(testRecord) {
        console.log('[LeaderboardManager] Real-time update received:', testRecord);
        this.loadLeaderboardData();
    }

    // Periodic refresh
    startPeriodicRefresh() {
        // Refresh every 30 seconds when page is visible
        setInterval(() => {
            if (!document.hidden && !this.isLoading) {
                this.loadLeaderboardData();
            }
        }, 30000);
    }

    // Utility functions
    sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    formatUsername(username, rank) {
        const trophyIcons = {
            1: '<i class="fas fa-trophy" style="color: #FFD700; margin-right: 5px;"></i>',
            2: '<i class="fas fa-trophy" style="color: #C0C0C0; margin-right: 5px;"></i>',
            3: '<i class="fas fa-trophy" style="color: #CD7F32; margin-right: 5px;"></i>'
        };
        
        return (trophyIcons[rank] || '') + username;
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        
        try {
            const date = new Date(timestamp);
            const now = new Date();
            
            // Check if it's today
            if (date.toDateString() === now.toDateString()) {
                return 'Today';
            }
            
            // Check if it's yesterday
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            }
            
            // Check if within last 7 days
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
                return `${diffDays} days ago`;
            }
            
            return date.toLocaleDateString();
        } catch (error) {
            return 'N/A';
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('leaderboard-tbody')) {
        window.leaderboardManager = new LeaderboardManager();
    }
});

// Global function to trigger leaderboard updates from any page
window.triggerLeaderboardUpdate = function(testRecord) {
    // Broadcast to all tabs via localStorage
    try {
        localStorage.setItem('leaderboard_update', JSON.stringify({
            ...testRecord,
            timestamp: Date.now()
        }));
        setTimeout(() => localStorage.removeItem('leaderboard_update'), 1000);
    } catch (error) {
        console.error('Error broadcasting leaderboard update:', error);
    }
    
    // Update current page if leaderboard manager exists
    if (window.leaderboardManager) {
        window.leaderboardManager.loadLeaderboardData();
    }
};

// Add loading spinner CSS
if (!document.getElementById('leaderboard-spinner-css')) {
    const style = document.createElement('style');
    style.id = 'leaderboard-spinner-css';
    style.textContent = `
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .rank-1 { color: #FFD700; font-weight: bold; }
        .rank-2 { color: #C0C0C0; font-weight: bold; }
        .rank-3 { color: #CD7F32; font-weight: bold; }
        
        .highlight { 
            color: #00C2FF; 
            font-weight: bold; 
            font-size: 1.1em; 
        }
    `;
    document.head.appendChild(style);
}