// Challenges page initialization and event handlers
let challengesManager;

document.addEventListener('DOMContentLoaded', () => {
    challengesManager = new EnhancedChallengesManager();
    window.challengesManager = challengesManager;
    
    // Check for completed challenge and refresh status
    const completedChallenge = localStorage.getItem('challengeCompleted');
    if (completedChallenge) {
        const completionData = JSON.parse(completedChallenge);
        localStorage.removeItem('challengeCompleted');
        
        // Set language if provided in completion data
        if (completionData.language) {
            challengesManager.currentLanguage = completionData.language;
            localStorage.setItem('selectedLanguage', completionData.language);
            challengesManager.setActiveLanguageTab(completionData.language);
            
            // Load challenges for the correct language
            challengesManager.showDemoData(completionData.language).then(() => {
                challengesManager.renderChallenges();
            });
        } else {
            // Refresh challenges to update button status
            setTimeout(() => {
                challengesManager.updateChallengeStatusFromLocalStorage();
                challengesManager.renderChallenges();
            }, 100);
        }
    }
    
    // Show tips modal for first-time users
    if (!localStorage.getItem('challengesTipsShown')) {
        setTimeout(() => {
            document.getElementById('tipsModal').style.display = 'flex';
        }, 1000);
    }
    
    // Add event listener for close tips button
    document.getElementById('closeTipsBtn').addEventListener('click', closeTipsModal);
    
    // Only clear URL parameters if they don't contain language info
    if (window.location.search && !window.location.search.includes('lang=')) {
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
    }
});

function closeTipsModal() {
    document.getElementById('tipsModal').style.display = 'none';
    localStorage.setItem('challengesTipsShown', 'true');
}