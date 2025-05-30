// Different testing modes functionality
let currentDifficulty = 'beginner'; // This should be accessible to other scripts

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab');
    const customTextContainer = document.getElementById('custom-text-container');
    const customTextInput = document.getElementById('custom-text-input');
    const useCustomTextButton = document.getElementById('use-custom-text');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    
    // State variables
    let currentMode = 'standard';
    let customTypingText = null;
    let isTestActive = false; // This will be updated by main.js
    
    // Make isTestActive accessible from main.js
    window.updateTestActiveStatus = (status) => {
        isTestActive = status;
    };
    
    // Setup tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Only change mode if test is not active
            if (!isTestActive) {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Set current mode
                currentMode = button.dataset.mode;
                
                // Handle mode change
                handleModeChange();
                
                // Trigger reset of the test
                if (window.resetTest) {
                    window.resetTest();
                }
            }
        });
    });
    
    // Handle mode change
    function handleModeChange() {
        // Hide/show custom text input
        customTextContainer.style.display = currentMode === 'custom' ? 'block' : 'none';
        
        let newTimeLeft = 60; // Default time
        
        // Update timer based on mode
        if (currentMode === 'timed') {
            // For timed challenge, set to 30 seconds
            newTimeLeft = 30;
            minutesDisplay.textContent = '0';
            secondsDisplay.textContent = '30';
        } else if (currentMode === 'marathon') {
            // For marathon, set to 5 minutes
            newTimeLeft = 300;
            minutesDisplay.textContent = '5';
            secondsDisplay.textContent = '00';
        } else {
            // Default 1 minute for other modes
            newTimeLeft = 60;
            minutesDisplay.textContent = '1';
            secondsDisplay.textContent = '00';
        }
        
        // Update timeLeft in main.js if the function exists
        if (window.updateTimeLeft) {
            window.updateTimeLeft(newTimeLeft);
        }
    }
    
    // Handle custom text submission
    useCustomTextButton.addEventListener('click', () => {
        const customText = customTextInput.value.trim();
        if (customText.length > 10) {
            // Store the custom text
            customTypingText = customText;
            
            // If displayText function is available, use it
            if (window.displayText) {
                window.displayText(customText);
            }
            
            // Reset the test if function is available
            if (window.resetTest) {
                window.resetTest();
            }
        } else {
            alert('Please enter at least 10 characters for your custom text.');
        }
    });
    
    // Function to get text based on current mode and difficulty
    function getTextForMode() {
        if (currentMode === 'custom' && customTypingText) {
            return customTypingText;
        } else if (window.typingTexts && window.typingTexts[currentDifficulty]) {
            const texts = window.typingTexts[currentDifficulty];
            const randomIndex = Math.floor(Math.random() * texts.length);
            return texts[randomIndex];
        } else {
            // Fallback
            return "This is a fallback text when no other text is available. Please check if typingTexts is properly loaded.";
        }
    }
    
    // Export functions for use in main.js
    window.modesFunctions = {
        getTextForMode,
        getCurrentMode: () => currentMode,
        setCurrentDifficulty: (difficulty) => { currentDifficulty = difficulty; }
    };
});

// Function to create confetti effect for achievements
function createConfetti() {
    const confettiCount = 100;
    const container = document.querySelector('body');
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Randomize confetti properties
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Function to check achievements
function checkAchievements(testStats) {
    const achievements = [];
    const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    
    // Speed achievements
    if (testStats.wpm >= 60 && !unlockedAchievements.includes('speed')) {
        achievements.push('speed');
        document.getElementById('achievement-speed').classList.add('unlocked');
        unlockedAchievements.push('speed');
    }
    if (testStats.wpm >= 100 && !unlockedAchievements.includes('speedMaster')) {
        achievements.push('speedMaster');
        document.getElementById('achievement-speedMaster').classList.add('unlocked');
        unlockedAchievements.push('speedMaster');
    }
    
    // Accuracy achievements
    if (testStats.accuracy === 100 && !unlockedAchievements.includes('accuracy')) {
        achievements.push('accuracy');
        document.getElementById('achievement-accuracy').classList.add('unlocked');
        unlockedAchievements.push('accuracy');
    }
    if (testStats.accuracy >= 95 && testStats.wpm >= 80 && !unlockedAchievements.includes('precisionMaster')) {
        achievements.push('precisionMaster');
        document.getElementById('achievement-precisionMaster').classList.add('unlocked');
        unlockedAchievements.push('precisionMaster');
    }
    
    // Consistency achievements
    if (testStats.consistencyScore >= 90 && !unlockedAchievements.includes('consistency')) {
        achievements.push('consistency');
        document.getElementById('achievement-consistency').classList.add('unlocked');
        unlockedAchievements.push('consistency');
    }
    
    // Practice achievements
    const testCount = JSON.parse(localStorage.getItem('typingHistory') || '[]').length;
    if (testCount >= 5 && !unlockedAchievements.includes('marathon')) {
        achievements.push('marathon');
        document.getElementById('achievement-marathon').classList.add('unlocked');
        unlockedAchievements.push('marathon');
    }
    if (testCount >= 20 && !unlockedAchievements.includes('typingMaster')) {
        achievements.push('typingMaster');
        document.getElementById('achievement-typingMaster').classList.add('unlocked');
        unlockedAchievements.push('typingMaster');
    }
    
    // Save unlocked achievements
    if (achievements.length > 0) {
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
        createConfetti();
    }
    
    return achievements;
}

// Function to load achievements on page load
function loadAchievements() {
    const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    unlockedAchievements.forEach(achievement => {
        const element = document.getElementById(`achievement-${achievement}`);
        if (element) {
            element.classList.add('unlocked');
        }
    });
}

// Call loadAchievements when the page loads
document.addEventListener('DOMContentLoaded', loadAchievements);

// Export achievement functions
if (typeof window !== 'undefined') {
    window.achievementFunctions = {
        checkAchievements
    };
} 