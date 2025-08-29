/**
 * Key Racer - Main Script (Rebuilt)
 * Handles the typing test functionality, challenge/difficulty selection, timer, stats, and results modal.
 */

// Check what page we're on (needed for proper script integration)
const isLessonsPage = window.location.href.includes('lessons.html');
const isMainPage = !isLessonsPage && (window.location.href.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'));

// Set up dummy variables for cross-page compatibility
if (isLessonsPage) {
    // Only needed for lessons page
    window.activeChallenge = 'Basic';
    window.customTextInput = { value: '' };
    window.raceModes = {};
    window.beginnerButton = null;
    window.intermediateButton = null;
    window.advancedButton = null;
}

// --- Typing Test State (single declaration) ---
let charsTyped = 0;
let errors = 0;
let wpm = 0;
let accuracy = 100;
let timer = null;

// --- Utility Functions ---
function $(selector) { return document.querySelector(selector); }
function $all(selector) { return document.querySelectorAll(selector); }

// DOM Elements
const textInput = $('#text-input');
const textDisplay = $('#text-display');
const startBtn = $('#start-btn');
const resetBtn = $('#reset-btn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const resultsOverlay = document.getElementById('results');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultErrors = document.getElementById('result-errors');
const aiFeedback = document.querySelector('#ai-feedback .analysis-content');
const testCompleteModal = document.querySelector('.test-complete-container');
const resultDetails = document.getElementById('result-details');
const retryButton = document.getElementById('retry-button');
const customTextContainer = document.getElementById('custom-text-container');
const customTextInput = document.getElementById('custom-text-input');
const useCustomTextBtn = document.getElementById('use-custom-text');

document.addEventListener('DOMContentLoaded', function() {
    try {
        // DOM Elements
        const textInput = document.getElementById('text-input');
        const startBtn = document.getElementById('start-btn');
        const resetBtn = document.getElementById('reset-btn');
        const retryButton = document.getElementById('retry-button');
        const customTextInput = document.getElementById('custom-text-input');
        const useCustomTextBtn = document.getElementById('use-custom-text');

        // --- Challenge & Difficulty Selection ---
        document.querySelectorAll('.challenge-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.challenge-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                window.activeChallenge = this.getAttribute('data-challenge');
                const customTextContainer = document.getElementById('custom-text-container');
                if (window.activeChallenge === 'custom') {
                    customTextContainer.style.display = 'block';
    } else {
                    customTextContainer.style.display = 'none';
                }
                resetTest();
            });
        });
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                window.currentDifficulty = this.id;
                resetTest();
            });
        });

        // --- Start/Reset Buttons ---
        if (startBtn) startBtn.addEventListener('click', startTest);
        if (resetBtn) resetBtn.addEventListener('click', resetTest);
        if (retryButton) retryButton.addEventListener('click', () => {
            const modal = document.querySelector('.test-complete-container');
            if (modal) modal.style.display = 'none';
            resetTest();
        });

        // --- Custom Text Button ---
        if (useCustomTextBtn) {
            useCustomTextBtn.addEventListener('click', () => {
                if (customTextInput.value.trim()) {
                    window.currentText = customTextInput.value.trim();
                    resetTest();
                }
            });
        }

        // --- Typing Input ---
        if (textInput) textInput.addEventListener('input', handleInput);

        // Initial reset
        resetTest();
        console.log('Typing test initialized successfully.');

        // Only remove animation/fade/slide classes and set opacity/visibility
        document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
            el.classList.remove('fade-in', 'slide-up');
            el.style.opacity = 1;
            el.style.visibility = 'visible';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
        document.body.classList.remove('content-hidden');

        // Add event listener for 'Back to Track' button in the results overlay (class 'close-results')
        const closeResultsBtn = document.querySelector('.close-results');
        if (closeResultsBtn) {
            closeResultsBtn.addEventListener('click', function() {
                const resultsOverlay = document.getElementById('results');
                if (resultsOverlay) resultsOverlay.style.display = 'none';
                resetTest();
            });
    }
    } catch (e) {
        console.error('Critical error during typing test initialization:', e);
    }
});

