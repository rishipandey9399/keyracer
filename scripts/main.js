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
    
    // Check for race intro flag
    const shouldShowRaceIntro = localStorage.getItem('showRaceIntro') === 'true';
    if (shouldShowRaceIntro) {
        // Clear the flag so it only shows once
        localStorage.removeItem('showRaceIntro');
        // Show the race intro with a slight delay to ensure page is loaded
        setTimeout(() => {
            showRaceIntro();
        }, 500);
    }
    
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
    
    // User authentication check
    const currentUser = localStorage.getItem('typingTestUser');
    const userType = localStorage.getItem('typingTestUserType') || 'guest';
    
    if (!currentUser) {
        // Redirect to login if no user
        window.location.href = 'login.html';
        return;
    } else {
        // Create user header
        let userHeader = document.createElement('div');
        userHeader.className = 'user-header';
        
        // Display user info and logout button
        userHeader.innerHTML = `
            <div class="user-info">
                <span class="user-name">${userType === 'guest' ? 'Guest User' : currentUser}</span>
                <span class="user-badge ${userType}">${userType}</span>
            </div>
            <button id="logout-btn" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        document.querySelector('header').appendChild(userHeader);
        
        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('typingTestUser');
            localStorage.removeItem('typingTestUserType');
            window.location.href = 'login.html';
        });
    }
    
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
        
        // Update speedometer dial based on WPM
        updateSpeedometerDial(wpm);
        
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
        
        // Update charts if live statistics is enabled
        if (document.getElementById('live-stats-toggle').checked && window.chartFunctions) {
            window.chartFunctions.updateWPMChart(wpm, currentTime - startTime);
        }
        
        // Highlight keys on the virtual keyboard
        if (userInput.length > 0) {
            const lastChar = userInput[userInput.length - 1];
            if (window.keyboardFunctions) {
                window.keyboardFunctions.highlightKey(lastChar);
            }
        }
    }
    
    // Function to update speedometer dial
    function updateSpeedometerDial(wpm) {
        const maxWPM = 150; // Maximum WPM for full rotation
        const rotationPercentage = Math.min(wpm / maxWPM, 1);
        const rotationDegrees = -90 + (rotationPercentage * 180);
        
        const speedometerDial = document.querySelector('.speedometer-dial');
        if (speedometerDial) {
            speedometerDial.style.transform = `rotate(${rotationDegrees}deg)`;
        }
    }
    
    // Function to update result speedometer
    function updateResultSpeedometer(wpm) {
        const maxWPM = 150; // Maximum WPM for full rotation
        const rotationPercentage = Math.min(wpm / maxWPM, 1);
        const rotationDegrees = -90 + (rotationPercentage * 180);
        
        const resultSpeedometerDial = document.querySelector('.result-speedometer .speedometer-dial');
        if (resultSpeedometerDial) {
            resultSpeedometerDial.style.transform = `rotate(${rotationDegrees}deg)`;
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
    
    // Function to create and display race start lights
    function showRaceStartLights() {
        return new Promise((resolve) => {
            // Create the race start lights if they don't exist
            if (!document.querySelector('.race-start-lights')) {
                const raceStartLights = document.createElement('div');
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
            
            const raceStartLights = document.querySelector('.race-start-lights');
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
    
    // Function to show race intro animation
    function showRaceIntro() {
        return new Promise((resolve) => {
            // Create the race intro elements if they don't exist
            if (!document.querySelector('.race-intro')) {
                const raceIntro = document.createElement('div');
                raceIntro.className = 'race-intro';
                
                const track = document.createElement('div');
                track.className = 'race-intro-track';
                
                // Add track lines
                for (let i = 0; i < 10; i++) {
                    const line = document.createElement('div');
                    line.className = 'track-line';
                    line.style.top = `${i * 30}px`;
                    track.appendChild(line);
                }
                
                // Add cars
                const car1 = document.createElement('div');
                car1.className = 'race-intro-car';
                
                const car2 = document.createElement('div');
                car2.className = 'race-intro-car player';
                
                const text = document.createElement('div');
                text.className = 'race-intro-text';
                text.textContent = 'KEY RACER';
                
                raceIntro.appendChild(track);
                raceIntro.appendChild(car1);
                raceIntro.appendChild(car2);
                raceIntro.appendChild(text);
                
                document.body.appendChild(raceIntro);
            }
            
            const raceIntro = document.querySelector('.race-intro');
            raceIntro.classList.add('active');
            
            // Hide intro after animation completes
            setTimeout(() => {
                raceIntro.classList.remove('active');
                resolve();
            }, 4000);
        });
    }
    
    // Function to start the test
    function startTest() {
        // Show countdown first
        showRaceStartLights().then(() => {
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
            
            // Pause background animation
            document.body.classList.add('race-active');
            
            // Disable level selection during test
            [beginnerButton, intermediateButton, advancedButton].forEach(button => {
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.6';
            });
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
        
        // Resume background animation
        document.body.classList.remove('race-active');
        
        // Calculate final metrics
        endTime = Date.now();
        const totalTime = endTime - startTime;
        
        // Analyze the typing data
        const typingData = {
            text: currentText,
            userInput: textInput.value,
            keyTimings: keyTimestamps
        };
        
        // Generate stats and display results
        if (window.aiFeedback) {
            const testStats = window.aiFeedback.analyzeTypingData(typingData, totalTime);
            
            // Save to database if available
            const currentUser = localStorage.getItem('typingTestUser');
            if (currentUser && window.typingDB) {
                // Get previous record for comparison
                window.typingDB.getLastRecord(currentUser).then(lastRecord => {
                    // Save current record
                    const record = {
                        username: currentUser,
                        wpm: testStats.wpm,
                        accuracy: testStats.accuracy,
                        errors: testStats.errors,
                        difficulty: currentDifficulty,
                        mode: window.modesFunctions ? window.modesFunctions.getCurrentMode() : 'standard',
                        timestamp: new Date().toISOString(),
                        completionTime: Math.round((totalTime / 1000) * 10) / 10 // Add completion time in seconds with 1 decimal place
                    };
                    
                    // Show completion modal
                    showTestCompleteModal(record);
                    
                    window.typingDB.saveTypingRecord(record).then(async () => {
                        // Display last record for comparison
                        const lastRecord = await window.typingDB.getLastRecord(currentUser);
                        if(lastRecord && lastRecord.id !== record.id) {
                            const improvement = record.wpm - lastRecord.wpm;
                            if(improvement > 0) {
                                // Show improvement message
                                showMessage(`Great job! You improved by ${improvement.toFixed(1)} WPM compared to your last test.`, 'success');
                            }
                        }
                        
                        // Update charts
                        updateCharts();
                    }).catch(error => {
                        console.error('Error saving record:', error);
                    });
                }).catch(error => {
                    console.error('Error accessing database:', error);
                    // Fallback - show results without comparison
                    displayResults(testStats);
                });
            } else {
                // Fallback if no user or DB not available
                displayResults(testStats);
            }
        } else {
            // Minimal fallback if AI feedback not available
            const wpm = Math.round((textInput.value.length / 5) / (totalTime / 60000));
            const testStats = { wpm, accuracy: 100, errors: 0 };
            displayResults(testStats);
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
    resultWpm.textContent = testStats.wpm;
    resultAccuracy.textContent = testStats.accuracy;
    resultErrors.textContent = testStats.errors;
    
    // Update result speedometer
    updateResultSpeedometer(testStats.wpm);
    
    // Generate AI feedback if available
    if (window.aiFeedback) {
        const feedback = window.aiFeedback.generateAIFeedback(testStats);
        aiFeedbackElement.innerHTML = feedback;
    }
    
    // Check achievements if available
    if (window.achievementFunctions) {
        const achievements = window.achievementFunctions.checkAchievements(testStats);
        if (achievements.length > 0) {
            // Create a celebratory effect
            createCelebration(achievements);
        }
    }
    
    // Show results modal
    resultsSection.style.display = 'flex';
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
    
    // Create result details
    let detailsHTML = `
        <div class="result-stat"><span>Speed:</span> <strong>${record.wpm.toFixed(1)} WPM</strong></div>
        <div class="result-stat"><span>Accuracy:</span> <strong>${record.accuracy.toFixed(1)}%</strong></div>
        <div class="result-stat"><span>Errors:</span> <strong>${record.errors}</strong></div>
        <div class="result-stat"><span>Time:</span> <strong>${record.completionTime}s</strong></div>
        <div class="result-stat"><span>Mode:</span> <strong>${record.mode.charAt(0).toUpperCase() + record.mode.slice(1)}</strong></div>
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

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize typing test
    initTypingTest();
    
    // Initialize charts
    if (window.chartFunctions) {
        window.chartFunctions.initCharts();
    }
    
    // Initialize FAQ
    initFAQ();
    
    // Get test difficulty
    updateSelectedDifficulty();
}); 