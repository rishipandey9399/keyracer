// Enhanced Challenges Manager Class
class EnhancedChallengesManager {
    constructor() {
        this.challenges = [];
        this.userStats = {};
        this.currentFilter = 'all';
        this.currentLanguage = this.getInitialLanguage();
        this.setupEventListeners();
        this.setActiveLanguageTab(this.currentLanguage);
        this.initializeWithLanguage();
        this.loadUserStats();
    }

    async initializeWithLanguage() {
        await this.showDemoData(this.currentLanguage);
        this.updateChallengeStatusFromLocalStorage();
        this.renderChallenges();
    }

    getInitialLanguage() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam) {
            return langParam;
        }
        
        // Check localStorage for last selected language
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            return savedLanguage;
        }
        
        // Default to python
        return 'python';
    }

    setActiveLanguageTab(language) {
        // Remove active class from all tabs
        document.querySelectorAll('.language-tab').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to the selected language tab
        const targetTab = document.querySelector(`[data-language="${language}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    async showDemoData(language = 'python') {
        if (language === 'python' || language === 'java' || language === 'javascript' || language === 'c' || language === 'cpp') {
            try {
                const response = await fetch('./scripts/challenges.json');
                if (!response.ok) throw new Error('Failed to load challenges');
                const data = await response.json();
                this.challenges = data.challenges.filter(ch => {
                    if (language === 'python') {
                        return !ch.language || ch.language === 'python';
                    } else if (language === 'java') {
                        return ch.language === 'java';
                    } else if (language === 'javascript') {
                        return ch.language === 'javascript';
                    } else if (language === 'c') {
                        return ch.language === 'c';
                    } else if (language === 'cpp') {
                        return ch.language === 'cpp';
                    }
                    return false;
                });
            } catch (error) {
                this.challenges = this.getFallbackChallenges(language);
            }
        } else {
            this.challenges = [];
        }
        
        // Update challenge status after loading
        this.updateChallengeStatusFromLocalStorage();
    }

    getFallbackChallenges(language) {
        const fallbackData = {
            python: [
                { id: 1, title: "Hello World", difficulty: "Beginner", points: 10, category: "Basic", description: "Print Hello World", status: "new" },
                { id: 2, title: "Sum Two Numbers", difficulty: "Beginner", points: 10, category: "Math", description: "Add two numbers", status: "new" }
            ],
            javascript: [
                { id: 3, title: "Variable Declaration", difficulty: "Beginner", points: 10, category: "Basic", description: "Declare variables", status: "new" }
            ],
            java: [
                { id: 4, title: "Main Method", difficulty: "Beginner", points: 10, category: "Basic", description: "Create main method", status: "new" }
            ]
        };
        return fallbackData[language] || [];
    }

    setupEventListeners() {
        document.querySelectorAll('.language-tab').forEach(button => {
            button.addEventListener('click', async (e) => {
                if (button.classList.contains('disabled')) return;
                const selectedLang = button.getAttribute('data-language');
                
                // Update current language and save to localStorage
                this.currentLanguage = selectedLang;
                localStorage.setItem('selectedLanguage', selectedLang);
                
                document.querySelectorAll('.language-tab').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                await this.showDemoData(selectedLang);
                this.renderChallenges();
                
                // If not python, java, javascript, c, or cpp, show 'coming soon' message
                if (selectedLang !== 'python' && selectedLang !== 'java' && selectedLang !== 'javascript' && selectedLang !== 'c' && selectedLang !== 'cpp') {
                    const container = document.getElementById('challenges-list');
                    if (container) {
                        Array.from(container.children).forEach(child => {
                            if (!child.classList.contains('loading-container')) {
                                container.removeChild(child);
                            }
                        });
                        const comingDiv = document.createElement('div');
                        comingDiv.className = 'loading-container';
                        comingDiv.innerHTML = `<p style="font-size:1.2rem;color:#FFC700;">${selectedLang.charAt(0).toUpperCase()+selectedLang.slice(1)} challenges coming soon!</p>`;
                        container.appendChild(comingDiv);
                    }
                }
            });
        });
        document.querySelectorAll('.difficulty-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-filter').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.getAttribute('data-difficulty');
                this.renderChallenges();
            });
        });
    }

    renderChallenges() {
        const container = document.getElementById('challenges-list');
        if (!container) return;
        // Hide loading spinner
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) loadingContainer.style.display = 'none';
        let filteredChallenges = this.challenges;
        const filter = this.currentFilter;
        if (filter && filter !== 'all') {
            filteredChallenges = this.challenges.filter(challenge => {
                if (filter === 'easy') return challenge.difficulty.toLowerCase() === 'beginner';
                if (filter === 'medium') return challenge.difficulty.toLowerCase() === 'intermediate';
                if (filter === 'hard') return challenge.difficulty.toLowerCase() === 'advanced';
                if (filter === 'expert') return challenge.difficulty.toLowerCase() === 'expert';
                return true;
            });
        }
        // Remove all previous challenge cards
        Array.from(container.children).forEach(child => {
            if (!child.classList.contains('loading-container')) {
                container.removeChild(child);
            }
        });
        if (filteredChallenges.length === 0) {
            // Do not show 'No challenges found' message
            return;
        }
        filteredChallenges.forEach(challenge => {
            const card = this.createChallengeCard(challenge);
            container.appendChild(card);
            
            // Add event listeners for the challenge button
            const button = card.querySelector('.challenge-btn-primary');
            if (button) {
                button.addEventListener('click', () => {
                    this.startChallenge(challenge.id);
                });
                
                button.addEventListener('mouseover', () => {
                    button.style.background = 'linear-gradient(135deg, #FFC700, #E41B17)';
                });
                
                button.addEventListener('mouseout', () => {
                    button.style.background = 'linear-gradient(135deg, #00C2FF, #0E1E38)';
                });
            }
        });
    }

    createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        const statusClass = this.getStatusClass(challenge.status);
        const difficultyClass = `difficulty-${challenge.difficulty.toLowerCase()}`;
        card.innerHTML = `
            <div class="challenge-status ${statusClass}"></div>
            <div class="challenge-header">
                <span class="challenge-title">${challenge.title}</span><br>
                <span class="difficulty-badge ${difficultyClass}">${challenge.difficulty} (${challenge.points}pts)</span>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-stats">
                <div class="challenge-stat">
                    <span class="challenge-stat-label">Category</span>
                    <span class="challenge-stat-value">${challenge.category}</span>
                </div>
            </div>
            <div class="challenge-actions">
                <button class="challenge-btn challenge-btn-primary" data-challenge-id="${challenge.id}" style="background: linear-gradient(135deg, ${challenge.status === 'completed' ? '#FFC700, #E41B17' : '#00C2FF, #0E1E38'});">${challenge.status === 'completed' ? 'Retry Challenge' : 'Solve Challenge'}</button>
            </div>
        `;
        return card;
    }

    getStatusClass(status) {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'attempted': return 'status-attempted';
            default: return 'status-new';
        }
    }

    updateChallengeStatusFromLocalStorage() {
        // Get completed challenges from localStorage
        const savedStats = localStorage.getItem('challengeStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            if (stats.completedChallenges && Array.isArray(stats.completedChallenges)) {
                stats.completedChallenges.forEach(id => {
                    const challenge = this.challenges.find(c => c.id.toString() === id.toString());
                    if (challenge) challenge.status = 'completed';
                });
            }
        }
    }

    startChallenge(challengeId) {
        // Navigate to the solve challenge page
        window.location.href = `solve-challenge.html?challenge=${challengeId}`;
    }

    async loadUserStats() {
        // Always show default stats first
        this.displayUserStats({ rank: '-', points: 0, challenges: 0 });
        
        try {
            const response = await fetch('/api/coderacer-leaderboard?limit=100');
            const data = await response.json();
            
            if (data.success && data.data.leaderboard) {
                const currentUser = this.getCurrentUser();
                if (currentUser) {
                    const userEntry = data.data.leaderboard.find(entry => 
                        entry.user && entry.user.name && 
                        entry.user.name.toLowerCase() === currentUser.toLowerCase()
                    );
                    
                    if (userEntry) {
                        this.displayUserStats({
                            rank: userEntry.rank,
                            points: userEntry.stats.totalPoints || 0,
                            challenges: userEntry.stats.challengesCompleted || 0
                        });
                    }
                }
            }
        } catch (error) {
                      console.error('Failed to load user stats:', error.message);
        }
    }

    getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) return user.displayName || user.username || user.name;
        } catch (e) {
            const legacy = localStorage.getItem('typingTestUser');
            if (legacy) return legacy;
        }
        return null;
    }

    displayUserStats(stats) {
        const rankElement = document.getElementById('userRank');
        const pointsElement = document.getElementById('userPoints');
        const challengesElement = document.getElementById('userChallenges');
        
        if (rankElement && pointsElement && challengesElement) {
            let rankDisplay = stats.rank;
            if (stats.rank === 1) rankDisplay = '🥇';
            else if (stats.rank === 2) rankDisplay = '🥈';
            else if (stats.rank === 3) rankDisplay = '🥉';
            
            rankElement.textContent = rankDisplay;
            pointsElement.textContent = stats.points.toLocaleString();
            challengesElement.textContent = stats.challenges;
        }
    }
}