// Main typing test initialization function
function initializeTypingTest() {
    // Only run this on pages with the typing test
    if (!document.getElementById('typing-test') && !document.getElementById('text-display')) return;

    console.log('Main script initialized');
    
    // Force visibility of content on page load
    forceContentVisibility();
    
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const closeResultsButton = document.querySelector('.close-results');
    
    // Set up event listeners
    if (startButton) {
        startButton.addEventListener('click', startTest);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            clearInterval(window.timer);
            window.isTestActive = false;
            textInput.disabled = true;
            textInput.value = '';
            document.getElementById('text-display').innerHTML = '';
            document.getElementById('wpm').textContent = '0';
            document.getElementById('accuracy').textContent = '100';
            document.getElementById('errors').textContent = '0';
            document.getElementById('minutes').textContent = '1';
            document.getElementById('seconds').textContent = '00';
            startButton.disabled = false;
            resetButton.disabled = true;
        });
    }
    
    if (textInput) {
        textInput.addEventListener('input', handleInput);
    }
    
    if (closeResultsButton) {
        closeResultsButton.addEventListener('click', function() {
            const resultsSection = document.getElementById('results');
            if (resultsSection) resultsSection.classList.remove('show');
        });
    }
    
    // Set up challenge cards
    const challengeCards = document.querySelectorAll('.challenge-card');
    challengeCards.forEach(card => {
        card.addEventListener('click', function() {
            challengeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const challengeName = this.querySelector('.challenge-name').textContent;
            window.activeChallenge = challengeName;
            console.log('Active challenge:', window.activeChallenge);
            
            // Show/hide custom text area
            const customTextContainer = document.getElementById('custom-text-container');
            if (customTextContainer) {
                if (challengeName === 'Custom Track') {
                    customTextContainer.style.display = 'block';
                } else {
                    customTextContainer.style.display = 'none';
                }
            }
        });
    });
    
    // Initialize difficulty buttons
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            });
        });
    }

// Function to start the typing test
async function startTest() {
    console.log('Starting test...');
    
    // Get necessary elements
    const textInput = document.getElementById('text-input');
    const textDisplay = document.getElementById('text-display');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    
    if (!textInput || !textDisplay) {
        console.error('Required elements not found');
        return;
    }
    
    // Disable start button and enable reset button
    startButton.disabled = true;
    resetButton.disabled = false;
    
    // Get active challenge
    const activeChallengeElement = document.querySelector('.challenge-card.active .challenge-name');
    const currentChallenge = activeChallengeElement ? activeChallengeElement.textContent : 'Standard Race';
    console.log('Starting test with challenge:', currentChallenge);
    
    // Get active difficulty
    const activeDifficultyBtn = document.querySelector('.difficulty-btn.active');
    const difficulty = activeDifficultyBtn ? activeDifficultyBtn.id : 'beginner';
    console.log('Difficulty level:', difficulty);
    
    // Get text based on difficulty and challenge
    let currentText = '';
    
    // Check if it's custom track
    if (currentChallenge === 'Custom Track') {
        const customTextInput = document.getElementById('custom-text-input');
        if (customTextInput && customTextInput.value.trim()) {
            currentText = customTextInput.value.trim();
        } else {
            // Default text if custom track is empty
            currentText = "Please enter your custom text in the text area above. This is a default text since no custom text was provided.";
        }
    } else {
        // Use predefined texts
        if (window.typingTexts && window.typingTexts[difficulty]) {
            const texts = window.typingTexts[difficulty];
            const randomIndex = Math.floor(Math.random() * texts.length);
            currentText = texts[randomIndex];
        } else {
            // Fallback text if typingTexts not available
            currentText = "The quick brown fox jumps over the lazy dog. This is a fallback text since typingTexts are not available.";
        }
    }
    
    // Display the racing countdown animation
    try {
        if (window.showRaceStartCountdown) {
            await window.showRaceStartCountdown();
        }
    } catch (error) {
        console.error('Error showing race countdown:', error);
    }
    
    // Prepare text display with highlighted characters
    textDisplay.innerHTML = '';
    for (let i = 0; i < currentText.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = currentText[i];
        textDisplay.appendChild(charSpan);
    }
    
    // Focus and enable input
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    
    // Set test as active
    window.isTestActive = true;
    window.currentText = currentText;
    
    // Start timer
    window.timeLeft = 60; // 1 minute default
    if (currentChallenge === 'Time Trial') {
        window.timeLeft = 30; // 30 seconds for time trial
    } else if (currentChallenge === 'Marathon') {
        window.timeLeft = 180; // 3 minutes for marathon
    }
    
    // Update timer display
    const minutes = Math.floor(window.timeLeft / 60);
    const seconds = window.timeLeft % 60;
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    
    if (minutesDisplay) minutesDisplay.textContent = minutes;
    if (secondsDisplay) secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
    
    // Start counting down
    window.startTime = Date.now();
    window.timer = setInterval(updateTimer, 1000);
}

