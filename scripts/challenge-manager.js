// CodeRacer Challenge API Manager
class ChallengeManager {
    constructor() {
        this.apiBase = '/api';
        this.currentChallenge = null;
        this.userStats = null;
        this.init();
    }

    init() {
        this.loadUserStats();
    }

    // Authentication helpers
    async makeAuthenticatedRequest(url, options = {}) {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            this.handleAuthError();
            throw new Error('Authentication required');
        }

        return response;
    }

    handleAuthError() {
        // Redirect to login if not authenticated
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }

    // Challenge API methods
    async getChallenges(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`${this.apiBase}/challenges?${params}`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch challenges');
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
            throw error;
        }
    }

    async getChallenge(challengeId) {
        try {
            const response = await fetch(`${this.apiBase}/challenges/${challengeId}`);
            const data = await response.json();
            
            if (data.success) {
                this.currentChallenge = data.data;
                return data.data;
            } else {
                throw new Error(data.message || 'Challenge not found');
            }
        } catch (error) {
            console.error('Error fetching challenge:', error);
            throw error;
        }
    }

    async submitChallenge(challengeId, submission) {
        try {
            const response = await this.makeAuthenticatedRequest(`${this.apiBase}/challenges/${challengeId}/submit`, {
                method: 'POST',
                body: JSON.stringify(submission)
            });

            const data = await response.json();
            
            if (data.success) {
                // Update local user stats
                await this.loadUserStats();
                
                // Trigger events for UI updates
                this.triggerSubmissionEvent(data.data);
                
                return data.data;
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting challenge:', error);
            throw error;
        }
    }

    async loadUserStats() {
        try {
            const response = await this.makeAuthenticatedRequest(`${this.apiBase}/user/progress`);
            const data = await response.json();
            
            if (data.success) {
                this.userStats = data.data.stats;
                this.userChallenges = data.data.challenges;
                
                // Trigger stats update event
                this.triggerStatsUpdateEvent(this.userStats);
                
                return data.data;
            }
        } catch (error) {
            console.error('Error loading user stats:', error);
            // Don't throw error for stats - user might not be logged in
            return null;
        }
    }

    // Code execution and testing
    async executeCode(code, language, testCases) {
        const startTime = Date.now();
        const results = [];
        
        try {
            // This is a simplified code execution - in production you'd want a secure sandbox
            for (const testCase of testCases) {
                try {
                    const result = await this.runTestCase(code, language, testCase);
                    results.push({
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: result.output,
                        passed: this.compareOutputs(result.output, testCase.expectedOutput),
                        executionTime: result.executionTime,
                        error: result.error
                    });
                } catch (error) {
                    results.push({
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: null,
                        passed: false,
                        executionTime: 0,
                        error: error.message
                    });
                }
            }
            
            const totalTime = Date.now() - startTime;
            
            return {
                results,
                totalTime,
                allPassed: results.every(r => r.passed),
                passedCount: results.filter(r => r.passed).length,
                totalCount: results.length
            };
        } catch (error) {
            console.error('Code execution error:', error);
            throw error;
        }
    }

    async runTestCase(code, language, testCase) {
        // This is a placeholder for actual code execution
        // In production, this would be handled by a secure backend service
        
        const startTime = Date.now();
        
        try {
            let result;
            
            switch (language) {
                case 'python':
                    result = await this.executePython(code, testCase.input);
                    break;
                case 'javascript':
                    result = await this.executeJavaScript(code, testCase.input);
                    break;
                case 'java':
                    result = await this.executeJava(code, testCase.input);
                    break;
                default:
                    throw new Error(`Unsupported language: ${language}`);
            }
            
            return {
                output: result,
                executionTime: Date.now() - startTime,
                error: null
            };
        } catch (error) {
            return {
                output: null,
                executionTime: Date.now() - startTime,
                error: error.message
            };
        }
    }

    async executePython(code, input) {
        // Placeholder for Python execution
        // This would typically use Pyodide or a backend service
        throw new Error('Python execution not implemented in client-side demo');
    }

    async executeJavaScript(code, input) {
        try {
            // Create a safe execution context
            const wrappedCode = `
                (function() {
                    ${code}
                    
                    // Try to find and call the main function
                    const functionMatch = code.match(/function\\s+(\\w+)\\s*\\(/);
                    if (functionMatch) {
                        const functionName = functionMatch[1];
                        if (typeof window[functionName] === 'function') {
                            return window[functionName](${JSON.stringify(input)});
                        }
                    }
                    
                    // If no function found, try to evaluate the code directly
                    return eval(code);
                })()
            `;
            
            return eval(wrappedCode);
        } catch (error) {
            throw new Error(`JavaScript execution error: ${error.message}`);
        }
    }

    async executeJava(code, input) {
        // Placeholder for Java execution
        // This would require a backend service with Java compilation
        throw new Error('Java execution not implemented in client-side demo');
    }

    compareOutputs(actual, expected) {
        // Deep comparison of outputs
        return JSON.stringify(actual) === JSON.stringify(expected);
    }

    // Event system for UI updates
    triggerSubmissionEvent(submissionResult) {
        const event = new CustomEvent('challengeSubmitted', {
            detail: submissionResult
        });
        document.dispatchEvent(event);
    }

    triggerStatsUpdateEvent(stats) {
        const event = new CustomEvent('userStatsUpdated', {
            detail: stats
        });
        document.dispatchEvent(event);
    }

    // Utility methods
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `${seconds}s`;
        }
    }

    calculateAccuracy(passedTests, totalTests) {
        if (totalTests === 0) return 0;
        return Math.round((passedTests / totalTests) * 100 * 10) / 10;
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'easy': '#4caf50',
            'medium': '#ff9800',
            'hard': '#f44336',
            'expert': '#9c27b0'
        };
        return colors[difficulty] || '#666';
    }

    getLanguageIcon(language) {
        const icons = {
            'python': '🐍',
            'java': '☕',
            'javascript': '📜',
            'cpp': '⚙️',
            'csharp': '🔷',
            'go': '🐹',
            'rust': '🦀'
        };
        return icons[language] || '💻';
    }

    // Leaderboard integration
    async getUserLeaderboardPosition() {
        try {
            if (!this.userStats || !this.userStats.userId) {
                return null;
            }

            const response = await this.makeAuthenticatedRequest(`${this.apiBase}/leaderboard/position/${this.userStats.userId}`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            }
        } catch (error) {
            console.error('Error fetching leaderboard position:', error);
        }
        return null;
    }

    // Challenge recommendations
    getRecommendedChallenges(userLevel, completedChallenges = []) {
        const recommendations = [];
        
        // Logic for recommending challenges based on user progress
        // This would be enhanced with ML recommendations in production
        
        return recommendations;
    }
}

// Create global instance
window.challengeManager = new ChallengeManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeManager;
}
