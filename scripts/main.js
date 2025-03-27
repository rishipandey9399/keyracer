// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textDisplay = document.getElementById('text-display');
    const textInput = document.getElementById('text-input');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const errorsDisplay = document.getElementById('errors');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const resultsSection = document.getElementById('results');
    const resultWpm = document.getElementById('result-wpm');
    const resultAccuracy = document.getElementById('result-accuracy');
    const resultErrors = document.getElementById('result-errors');
    const closeResultsButton = document.getElementById('close-results');
    const aiFeedbackElement = document.getElementById('ai-feedback').querySelector('.feedback-content');
    
    // Level selector elements
    const beginnerButton = document.getElementById('beginner');
    const intermediateButton = document.getElementById('intermediate');
    const advancedButton = document.getElementById('advanced');
    
    // State variables
    let currentDifficulty = 'beginner';
    let currentText = '';
    let timer = null;
    let startTime = 0;
    let endTime = 0;
    let timeLeft = 60; // Default 1 minute
    let keyTimestamps = [];
    let isTestActive = false;
    
    // Setup level buttons
    [beginnerButton, intermediateButton, advancedButton].forEach(button => {
        button.addEventListener('click', () => {
            // Only change level if test is not active
            if (!isTestActive) {
                // Remove active class from all buttons
                [beginnerButton, intermediateButton, advancedButton].forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Set current difficulty
                currentDifficulty = button.id;
                
                // Reset the test
                resetTest();
            }
        });
    });
    
    // Function to get a random text based on difficulty
    function getRandomText() {
        const texts = typingTexts[currentDifficulty];
        const randomIndex = Math.floor(Math.random() * texts.length);
        return texts[randomIndex];
    }
    
    // Function to display the text
    function displayText(text) {
        textDisplay.innerHTML = '';
        
        // Create spans for each character
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            textDisplay.appendChild(span);
        }
        
        // Highlight the first character
        if (textDisplay.firstChild) {
            textDisplay.firstChild.classList.add('current');
        }
    }
    
    // Function to update the timer
    function updateTimer() {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        minutesDisplay.textContent = minutes;
        secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }
    
    // Function to update metrics during the test
    function updateMetrics() {
        if (!startTime || !isTestActive) return;
        
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000 / 60; // in minutes
        
        // Get user input
        const userInput = textInput.value;
        const inputWords = userInput.length / 5; // standard WPM calculation
        
        // Calculate WPM
        const wpm = Math.round(inputWords / elapsedTime || 0);
        wpmDisplay.textContent = wpm;
        
        // Calculate accuracy
        let correctChars = 0;
        const inputLength = Math.min(userInput.length, currentText.length);
        
        for (let i = 0; i < inputLength; i++) {
            if (userInput[i] === currentText[i]) {
                correctChars++;
            }
        }
        
        const accuracy = Math.round((correctChars / (inputLength || 1)) * 100);
        accuracyDisplay.textContent = `${accuracy}%`;
        
        // Calculate errors
        const errors = inputLength - correctChars;
        errorsDisplay.textContent = errors;
        
        // Highlight keys on the virtual keyboard
        if (userInput.length > 0) {
            const lastChar = userInput[userInput.length - 1];
            if (window.keyboardFunctions) {
                window.keyboardFunctions.highlightKey(lastChar);
            }
        }
    }
    
    // Function to handle user input
    function handleInput() {
        const userInput = textInput.value;
        const textSpans = textDisplay.querySelectorAll('span');
        
        // Record timestamp for this keystroke
        keyTimestamps.push(Date.now());
        
        // Reset classes
        textSpans.forEach(span => {
            span.classList.remove('correct', 'incorrect', 'current');
        });
        
        // Apply appropriate classes
        for (let i = 0; i < userInput.length; i++) {
            if (i >= textSpans.length) break;
            
            if (userInput[i] === textSpans[i].textContent) {
                textSpans[i].classList.add('correct');
            } else {
                textSpans[i].classList.add('incorrect');
            }
        }
        
        // Highlight current character
        if (userInput.length < textSpans.length) {
            textSpans[userInput.length].classList.add('current');
        }
        
        // Check if user completed the text
        if (userInput.length === currentText.length) {
            endTest();
        }
        
        // Update metrics
        updateMetrics();
    }
    
    // Function to start the test
    function startTest() {
        // Reset previous state
        resetTest();
        
        // Set up the new test
        currentText = getRandomText();
        displayText(currentText);
        
        // Enable textarea
        textInput.disabled = false;
        textInput.value = '';
        textInput.focus();
        
        // Start timer
        startTime = Date.now();
        keyTimestamps = [startTime];
        timer = setInterval(updateTimer, 1000);
        
        // Update buttons
        startButton.disabled = true;
        resetButton.disabled = false;
        
        // Set test as active
        isTestActive = true;
        
        // Disable level selection during test
        [beginnerButton, intermediateButton, advancedButton].forEach(button => {
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.6';
        });
    }
    
    // Function to end the test
    function endTest() {
        // Clear timer
        clearInterval(timer);
        
        // Disable textarea
        textInput.disabled = true;
        
        // Update buttons
        startButton.disabled = false;
        resetButton.disabled = false;
        
        // Calculate final metrics
        endTime = Date.now();
        const totalTime = endTime - startTime;
        
        // Analyze the typing data
        const typingData = {
            text: currentText,
            userInput: textInput.value,
            keyTimings: keyTimestamps
        };
        
        // Generate stats and AI feedback
        if (window.aiFeedback) {
            const testStats = window.aiFeedback.analyzeTypingData(typingData, totalTime);
            
            // Display results
            resultWpm.textContent = testStats.wpm;
            resultAccuracy.textContent = testStats.accuracy;
            resultErrors.textContent = testStats.errors;
            
            // Generate AI feedback
            const feedback = window.aiFeedback.generateAIFeedback(testStats);
            aiFeedbackElement.innerHTML = feedback;
            
            // Show results modal
            resultsSection.style.display = 'flex';
        }
        
        // Set test as inactive
        isTestActive = false;
        
        // Re-enable level selection
        [beginnerButton, intermediateButton, advancedButton].forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });
        
        // Clear keyboard highlights
        if (window.keyboardFunctions) {
            window.keyboardFunctions.clearKeyHighlights();
        }
    }
    
    // Function to reset the test
    function resetTest() {
        // Clear timer
        clearInterval(timer);
        
        // Reset timer display
        timeLeft = 60;
        minutesDisplay.textContent = '1';
        secondsDisplay.textContent = '00';
        
        // Reset metrics
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100%';
        errorsDisplay.textContent = '0';
        
        // Reset text display
        textDisplay.innerHTML = '';
        
        // Reset textarea
        textInput.value = '';
        textInput.disabled = true;
        
        // Reset buttons
        startButton.disabled = false;
        resetButton.disabled = true;
        
        // Reset test state
        isTestActive = false;
        
        // Clear keyboard highlights
        if (window.keyboardFunctions) {
            window.keyboardFunctions.clearKeyHighlights();
        }
    }
    
    // Event listeners
    startButton.addEventListener('click', startTest);
    resetButton.addEventListener('click', resetTest);
    textInput.addEventListener('input', handleInput);
    closeResultsButton.addEventListener('click', () => {
        resultsSection.style.display = 'none';
    });
    
    // Initialize
    resetTest();
}); 