// Function to update the timer
function updateTimer() {
    if (!window.isTestActive) return;
    
    window.timeLeft--;
    
    const minutes = Math.floor(window.timeLeft / 60);
    const seconds = window.timeLeft % 60;
    
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    
    if (minutesDisplay) minutesDisplay.textContent = minutes;
    if (secondsDisplay) secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
    
    if (window.timeLeft <= 0) {
        endTest();
    }
}

// Function to handle user input during the test
    function handleInput() {
    if (!window.isTestActive) return;
    
    const textInput = document.getElementById('text-input');
    const textDisplay = document.getElementById('text-display');
    
    if (!textInput || !textDisplay) return;
    
        const userInput = textInput.value;
        const textSpans = textDisplay.querySelectorAll('span');
        
    let correctChars = 0;
    let errors = 0;
    
    // Process input
    for (let i = 0; i < userInput.length; i++) {
        // Check if we've reached the end of the text
        if (i >= textSpans.length) break;
        
        // Remove any existing classes
        textSpans[i].className = '';
        
        // Check if character is correct
            if (userInput[i] === textSpans[i].textContent) {
                textSpans[i].classList.add('correct');
            correctChars++;
            } else {
                textSpans[i].classList.add('incorrect');
            errors++;
        }
        }
        
    // Mark the current position
        if (userInput.length < textSpans.length) {
            textSpans[userInput.length].classList.add('current');
        }
        
    // Remove classes from characters not yet typed
    for (let i = userInput.length + 1; i < textSpans.length; i++) {
        textSpans[i].className = '';
    }
    
    // Calculate WPM
    const elapsedMinutes = (Date.now() - window.startTime) / 1000 / 60;
    const wpm = Math.round((userInput.length / 5) / Math.max(elapsedMinutes, 0.01));
    
    // Calculate accuracy
    const accuracy = Math.round((correctChars / Math.max(userInput.length, 1)) * 100);
    
    // Update metrics display
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const errorsDisplay = document.getElementById('errors');
    
    if (wpmDisplay) wpmDisplay.textContent = wpm;
    if (accuracyDisplay) accuracyDisplay.textContent = accuracy;
    if (errorsDisplay) errorsDisplay.textContent = errors;
    
    // Check if test is complete (all text typed)
    if (userInput.length === textSpans.length) {
        endTest();
    }
    }
    
    // Function to end the test
    function endTest() {
    // Stop the test
    window.isTestActive = false;
    clearInterval(window.timer);
    
    // Calculate elapsed time
    const endTime = Date.now();
    const elapsedMinutes = (endTime - window.startTime) / 1000 / 60; // in minutes
    
    // Get final metrics
    const textInput = document.getElementById('text-input');
    if (!textInput) return;
    
        const userInput = textInput.value;
    const inputLength = Math.min(userInput.length, window.currentText.length);
        
    // Count correct characters
        let correctChars = 0;
        for (let i = 0; i < inputLength; i++) {
        if (userInput[i] === window.currentText[i]) {
                correctChars++;
            }
        }
        
    // Calculate final metrics
    const wpm = Math.round((userInput.length / 5) / Math.max(elapsedMinutes, 0.01));
    const accuracy = Math.round((correctChars / Math.max(inputLength, 1)) * 100);
        const errors = inputLength - correctChars;
        
    // Create test record
        const testRecord = {
            wpm: wpm,
        accuracy: accuracy,
            errors: errors,
        textLength: window.currentText.length,
        charsTyped: userInput.length,
        completionTime: elapsedMinutes * 60, // in seconds
        difficulty: document.querySelector('.difficulty-btn.active')?.id || 'beginner',
        challenge: document.querySelector('.challenge-card.active .challenge-name')?.textContent || 'Standard Race',
            timestamp: new Date().toISOString(),
        username: localStorage.getItem('typingTestUser') || 'Guest'
        };
        
    console.log('Test completed:', testRecord);
        
    // Save test record if database is available
    if (window.typingDB) {
        window.typingDB.saveTypingRecord(testRecord)
        .then(id => {
            console.log('Test record saved with ID:', id);
            
            // Trigger real-time leaderboard update using the new system
            console.log('Triggering real-time leaderboard update from local save');
            if (window.realTimeLeaderboard) {
                window.realTimeLeaderboard.triggerUpdate(testRecord);
            } else if (window.updateLeaderboardRealTime) {
                // Fallback to old method
                window.updateLeaderboardRealTime(testRecord);
            } else {
                console.log('No real-time leaderboard system available');
            }
        })
        .catch(error => {
            console.error('Error saving test record:', error);
        });
    }
    
    // Submit to server leaderboard for all users
    console.log('Submitting to server leaderboard:', testRecord);
    console.log('Username from localStorage:', localStorage.getItem('typingTestUser'));
    fetch('/api/leaderboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testRecord)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Leaderboard submission response:', data);
        
        // Trigger real-time update after successful server submission
        if (window.realTimeLeaderboard) {
            console.log('Triggering real-time leaderboard update after server submission');
            setTimeout(() => {
                window.realTimeLeaderboard.triggerUpdate(testRecord);
            }, 1000);
        }
    })
    .catch(err => {
        console.error('Error submitting to leaderboard:', err);
    });

    // Show test results
    displayResults(testRecord);
}

