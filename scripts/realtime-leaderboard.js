/**
 * Real-time Leaderboard System
 * Handles live updates across all pages when users complete typing tests
 */

class RealTimeLeaderboard {
    constructor() {
        this.updateQueue = [];
        this.isProcessing = false;
        this.lastUpdateTime = Date.now();
        this.updateCooldown = 1000; // 1 second cooldown between updates
        this.maxRetries = 3; // Maximum retry attempts for failed updates
        this.retryDelay = 2000; // 2 seconds delay between retries
        this.maxQueueSize = 50; // Maximum queue size to prevent memory issues
        
        // Performance monitoring
        this.updateStats = {
            totalUpdates: 0,
            successfulUpdates: 0,
            failedUpdates: 0,
            averageProcessingTime: 0
        };
        
        // Initialize the system
        this.init();
    }

    init() {
        console.log('Real-time leaderboard system initialized');
        
        // Listen for storage events (for same-origin multi-tab updates)
        window.addEventListener('storage', (e) => {
            if (e.key === 'leaderboard-update') {
                this.handleStorageUpdate(e.newValue);
            }
        });

        // Listen for BroadcastChannel messages for cross-tab/window updates
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                this.broadcastChannel = new BroadcastChannel('leaderboard_updates');
                this.broadcastChannel.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'leaderboard_update') {
                        this.handleBroadcastUpdate(event.data);
                    }
                });
            } catch (error) {
                console.log('BroadcastChannel not supported, falling back to localStorage only');
            }
        }

        // Listen for page visibility changes to resume updates
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.updateQueue.length > 0) {
                this.processUpdateQueue();
            }
        });

        // Periodic cleanup of old queue items
        setInterval(() => {
            this.cleanupUpdateQueue();
        }, 60000); // Every minute

        // Performance monitoring
        if (typeof window !== 'undefined' && window.performance) {
            this.performanceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('leaderboard-update')) {
                        this.updateStats.averageProcessingTime = 
                            (this.updateStats.averageProcessingTime + entry.duration) / 2;
                    }
                }
            });
        }
    }

    // Enhanced trigger update with error handling and validation
    async triggerUpdate(testRecord) {
        const updateStartTime = performance.now();
        
        try {
            console.log('Triggering real-time leaderboard update:', testRecord);

            // Comprehensive validation
            const validation = this.validateTestRecord(testRecord);
            if (!validation.isValid) {
                console.warn('Invalid test record for leaderboard update:', validation.errors);
                this.updateStats.failedUpdates++;
                return { success: false, error: 'Validation failed', details: validation.errors };
            }

            // Enhanced authentication validation
            const authValidation = this.validateAuthentication(testRecord);
            if (!authValidation.isValid) {
                console.log('Skipping leaderboard update - authentication failed:', authValidation.reason);
                return { success: false, error: 'Authentication failed', details: authValidation.reason };
            }

            // Check queue size limit
            if (this.updateQueue.length >= this.maxQueueSize) {
                console.warn('Update queue full, removing oldest updates');
                this.updateQueue = this.updateQueue.slice(-this.maxQueueSize + 10);
            }

            // Add to update queue with retry information
            const updateItem = {
                ...testRecord,
                updateTime: Date.now(),
                processed: false,
                retryCount: 0,
                priority: this.calculateUpdatePriority(testRecord)
            };

            this.updateQueue.push(updateItem);
            this.updateStats.totalUpdates++;

            // Sort queue by priority (higher priority first)
            this.updateQueue.sort((a, b) => (b.priority || 0) - (a.priority || 0));

            // Process immediately if possible
            await this.processUpdateQueue();

            // Broadcast to other tabs/windows
            this.broadcastUpdate(testRecord);

            const updateEndTime = performance.now();
            const processingTime = updateEndTime - updateStartTime;
            
            // Record performance metrics
            if (this.performanceObserver) {
                performance.mark(`leaderboard-update-${Date.now()}`);
            }

            return { 
                success: true, 
                processingTime,
                queueLength: this.updateQueue.length,
                stats: this.updateStats
            };

        } catch (error) {
            console.error('Error in triggerUpdate:', error);
            this.updateStats.failedUpdates++;
            return { success: false, error: error.message };
        }
    }

    // Comprehensive validation function
    validateTestRecord(testRecord) {
        const errors = [];
        
        // Required fields validation
        if (!testRecord.username) errors.push('Username is required');
        if (typeof testRecord.wpm !== 'number' || testRecord.wpm < 0) errors.push('Valid WPM is required');
        if (typeof testRecord.accuracy !== 'number' || testRecord.accuracy < 0 || testRecord.accuracy > 100) {
            errors.push('Valid accuracy (0-100) is required');
        }
        
        // Reasonable limits validation
        if (testRecord.wpm > 300) errors.push('WPM exceeds reasonable limit (300)');
        if (testRecord.completionTime && testRecord.completionTime < 5) errors.push('Completion time too short');
        
        // Data integrity checks
        if (testRecord.charsTyped && testRecord.completionTime) {
            const calculatedWPM = (testRecord.charsTyped / 5) / (testRecord.completionTime / 60);
            const wpmDifference = Math.abs(calculatedWPM - testRecord.wpm);
            if (wpmDifference > 10) {
                errors.push('WPM calculation inconsistency detected');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Enhanced authentication validation
    validateAuthentication(testRecord) {
        const currentUser = localStorage.getItem('typingTestUser');
        const userType = localStorage.getItem('typingTestUserType');
        
        // Allow registered users
        if (userType === 'registered' && currentUser) {
            return { isValid: true };
        }
        
        // Check if user is authenticated
        if (!currentUser) {
            return { isValid: false, reason: 'No authenticated user' };
        }
        
        // Check for guest users - allow them for local updates
        if (testRecord.username === 'Guest' || userType === 'guest') {
            return { isValid: true, reason: 'Guest user - local update only' };
        }
        
        // Check for suspicious rapid updates from same user
        const recentUpdates = this.updateQueue.filter(
            update => update.username === currentUser && 
            (Date.now() - update.updateTime) < 10000 // Within 10 seconds
        );
        
        if (recentUpdates.length > 5) {
            return { isValid: false, reason: 'Too many rapid updates detected' };
        }

        return { isValid: true };
    }

    // Calculate update priority based on score significance
    calculateUpdatePriority(testRecord) {
        let priority = 1; // Base priority
        
        // Higher priority for exceptional scores
        if (testRecord.wpm > 100) priority += 2;
        if (testRecord.wpm > 150) priority += 3;
        if (testRecord.accuracy > 98) priority += 2;
        
        // Higher priority for expert difficulty
        if (testRecord.difficulty === 'expert') priority += 1;
        
        return priority;
    }

    // Enhanced process queue with retry logic
    async processUpdateQueue() {
        if (this.isProcessing || this.updateQueue.length === 0) {
            return;
        }

        const now = Date.now();
        if (now - this.lastUpdateTime < this.updateCooldown) {
            // Schedule next update after cooldown
            setTimeout(() => this.processUpdateQueue(), this.updateCooldown);
            return;
        }

        this.isProcessing = true;
        this.lastUpdateTime = now;

        try {
            // Get the highest priority unprocessed update
            const updates = this.updateQueue.filter(u => !u.processed);
            if (updates.length === 0) {
                this.isProcessing = false;
                return;
            }

            const updateToProcess = updates[0]; // Already sorted by priority
            
            try {
                // Update current page leaderboard if applicable
                await this.updateCurrentPageLeaderboard(updateToProcess);

                // Show notification for significant achievements
                this.checkAndShowAchievementNotification(updateToProcess);

                // Mark as processed
                updateToProcess.processed = true;
                this.updateStats.successfulUpdates++;

                console.log('Leaderboard update processed successfully:', updateToProcess.username, updateToProcess.wpm);

            } catch (error) {
                console.error('Error processing individual update:', error);
                
                // Implement retry logic
                updateToProcess.retryCount = (updateToProcess.retryCount || 0) + 1;
                
                if (updateToProcess.retryCount < this.maxRetries) {
                    console.log(`Retrying update (attempt ${updateToProcess.retryCount + 1}/${this.maxRetries})`);
                    // Schedule retry
                    setTimeout(() => {
                        updateToProcess.processed = false; // Reset for retry
                        this.processUpdateQueue();
                    }, this.retryDelay);
                } else {
                    console.error('Max retries exceeded, marking update as failed');
                    updateToProcess.processed = true; // Mark as processed to remove from queue
                    updateToProcess.failed = true;
                    this.updateStats.failedUpdates++;
                }
            }

            // Clean up old updates
            this.cleanupUpdateQueue();

        } catch (error) {
            console.error('Error in processUpdateQueue:', error);
            this.updateStats.failedUpdates++;
        } finally {
            this.isProcessing = false;
            
            // Continue processing remaining updates
            const remainingUpdates = this.updateQueue.filter(u => !u.processed && (u.retryCount || 0) < this.maxRetries);
            if (remainingUpdates.length > 0) {
                setTimeout(() => this.processUpdateQueue(), this.updateCooldown);
            }
        }
    }

    // Update leaderboard on current page
    async updateCurrentPageLeaderboard(testRecord) {
        // Check if we're on a page with leaderboard functionality
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('leaderboard.html')) {
            // Direct leaderboard page update
            if (window.leaderboardManager) {
                await window.leaderboardManager.updateLeaderboardRealTime(testRecord);
            }
        } else if (window.leaderboardManager) {
            // Other pages with leaderboard components
            await window.leaderboardManager.updateLeaderboardRealTime(testRecord);
        } else {
            // Pages without leaderboard - show mini notification
            this.showMiniLeaderboardUpdate(testRecord);
        }
    }

    // Show mini notification on pages without leaderboard
    showMiniLeaderboardUpdate(record) {
        // Don't show notification for the current user's own score
        const currentUser = localStorage.getItem('typingTestUser');
        if (record.username === currentUser) {
            return;
        }

        const notification = document.createElement('div');
        notification.className = 'mini-leaderboard-update';
        notification.innerHTML = `
            <div class="mini-update-content">
                <i class="fas fa-trophy"></i>
                <span><strong>${record.username}</strong> just scored ${record.wpm} WPM!</span>
                <button class="view-leaderboard-btn" onclick="window.location.href='leaderboard.html'">
                    View Leaderboard
                </button>
            </div>
        `;

        // Add styles if not present
        if (!document.getElementById('mini-update-styles')) {
            const style = document.createElement('style');
            style.id = 'mini-update-styles';
            style.textContent = `
                .mini-leaderboard-update {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    transform: translateX(400px);
                    opacity: 0;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    max-width: 300px;
                }
                
                .mini-leaderboard-update.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .mini-update-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .mini-update-content i {
                    color: #FFD700;
                    font-size: 16px;
                }
                
                .view-leaderboard-btn {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    margin-left: 8px;
                    transition: background 0.2s ease;
                }
                
                .view-leaderboard-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Check for significant achievements and show notifications
    checkAndShowAchievementNotification(record) {
        const achievements = [];

        // Speed achievements
        if (record.wpm >= 100) {
            achievements.push({ type: 'speed', title: 'Century Club!', message: `${record.username} hit ${record.wpm} WPM!` });
        } else if (record.wpm >= 80) {
            achievements.push({ type: 'speed', title: 'Speed Demon!', message: `${record.username} achieved ${record.wpm} WPM!` });
        }

        // Accuracy achievements
        if (record.accuracy >= 99) {
            achievements.push({ type: 'accuracy', title: 'Perfect Precision!', message: `${record.username} achieved ${Math.round(record.accuracy)}% accuracy!` });
        }

        // Show achievement notifications
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementNotification(achievement);
            }, index * 1000);
        });
    }

    // Show achievement notification
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">
                    <i class="fas ${achievement.type === 'speed' ? 'fa-tachometer-alt' : 'fa-bullseye'}"></i>
                </div>
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-message">${achievement.message}</div>
                </div>
            </div>
        `;

        // Add styles if not present
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                .achievement-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.5);
                    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                    z-index: 10001;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    text-align: center;
                    min-width: 300px;
                }
                
                .achievement-notification.show {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                
                .achievement-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .achievement-icon {
                    font-size: 32px;
                    color: #FFD700;
                    animation: bounce 1s ease-in-out infinite alternate;
                }
                
                .achievement-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .achievement-message {
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                @keyframes bounce {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-5px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    // Broadcast update to other tabs/windows using both localStorage and BroadcastChannel
    broadcastUpdate(testRecord) {
        try {
            // Method 1: localStorage for same-origin tabs (legacy support)
            localStorage.setItem('leaderboard-update', JSON.stringify({
                ...testRecord,
                timestamp: Date.now(),
                broadcastId: Math.random().toString(36).substr(2, 9)
            }));
            
            // Clear the storage item after a short delay to allow other tabs to read it
            setTimeout(() => {
                localStorage.removeItem('leaderboard-update');
            }, 1000);
            
            // Method 2: BroadcastChannel for modern browsers (more reliable)
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({
                    type: 'leaderboard_update',
                    data: testRecord,
                    timestamp: Date.now(),
                    broadcastId: Math.random().toString(36).substr(2, 9)
                });
            }
        } catch (error) {
            console.error('Error broadcasting leaderboard update:', error);
        }
    }

    // Handle storage update from other tabs
    handleStorageUpdate(newValue) {
        if (!newValue) return;

        try {
            const updateData = JSON.parse(newValue);
            
            // Prevent processing the same update multiple times
            if (this.updateQueue.some(u => u.broadcastId === updateData.broadcastId)) {
                return;
            }

            // Add to queue and process
            this.updateQueue.push({
                ...updateData,
                processed: false,
                fromBroadcast: true
            });

            this.processUpdateQueue();
        } catch (error) {
            console.error('Error handling storage update:', error);
        }
    }

    // Handle BroadcastChannel updates
    handleBroadcastUpdate(broadcastData) {
        try {
            // Prevent processing the same update multiple times
            if (this.updateQueue.some(u => u.broadcastId === broadcastData.broadcastId)) {
                return;
            }

            // Add to queue and process
            this.updateQueue.push({
                ...broadcastData.data,
                processed: false,
                fromBroadcast: true,
                broadcastId: broadcastData.broadcastId
            });

            this.processUpdateQueue();
        } catch (error) {
            console.error('Error handling broadcast update:', error);
        }
    }

    // Clean up old updates from queue
    cleanupUpdateQueue() {
        const now = Date.now();
        const maxAge = 60000; // 1 minute

        this.updateQueue = this.updateQueue.filter(update => 
            (now - update.updateTime) < maxAge
        );
    }

    // Get leaderboard update statistics
    getUpdateStats() {
        return {
            queueLength: this.updateQueue.length,
            lastUpdateTime: this.lastUpdateTime,
            isProcessing: this.isProcessing,
            statistics: { ...this.updateStats },
            unprocessedUpdates: this.updateQueue.filter(u => !u.processed).length,
            failedUpdates: this.updateQueue.filter(u => u.failed).length,
            averageQueueTime: this.calculateAverageQueueTime(),
            systemHealth: this.getSystemHealth()
        };
    }

    // Calculate average time updates spend in queue
    calculateAverageQueueTime() {
        const processedUpdates = this.updateQueue.filter(u => u.processed && !u.failed);
        if (processedUpdates.length === 0) return 0;

        const totalQueueTime = processedUpdates.reduce((sum, update) => {
            return sum + (this.lastUpdateTime - update.updateTime);
        }, 0);

        return totalQueueTime / processedUpdates.length;
    }

    // Get system health status
    getSystemHealth() {
        const stats = this.updateStats;
        const successRate = stats.totalUpdates > 0 ? 
            (stats.successfulUpdates / stats.totalUpdates) * 100 : 100;
        const queueHealth = this.updateQueue.length < this.maxQueueSize * 0.8;
        const processingHealth = this.updateStats.averageProcessingTime < 1000; // Under 1 second

        let status = 'excellent';
        if (successRate < 90 || !queueHealth || !processingHealth) status = 'good';
        if (successRate < 75 || this.updateQueue.length > this.maxQueueSize * 0.9) status = 'warning';
        if (successRate < 50 || this.updateQueue.length >= this.maxQueueSize) status = 'critical';

        return {
            status,
            successRate: successRate.toFixed(2),
            queueHealth,
            processingHealth,
            recommendations: this.getHealthRecommendations(status)
        };
    }

    // Get health recommendations
    getHealthRecommendations(status) {
        const recommendations = [];
        
        if (status === 'warning' || status === 'critical') {
            if (this.updateStats.failedUpdates > this.updateStats.successfulUpdates * 0.1) {
                recommendations.push('High failure rate detected - check network connectivity');
            }
            if (this.updateQueue.length > this.maxQueueSize * 0.8) {
                recommendations.push('Queue size is high - consider increasing processing frequency');
            }
            if (this.updateStats.averageProcessingTime > 1000) {
                recommendations.push('Slow processing detected - optimize leaderboard update logic');
            }
        }

        if (recommendations.length === 0) {
            recommendations.push('System is operating normally');
        }

        return recommendations;
    }

    // Manual system maintenance functions
    flushUpdateQueue() {
        const queueLength = this.updateQueue.length;
        this.updateQueue = [];
        console.log(`Flushed ${queueLength} items from update queue`);
        return queueLength;
    }

    resetStatistics() {
        this.updateStats = {
            totalUpdates: 0,
            successfulUpdates: 0,
            failedUpdates: 0,
            averageProcessingTime: 0
        };
        console.log('Update statistics reset');
    }

    // Force process all pending updates (use with caution)
    async forceProcessAllUpdates() {
        console.log('Force processing all pending updates...');
        const originalCooldown = this.updateCooldown;
        this.updateCooldown = 100; // Reduce cooldown temporarily
        
        try {
            while (this.updateQueue.filter(u => !u.processed).length > 0 && !this.isProcessing) {
                await this.processUpdateQueue();
                await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
            }
        } finally {
            this.updateCooldown = originalCooldown; // Restore original cooldown
        }
        
        console.log('Force processing completed');
    }
}

// Initialize real-time leaderboard system
document.addEventListener('DOMContentLoaded', () => {
    window.realTimeLeaderboard = new RealTimeLeaderboard();
    console.log('Real-time leaderboard system loaded');
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeLeaderboard;
}
