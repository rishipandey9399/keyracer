/**
 * Key Racer - Challenge Modes
 * Handles the challenge mode selection and integration with the main race functionality
 */

// Set default active challenge
window.activeChallenge = 'Standard Race';
window.customTextInput = { value: '' };
window.raceModes = window.raceModes || {};

// Fix main.js startTest function directly
if (typeof window.fixStartRaceButton !== 'function') {
    window.fixStartRaceButton = function() {
        // Check if startTest function already exists in main.js
        if (typeof window.startTest === 'function') {
            console.log('Original startTest function found, no need to patch');
            return; // Function already exists, no need to modify
        }
        
        console.log('No startTest function found, patching is necessary');
        
        // Define window.startTest only if it doesn't exist
        window.startTest = async function() {
            console.log('Using patched startTest function from challenges.js');
            
            // Disable the button
            const startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.disabled = true;
            
            const resetBtn = document.getElementById('reset-btn');
            if (resetBtn) resetBtn.disabled = false;
            
            // Get text based on active challenge
            let currentText = '';
            
            // Use custom text if appropriate
            if (window.activeChallenge === 'Custom Track') {
                const customInput = document.getElementById('custom-text-input');
                if (customInput && customInput.value.trim().length > 0) {
                    currentText = customInput.value.trim();
                } else {
                    // Fallback to random text
                    const difficulty = document.querySelector('.difficulty-btn.active')?.id || 'beginner';
                    if (window.typingTexts && window.typingTexts[difficulty]) {
                        const texts = window.typingTexts[difficulty];
                        currentText = texts[Math.floor(Math.random() * texts.length)];
                    } else {
                        currentText = 'This is a fallback text for the typing test.';
                    }
                }
            } else {
                // Get text based on difficulty
                const difficulty = document.querySelector('.difficulty-btn.active')?.id || 'beginner';
                if (window.typingTexts && window.typingTexts[difficulty]) {
                    const texts = window.typingTexts[difficulty];
                    currentText = texts[Math.floor(Math.random() * texts.length)];
                } else {
                    currentText = 'This is a fallback text for the typing test.';
                }
            }
            
            // Save to window for access by other functions
            window.currentText = currentText;
            
            // Display the text
            const textDisplay = document.getElementById('text-display');
            if (textDisplay) {
                textDisplay.innerHTML = '';
                
                // Create spans for each character
                for (let i = 0; i < currentText.length; i++) {
                    const span = document.createElement('span');
                    span.textContent = currentText[i];
                    textDisplay.appendChild(span);
                }
                
                // Highlight the first character
                if (textDisplay.firstChild) {
                    textDisplay.firstChild.classList.add('current');
                }
            }
            
            // Show race countdown
            try {
                if (typeof window.showRaceStartCountdown === 'function') {
                    await window.showRaceStartCountdown();
                } else {
                    console.log('Race countdown function not found, continuing without countdown');
                }
                
                // Enable input after countdown
                const textInput = document.getElementById('text-input');
                if (textInput) {
                    textInput.disabled = false;
                    textInput.focus();
                    textInput.value = '';
                    
                    // Set up input handler if it doesn't exist
                    if (!textInput._hasInputHandler) {
                        textInput.addEventListener('input', function() {
                            if (!window.handleInput && typeof window.handleInput !== 'function') {
                                // Simple input handler
                                const userInput = this.value;
                                const spans = textDisplay.querySelectorAll('span');
                                
                                spans.forEach(span => span.classList.remove('correct', 'incorrect', 'current'));
                                
                                for (let i = 0; i < userInput.length; i++) {
                                    if (i >= spans.length) break;
                                    
                                    if (userInput[i] === spans[i].textContent) {
                                        spans[i].classList.add('correct');
                                    } else {
                                        spans[i].classList.add('incorrect');
                                    }
                                }
                                
                                if (userInput.length < spans.length) {
                                    spans[userInput.length].classList.add('current');
                                }
                            }
                        });
                        textInput._hasInputHandler = true;
                    }
                }
                
                // Enable reset button
                if (resetBtn) resetBtn.disabled = false;
                
                // Start timer
                window.startTime = Date.now();
                window.timeLeft = 60; // 1 minute
                window.isTestActive = true;
                
                // Set up timer
                if (!window.timer) {
                    window.timer = setInterval(function() {
                        window.timeLeft--;
                        
                        const minutes = Math.floor(window.timeLeft / 60);
                        const seconds = window.timeLeft % 60;
                        
                        const minutesEl = document.getElementById('minutes');
                        const secondsEl = document.getElementById('seconds');
                        
                        if (minutesEl) minutesEl.textContent = minutes;
                        if (secondsEl) secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
                        
                        if (window.timeLeft <= 0) {
                            clearInterval(window.timer);
                            window.timer = null;
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error starting race:', error);
                
                // Fallback - enable input anyway
                const textInput = document.getElementById('text-input');
                if (textInput) {
                    textInput.disabled = false;
                    textInput.focus();
                }
                if (resetBtn) resetBtn.disabled = false;
            }
        };
    };
}

// Initialize challenge cards
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing challenge modes');
    
    // Get challenge cards
    const challengeCards = document.querySelectorAll('.challenge-card');
    if (challengeCards.length === 0) {
        console.log('No challenge cards found');
        return;
    }
    
    // Set initial active challenge from UI
    const activeCard = document.querySelector('.challenge-card.active');
    if (activeCard) {
        const challengeName = activeCard.querySelector('.challenge-name');
        if (challengeName) {
            window.activeChallenge = challengeName.textContent;
            console.log('Initial active challenge:', window.activeChallenge);
        }
    }
    
    // Show/hide custom text input based on initial selection
    if (window.activeChallenge === 'Custom Track') {
        const customTextContainer = document.getElementById('custom-text-container');
        if (customTextContainer) {
            customTextContainer.style.display = 'block';
        }
    }
    
    // Add click event listeners to challenge cards
    challengeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            challengeCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get challenge name
            const challengeName = this.querySelector('.challenge-name').textContent;
            window.activeChallenge = challengeName;
            console.log('Active challenge changed to:', window.activeChallenge);
            
            // Show/hide custom text input
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
    
    // Handle custom text input
    const customTextInput = document.getElementById('custom-text-input');
    const useCustomTextBtn = document.getElementById('use-custom-text');
    
    if (customTextInput && useCustomTextBtn) {
        useCustomTextBtn.addEventListener('click', function() {
            window.customTextInput = { value: customTextInput.value };
            console.log('Custom text updated');
        });
    }
    
    // Apply the race button fix - a small timeout ensures main.js has loaded
    setTimeout(function() {
        if (window.fixStartRaceButton) {
            window.fixStartRaceButton();
        }
    }, 200);
}); 