// Function to update progress comparison
function updateProgressComparison(currentRecord, previousRecord) {
    // Create comparison element if it doesn't exist
    if (!document.getElementById('progress-comparison')) {
        const progressHistory = document.querySelector('.progress-history');
        const comparisonDiv = document.createElement('div');
        comparisonDiv.id = 'progress-comparison';
        comparisonDiv.className = 'progress-comparison';
        progressHistory.insertBefore(comparisonDiv, document.getElementById('history-chart'));
    }

    // Calculate improvements
    const wpmDiff = currentRecord.wpm - previousRecord.wpm;
    const accuracyDiff = currentRecord.accuracy - previousRecord.accuracy;
    const errorsDiff = previousRecord.errors - currentRecord.errors;

    // Display comparison
    document.getElementById('progress-comparison').innerHTML = `
        <h4>Progress Since Last Test</h4>
        <div class="comparison-grid">
            <div class="comparison-item ${wpmDiff >= 0 ? 'positive' : 'negative'}">
                <span class="comparison-label">WPM</span>
                <span class="comparison-value">${wpmDiff >= 0 ? '+' : ''}${wpmDiff}</span>
            </div>
            <div class="comparison-item ${accuracyDiff >= 0 ? 'positive' : 'negative'}">
                <span class="comparison-label">Accuracy</span>
                <span class="comparison-value">${accuracyDiff >= 0 ? '+' : ''}${accuracyDiff}%</span>
            </div>
            <div class="comparison-item ${errorsDiff >= 0 ? 'positive' : 'negative'}">
                <span class="comparison-label">Errors</span>
                <span class="comparison-value">${errorsDiff >= 0 ? '-' : '+'}${Math.abs(errorsDiff)}</span>
            </div>
        </div>
    `;
}

// Function to display the test results
function displayResults(testStats) {
    // Update result metrics
    const resultWpm = document.getElementById('result-wpm');
    const resultAccuracy = document.getElementById('result-accuracy');
    const resultErrors = document.getElementById('result-errors');
    if (resultWpm) resultWpm.textContent = testStats.wpm;
    if (resultAccuracy) resultAccuracy.textContent = testStats.accuracy;
    if (resultErrors) resultErrors.textContent = testStats.errors;
    // Show results modal
    const resultsSection = document.getElementById('results');
    if (resultsSection) resultsSection.style.display = 'flex';
}

// Function to create celebration effects for achievements
function createCelebration(achievements) {
    // Add confetti effect
    if (window.confetti) {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        // Simple alternative confetti
        const colors = ['#FF4A4A', '#00FFDD', '#FFD700'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), 4000);
        }
    }
    
    // Add achievement notification
    const achievementNames = {
        'speed': 'Speed Demon',
        'accuracy': 'Perfect Precision',
        'marathon': 'Marathon Runner'
    };
    
    let achievementHTML = '<div class="achievement-unlocked"><h4>🏆 Achievements Unlocked!</h4><ul>';
    achievements.forEach(achievement => {
        achievementHTML += `<li>${achievementNames[achievement] || achievement}</li>`;
    });
    achievementHTML += '</ul></div>';
    
    aiFeedbackElement.innerHTML += achievementHTML;
}

