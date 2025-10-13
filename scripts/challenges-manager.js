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
        const supportedLanguages = ['python', 'java', 'javascript', 'c', 'cpp'];
        if (supportedLanguages.includes(language)) {
            try {
                const response = await fetch('./scripts/challenges.json');
                if (!response.ok) throw new Error('Failed to load challenges');
                const data = await response.json();
                this.challenges = data.challenges.filter(ch => 
                    language === 'python' ? (!ch.language || ch.language === 'python') : ch.language === language
                );
            } catch (error) {
                console.error('Failed to load challenges:', error.message);
                this.challenges = this.getFallbackChallenges(language);
            }
        } else {
            this.challenges = [];
        }
        
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
        const languageTabs = document.querySelectorAll('.language-tab');
        const difficultyFilters = document.querySelectorAll('.difficulty-filter');
        const supportedLanguages = ['python', 'java', 'javascript', 'c', 'cpp'];
        
        languageTabs.forEach(button => {
            button.addEventListener('click', async (e) => {
                if (button.classList.contains('disabled')) return;
                const selectedLang = button.getAttribute('data-language');
                
                this.currentLanguage = selectedLang;
                localStorage.setItem('selectedLanguage', selectedLang);
                
                languageTabs.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                await this.showDemoData(selectedLang);
                this.renderChallenges();
                
                if (!supportedLanguages.includes(selectedLang)) {
                    this.showComingSoonMessage(selectedLang);
                }
            });
        });
        
        difficultyFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                difficultyFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.getAttribute('data-difficulty');
                this.renderChallenges();
            });
        });
    }
    
    showComingSoonMessage(language) {
        const container = document.getElementById('challenges-list');
        if (!container) return;
        
        Array.from(container.children).forEach(child => {
            if (!child.classList.contains('loading-container')) {
                container.removeChild(child);
            }
        });
        
        const comingDiv = document.createElement('div');
        comingDiv.className = 'loading-container';
        const p = document.createElement('p');
        p.style.cssText = 'font-size:1.2rem;color:#FFC700;';
        p.textContent = `${language.charAt(0).toUpperCase()+language.slice(1)} challenges coming soon!`;
        comingDiv.appendChild(p);
        container.appendChild(comingDiv);
    }

    renderChallenges() {
        const container = document.getElementById('challenges-list');
        if (!container) return;
        
        const loadingContainer = document.getElementById('loadingContainer');
        if (loadingContainer) loadingContainer.style.display = 'none';
        
        const filteredChallenges = this.getFilteredChallenges();
        this.clearChallengeCards(container);
        
        if (filteredChallenges.length === 0) return;
        
        filteredChallenges.forEach(challenge => {
            const card = this.createChallengeCard(challenge);
            container.appendChild(card);
            this.attachCardEventListeners(card, challenge.id);
        });
    }
    
    getFilteredChallenges() {
        const difficultyMap = {
            easy: 'beginner',
            medium: 'intermediate', 
            hard: 'advanced',
            expert: 'expert'
        };
        
        if (this.currentFilter === 'all') return this.challenges;
        
        const targetDifficulty = difficultyMap[this.currentFilter];
        return this.challenges.filter(challenge => 
            challenge.difficulty.toLowerCase() === targetDifficulty
        );
    }
    
    clearChallengeCards(container) {
        Array.from(container.children).forEach(child => {
            if (!child.classList.contains('loading-container')) {
                container.removeChild(child);
            }
        });
    }
    
    attachCardEventListeners(card, challengeId) {
        const button = card.querySelector('.challenge-btn-primary');
        if (!button) return;
        
        button.addEventListener('click', () => this.startChallenge(challengeId));
        button.addEventListener('mouseover', () => {
            button.style.background = 'linear-gradient(135deg, #FFC700, #E41B17)';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = 'linear-gradient(135deg, #00C2FF, #0E1E38)';
        });
    }

    createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `challenge-status ${this.getStatusClass(challenge.status)}`;
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'challenge-header';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'challenge-title';
        titleSpan.textContent = challenge.title;
        const badgeSpan = document.createElement('span');
        badgeSpan.className = `difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`;
        badgeSpan.textContent = `${challenge.difficulty} (${challenge.points}pts)`;
        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(document.createElement('br'));
        headerDiv.appendChild(badgeSpan);
        
        const descP = document.createElement('p');
        descP.className = 'challenge-description';
        descP.textContent = challenge.description;
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'challenge-stats';
        const statDiv = document.createElement('div');
        statDiv.className = 'challenge-stat';
        const labelSpan = document.createElement('span');
        labelSpan.className = 'challenge-stat-label';
        labelSpan.textContent = 'Category';
        const valueSpan = document.createElement('span');
        valueSpan.className = 'challenge-stat-value';
        valueSpan.textContent = challenge.category;
        statDiv.appendChild(labelSpan);
        statDiv.appendChild(valueSpan);
        statsDiv.appendChild(statDiv);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'challenge-actions';
        const button = document.createElement('button');
        button.className = 'challenge-btn challenge-btn-primary';
        button.setAttribute('data-challenge-id', challenge.id);
        button.style.background = `linear-gradient(135deg, ${challenge.status === 'completed' ? '#FFC700, #E41B17' : '#00C2FF, #0E1E38'})`;
        button.textContent = challenge.status === 'completed' ? 'Retry Challenge' : 'Solve Challenge';
        actionsDiv.appendChild(button);
        
        card.appendChild(statusDiv);
        card.appendChild(headerDiv);
        card.appendChild(descP);
        card.appendChild(statsDiv);
        card.appendChild(actionsDiv);
        
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
        try {
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
        } catch (error) {
            console.error('Failed to parse challenge stats:', error.message);
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