// Function to show test complete modal
function showTestCompleteModal(record) {
    const modal = document.querySelector('.test-complete-container');
    const resultDetails = document.getElementById('result-details');
    
    // Default to 'standard' mode if not specified
    const mode = record.mode || record.difficulty || 'standard';
    
    // Create result details
    let detailsHTML = `
        <div class="result-stat"><span>Speed:</span> <strong>${record.wpm.toFixed(1)} WPM</strong></div>
        <div class="result-stat"><span>Accuracy:</span> <strong>${record.accuracy.toFixed(1)}%</strong></div>
        <div class="result-stat"><span>Errors:</span> <strong>${record.errors}</strong></div>
        <div class="result-stat"><span>Time:</span> <strong>${record.completionTime.toFixed(1)}s</strong></div>
        <div class="result-stat"><span>Mode:</span> <strong>${mode.charAt(0).toUpperCase() + mode.slice(1)}</strong></div>
    `;
    
    // Add feedback based on performance
    let feedback = '';
    if (record.wpm > 80) {
        feedback = '<div class="feedback excellent">Excellent! Your typing speed is outstanding!</div>';
    } else if (record.wpm > 60) {
        feedback = '<div class="feedback great">Great job! Your typing speed is well above average.</div>';
    } else if (record.wpm > 40) {
        feedback = '<div class="feedback good">Good work! Your typing speed is above average.</div>';
    } else {
        feedback = '<div class="feedback keep-practicing">Keep practicing! Regular practice will improve your speed.</div>';
    }
    
    resultDetails.innerHTML = detailsHTML + feedback;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Add event listener to retry button
    document.getElementById('retry-button').addEventListener('click', function() {
        modal.style.display = 'none';
        resetTest();
    });
    
    // Also close when clicking outside the modal
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize FAQ functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class on the question
            this.classList.toggle('active');
            
            // Toggle the visibility of the answer
            const answer = this.nextElementSibling;
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                this.style.borderBottomLeftRadius = '0';
                // Change the + to - icon
                this.classList.add('open');
            } else {
                answer.style.maxHeight = '0px';
                this.style.borderBottomLeftRadius = '10px';
                // Change the - to + icon
                this.classList.remove('open');
            }
        });
    });
}

// Check if user is logged in
function checkLoginStatus() {
    try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('typingTestUserData');
        const username = localStorage.getItem('typingTestUser');
        
        if (userData && username) {
            // User is logged in
            console.log('User is logged in:', username);
            
            // Update UI elements if needed
            const userDisplay = document.getElementById('user-display');
            if (userDisplay) {
                userDisplay.textContent = username;
                userDisplay.style.display = 'inline-block';
            }
            
            // Show logged-in elements
            const loggedInElements = document.querySelectorAll('.logged-in-only');
            loggedInElements.forEach(el => el.style.display = 'block');
            
            // Hide logged-out elements
            const loggedOutElements = document.querySelectorAll('.logged-out-only');
            loggedOutElements.forEach(el => el.style.display = 'none');
            
            return true;
        } else {
            // User is not logged in
            console.log('User is not logged in');
            
            // Show logged-out elements
            const loggedOutElements = document.querySelectorAll('.logged-out-only');
            loggedOutElements.forEach(el => el.style.display = 'block');
            
            // Hide logged-in elements
            const loggedInElements = document.querySelectorAll('.logged-in-only');
            loggedInElements.forEach(el => el.style.display = 'none');
            
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

// Check if championship page
function checkChampionshipTab() {
    // Check if we're on the championship page
    const isChampionshipPage = window.location.href.includes('leaderboard.html');
    
    if (isChampionshipPage) {
        console.log('Championship page detected');
        
        // Make sure database is initialized
        if (!window.typingDB) {
            try {
                console.log('Initializing database for championship...');
                window.typingDB = new TypingDatabase();
            } catch (error) {
                console.error('Error initializing database for championship:', error);
            }
        }
        
        // Load leaderboard data if available
        if (typeof loadLeaderboardData === 'function') {
            setTimeout(() => {
                loadLeaderboardData();
            }, 1000);
        } else {
            console.log('Leaderboard function not available');
        }
    }
}

/**
 * Display race start countdown with racing lights
 * @returns {Promise} - Resolves when countdown is complete
 */
function showRaceStartCountdown() {
    return new Promise((resolve) => {
        // Create race start lights element if it doesn't exist
        let raceStartLights = document.querySelector('.race-start-lights');
        
        if (!raceStartLights) {
            raceStartLights = document.createElement('div');
            raceStartLights.className = 'race-start-lights';
            
            const lightsContainer = document.createElement('div');
            lightsContainer.className = 'lights-container';
            
            // Create three lights
            for (let i = 0; i < 3; i++) {
                const light = document.createElement('div');
                light.className = 'light';
                lightsContainer.appendChild(light);
            }
            
            const countdownNumber = document.createElement('div');
            countdownNumber.className = 'countdown-number';
            
            raceStartLights.appendChild(lightsContainer);
            raceStartLights.appendChild(countdownNumber);
            document.body.appendChild(raceStartLights);
        }
        
        const lights = raceStartLights.querySelectorAll('.light');
        const countdownNumber = raceStartLights.querySelector('.countdown-number');
        
        // Show the lights container
        raceStartLights.classList.add('active');
        
        // Countdown sequence
        let count = 3;
        
        // Function to update countdown
        function updateCountdown() {
            // Clear previous state
            lights.forEach(light => light.classList.remove('active', 'green'));
            countdownNumber.textContent = count;
            countdownNumber.classList.add('visible');
            
            if (count > 0) {
                // Light up the appropriate number of red lights
                for (let i = 0; i < count; i++) {
                    lights[i].classList.add('active');
                }
                
                count--;
                setTimeout(updateCountdown, 1000);
            } else {
                // Show GO!
                countdownNumber.textContent = 'GO!';
                countdownNumber.style.color = '#00FF00';
                countdownNumber.classList.add('go-text');
                
                // Turn all lights green
                lights.forEach(light => {
                    light.classList.remove('active');
                    light.classList.add('green');
                });
                
                // Hide after a delay
                setTimeout(() => {
                    raceStartLights.classList.remove('active');
                    countdownNumber.classList.remove('visible', 'go-text');
                    countdownNumber.style.color = '';
                    lights.forEach(light => light.classList.remove('green'));
                    resolve();
                }, 1000);
            }
        }
        
        // Start the countdown
        updateCountdown();
    });
}

// Export function for use in other scripts
window.showRaceStartCountdown = showRaceStartCountdown; 

function forceContentVisibility() {
    // Reveal all main content containers
    const selectors = [
        '.main-content', '.container', 'main', 'header', 'section', 
        '.race-track', '.keyboard-container', '.championship-header',
        '.filters-section', '.podium-section', '.leaderboard-section',
        '.your-standings', '.lesson-selector', '.lesson-category',
        '.lesson-grid', '.lesson-card', '.nav-section', '.feature-tabs',
        '.tab', '.logo-section', '.logo-heading', '.header-text'
    ];
    
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.display = el.tagName === 'SECTION' ? 'block' : '';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    });
    
    // Ensure all text is visible
    document.querySelectorAll('h1, h2, h3, h4, p, span, a, button').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Remove any classes that might hide content
    document.body.classList.remove('content-hidden');
    
    // Force display for specific elements
    const specificElements = document.querySelectorAll('.header-container, .logo-section, .nav-section');
    specificElements.forEach(el => {
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
}

// Add CSS for feedback if not present
if (!document.getElementById('typing-feedback-style')) {
    const style = document.createElement('style');
    style.id = 'typing-feedback-style';
    style.textContent = `
        #text-display span.correct { color: #4CAF50; }
        #text-display span.incorrect { color: #FF5252; }
        #text-display span.current { border-bottom: 2px solid #FFC700; }
    `;
    document.head.appendChild(style);
}

function renderTextDisplay(text) {
    const textDisplay = document.getElementById('text-display');
    if (!textDisplay) return;
    textDisplay.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        textDisplay.appendChild(span);
    }
}

// --- Add global resetTest function ---
function resetTest() {
    const textInput = document.getElementById('text-input');
    const textDisplay = document.getElementById('text-display');
    if (textInput) {
        textInput.value = '';
        textInput.disabled = true;
    }
    if (textDisplay) {
        textDisplay.innerHTML = '';
    }
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const errorsDisplay = document.getElementById('errors');
    if (wpmDisplay) wpmDisplay.textContent = '0';
    if (accuracyDisplay) accuracyDisplay.textContent = '100';
    if (errorsDisplay) errorsDisplay.textContent = '0';
    const modal = document.querySelector('.test-complete-container');
    if (modal) modal.style.display = 'none';
    const resultsOverlay = document.getElementById('results');
    if (resultsOverlay) resultsOverlay.style.display = 'none';
    // Enable Start, disable Reset
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    if (startBtn) startBtn.disabled = false;
    if (resetBtn) resetBtn.disabled = true;
}