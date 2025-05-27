/**
 * Key Racer - Typing Lessons
 * This script handles the typing lessons, tricky keys practice, and bigram blitz functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Lessons script loaded');
    
    // Check for database availability
    checkDatabaseConnection();
    
    // Reset progress for all tricky lessons to ensure they start at 0%
    document.querySelectorAll('.lesson-card[data-type^="tricky-"] .progress').forEach(function(progressBar) {
        progressBar.style.width = '0%';
    });
    
    document.querySelectorAll('.lesson-card[data-type^="tricky-"] .lesson-progress span').forEach(function(progressText) {
        progressText.textContent = '0% Mastered';
    });
    
    // Initialize lessons data
    initLessonsModule();
});

/**
 * Check database connection and initialize if needed
 */
function checkDatabaseConnection() {
    if (window.typingDB) {
        console.log('Database already initialized for lessons module');
        // Load user progress from database
        loadUserProgress();
    } else {
        try {
            console.log('Initializing database for lessons module...');
            window.typingDB = new TypingDatabase();
            // Set a timer to wait for database initialization
            setTimeout(loadUserProgress, 1000);
        } catch (error) {
            console.error('Error initializing database for lessons:', error);
            // Create fallback database functionality
            window.typingDB = {
                saveUserProgress: (username, progressData) => {
                    console.log('Using fallback saveUserProgress for:', username);
                    // Save to localStorage instead
                    localStorage.setItem('lessonProgress', JSON.stringify(progressData));
                    return Promise.resolve(true);
                },
                getUserProgress: (username) => {
                    console.log('Using fallback getUserProgress for:', username);
                    // Try to get from localStorage
                    const data = localStorage.getItem('lessonProgress');
                    return Promise.resolve(data ? JSON.parse(data) : {});
                }
            };
        }
    }
}

/**
 * Load user progress from database or localStorage
 */
async function loadUserProgress() {
    try {
        // Get current user from localStorage - fixed to use consistent key
        const currentUser = localStorage.getItem('typingTestUser');
        
        if (currentUser && window.typingDB) {
            console.log('Loading progress for user:', currentUser);
            
            // Try to get user progress from database
            const progress = await window.typingDB.getUserProgress(currentUser);
            
            if (progress && Object.keys(progress).length > 0) {
                console.log('Progress loaded from database:', progress);
                updateProgressUI(progress);
            } else {
                // Fallback to localStorage
                const localProgress = localStorage.getItem('lessonProgress');
                if (localProgress) {
                    updateProgressUI(JSON.parse(localProgress));
                }
            }
        } else {
            // Not logged in or no database, try localStorage
            const localProgress = localStorage.getItem('lessonProgress');
            if (localProgress) {
                updateProgressUI(JSON.parse(localProgress));
            }
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
    }
}

/**
 * Update UI with progress data
 */
function updateProgressUI(progressData) {
    if (!progressData) return;
    
    Object.keys(progressData).forEach(lessonType => {
        const progressPercentage = progressData[lessonType];
        const lessonCard = document.querySelector(`.lesson-card[data-type="${lessonType}"]`);
        
        if (lessonCard) {
            const progressBar = lessonCard.querySelector('.progress');
            const progressText = lessonCard.querySelector('.lesson-progress span');
            
            if (progressBar) progressBar.style.width = `${progressPercentage}%`;
            if (progressText) progressText.textContent = `${progressPercentage}% Mastered`;
        }
    });
}

/**
 * Main lessons module initialization
 */
function initLessonsModule() {
    // Create data structure for lessons
    const lessonData = {
        beginner: [
            {
                id: 'home-row',
                title: 'Home Row Basics',
                description: 'Master the foundation of touch typing with the home row keys.',
                text: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
                tips: [
                    'Keep your fingers on the home row keys',
                    'Use the correct finger for each key',
                    'Maintain proper posture'
                ]
            },
            {
                id: 'top-row',
                title: 'Top Row Introduction',
                description: 'Learn to reach up to the top row while maintaining home row position.',
                text: 'qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop',
                tips: [
                    'Keep your fingers on home row when not typing',
                    'Reach up with the correct finger',
                    'Return to home row after each key'
                ]
            },
            {
                id: 'bottom-row',
                title: 'Bottom Row Basics',
                description: 'Master reaching down to the bottom row keys.',
                text: 'zxcv nm,. zxcv nm,. zxcv nm,. zxcv nm,. zxcv nm,.',
                tips: [
                    'Keep your fingers on home row when not typing',
                    'Reach down with the correct finger',
                    'Return to home row after each key'
                ]
            }
        ],
        intermediate: [
            {
                id: 'common-words',
                title: 'Common Words',
                description: 'Practice typing common English words to build speed.',
                text: 'the and that have with this from they will would there their',
                tips: [
                    'Focus on accuracy first',
                    'Build up speed gradually',
                    'Practice regularly'
                ]
            },
            {
                id: 'sentences',
                title: 'Basic Sentences',
                description: 'Practice typing complete sentences with proper punctuation.',
                text: 'The quick brown fox jumps over the lazy dog. How are you today?',
                tips: [
                    'Watch for proper spacing',
                    'Use correct punctuation',
                    'Maintain consistent rhythm'
                ]
            }
        ],
        advanced: [
            {
                id: 'paragraphs',
                title: 'Paragraph Practice',
                description: 'Build endurance and speed with longer text passages.',
                text: 'Touch typing is a skill that requires practice and dedication. The more you practice, the better you will become. Focus on accuracy first, then gradually increase your speed.',
                tips: [
                    'Take breaks when needed',
                    'Focus on maintaining accuracy',
                    'Build up typing endurance'
                ]
            },
            {
                id: 'speed-drills',
                title: 'Speed Drills',
                description: 'Challenge yourself with timed typing exercises.',
                text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!',
                tips: [
                    'Push your speed limits',
                    'Maintain accuracy under pressure',
                    'Track your progress'
                ]
            }
        ],
        'tricky-numbers': [
            {
                id: 'number-row',
                title: 'Number Row Basics',
                description: 'Master the number row keys with proper finger positioning.',
                text: '1234 5678 90 1234 5678 90 1234 5678 90',
                tips: [
                    'Use the correct finger for each number',
                    'Keep your fingers on home row when not typing numbers',
                    'Practice number sequences'
                ]
            }
        ],
        'tricky-special': [
            {
                id: 'special-chars',
                title: 'Special Characters',
                description: 'Learn to type special characters accurately.',
                text: '!@#$ %^&* ()_+ !@#$ %^&* ()_+ !@#$ %^&*',
                tips: [
                    'Use the correct finger for each special character',
                    'Remember shift key combinations',
                    'Practice common special character sequences'
                ]
            }
        ],
        'tricky-uncommon': [
            {
                id: 'uncommon-combos',
                title: 'Uncommon Combinations',
                description: 'Practice difficult key combinations and transitions.',
                text: 'qwerty asdfgh zxcvbn qwerty asdfgh zxcvbn',
                tips: [
                    'Focus on smooth transitions',
                    'Practice difficult combinations',
                    'Build muscle memory'
                ]
            }
        ]
    };
    
    // Bigram datasets
    const bigramData = {
        common: ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd', 'ti', 'es', 'or', 'te', 'of', 'ed', 'is', 'it', 'al', 'ar', 'st', 'to', 'nt', 'ng', 'se', 'ha', 'as', 'ou', 'io', 'le', 've', 'co', 'me', 'de'],
        difficult: ['zx', 'qw', 'fp', 'bv', 'xc', 'kj', 'mn', 'zt', 'qz', 'wx', 'vn', 'jq', 'qp', 'xz', 'qy', 'qv', 'kq', 'jx', 'pq', 'cx']
    };
    
    // Initialize UI elements
    const lessonCards = document.querySelectorAll('.lesson-card');
    const lessonSelector = document.querySelector('.lesson-selector');
    const lessonPractice = document.querySelector('.lesson-practice');
    const closeLessonBtn = document.querySelector('.close-lesson-btn');
    const startBigramBtn = document.querySelector('.start-bigram-btn');
    
    // Lesson state variables
    let currentLessonType = '';
    let currentLessonStepIndex = 0;
    let lessonStartTime = null;
    let lessonTimer = null;
    let keyTimestamps = [];
    let correctChars = 0;
    let incorrectChars = 0;
    
    // Set up listeners for lesson cards
    lessonCards.forEach(card => {
        card.addEventListener('click', () => {
            const lessonType = card.getAttribute('data-type');
            const lesson = lessonData[lessonType][0]; // For now, just use the first lesson of each type
            
            currentLessonType = lessonType;
            
            // Update lesson content
            document.getElementById('lesson-title').textContent = lesson.title;
            document.getElementById('lesson-description').textContent = lesson.description;
            
            // Setup the text display
            setupLessonText(lesson.text);
            
            // Reset metrics
            resetLessonMetrics();
            
            // Show race start animation and then display the lesson
            startLessonWithRaceAnimation(lessonType);
        });
    });
    
    // Handle lesson text input
    const lessonTextInput = document.getElementById('lesson-text-input');
    if (lessonTextInput) {
        lessonTextInput.addEventListener('input', function() {
            // Record keystroke timestamp
            keyTimestamps.push(Date.now());
            
            // First keystroke - start the lesson timer
            if (keyTimestamps.length === 1) {
                startLessonTimer();
            }
            
            // Process input
            processLessonInput(this.value);
        });
    }
    
    // Close lesson button
    if (closeLessonBtn) {
        closeLessonBtn.addEventListener('click', function() {
            // Stop any active timers
            if (lessonTimer) {
                clearInterval(lessonTimer);
                lessonTimer = null;
            }
            
            // Hide lesson interface
            lessonPractice.style.display = 'none';
            lessonSelector.style.display = 'block';
        });
    }
    
    // Set up Bigram Blitz challenge
    setupBigramBlitz(bigramData);
    
    // Set up navigation buttons for lessons
    setupLessonNavigation();
    
    // Initialize keyboard
    if (typeof initKeyboard === 'function') {
        initKeyboard('lesson-keyboard');
    }
    
    /**
     * Function to display race start lights countdown
     */
    function showRaceStartLights() {
        return new Promise((resolve) => {
            // Create race start lights element
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
            
            // Show the lights container
            raceStartLights.classList.add('active');
            
            // Countdown sequence
            let count = 3;
            const lights = raceStartLights.querySelectorAll('.light');
            
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
                    
                    // Turn all lights green
                    lights.forEach(light => {
                        light.classList.remove('active');
                        light.classList.add('green');
                    });
                    
                    // Hide after a delay
                    setTimeout(() => {
                        raceStartLights.classList.remove('active');
                        setTimeout(() => {
                            raceStartLights.remove();
                        }, 300);
                        resolve();
                    }, 1000);
                }
            }
            
            // Start the countdown
            updateCountdown();
        });
    }
    
    /**
     * Setup the text display for a lesson
     */
    function setupLessonText(text) {
        const textDisplay = document.getElementById('lesson-text-display');
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
    
    /**
     * Show race start animation and then display the lesson
     */
    async function startLessonWithRaceAnimation(lessonType) {
        try {
            // Use the shared race start countdown if available
            if (typeof window.showRaceStartCountdown === 'function') {
                await window.showRaceStartCountdown();
            } else {
                // Fallback to local implementation
                await showRaceStartLights();
            }
            
            // After countdown, show the lesson
            document.querySelector('.lesson-selector').style.display = 'none';
            document.querySelector('.lesson-practice').style.display = 'block';
            
            // Focus on input field
            document.getElementById('lesson-text-input').focus();
            
            // Start tracking time
            startLessonTimer();
        } catch (error) {
            console.error('Error starting lesson with animation:', error);
            // Fallback - show lesson immediately
            document.querySelector('.lesson-selector').style.display = 'none';
            document.querySelector('.lesson-practice').style.display = 'block';
            document.getElementById('lesson-text-input').focus();
            startLessonTimer();
        }
    }
    
    /**
     * Process user input during a lesson
     */
    function processLessonInput(userInput) {
        const textDisplay = document.getElementById('lesson-text-display');
        const textSpans = textDisplay.querySelectorAll('span');
        
        // Reset classes
        textSpans.forEach(span => {
            span.classList.remove('correct', 'incorrect', 'current');
        });
        
        // Reset counters
        correctChars = 0;
        incorrectChars = 0;
        
        // Process the input
        for (let i = 0; i < userInput.length; i++) {
            if (i >= textSpans.length) break;
            
            if (userInput[i] === textSpans[i].textContent) {
                textSpans[i].classList.add('correct');
                correctChars++;
            } else {
                textSpans[i].classList.add('incorrect');
                incorrectChars++;
            }
        }
        
        // Highlight current character
        if (userInput.length < textSpans.length) {
            textSpans[userInput.length].classList.add('current');
        }
        
        // Calculate metrics
        updateLessonMetrics();
        
        // Check if user completed the text
        if (userInput.length === textSpans.length) {
            completeLessonStep();
        }
    }
    
    /**
     * Start the lesson timer
     */
    function startLessonTimer() {
        // Reset previous timer if exists
        if (lessonTimer) {
            clearInterval(lessonTimer);
        }
        
        // Set start time
        lessonStartTime = Date.now();
        
        // Start timer
        lessonTimer = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - lessonStartTime) / 1000);
            document.getElementById('lesson-time').textContent = `${elapsedTime}s`;
            
            // Update metrics periodically
            updateLessonMetrics();
        }, 1000);
    }
    
    /**
     * Update lesson metrics (WPM, accuracy)
     */
    function updateLessonMetrics() {
        if (!lessonStartTime) return;
        
        // Calculate time elapsed in minutes
        const elapsedMinutes = (Date.now() - lessonStartTime) / 1000 / 60;
        
        // Calculate WPM (standard calculation: characters/5 divided by minutes)
        const userInput = document.getElementById('lesson-text-input').value;
        const inputLength = userInput.length;
        const inputWords = inputLength / 5;
        const wpm = Math.round(inputWords / Math.max(elapsedMinutes, 0.01));
        
        // Calculate accuracy
        const totalChars = correctChars + incorrectChars;
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        
        // Update UI
        document.querySelector('.speedometer-value').textContent = `${wpm} WPM`;
        document.getElementById('lesson-accuracy').textContent = `${accuracy}%`;
        
        // Update speedometer dial
        updateSpeedometerDial(wpm);
    }
    
    /**
     * Update the speedometer dial based on WPM
     */
    function updateSpeedometerDial(wpm) {
        const maxWPM = 150; // Maximum WPM for full rotation
        const rotationPercentage = Math.min(wpm / maxWPM, 1);
        const rotationDegrees = -90 + (rotationPercentage * 180);
        
        const speedometerDial = document.querySelector('.speedometer-dial');
        if (speedometerDial) {
            speedometerDial.style.transform = `translate(-50%, -100%) rotate(${rotationDegrees}deg)`;
        }
    }
    
    /**
     * Reset lesson metrics
     */
    function resetLessonMetrics() {
        // Reset timers
        if (lessonTimer) {
            clearInterval(lessonTimer);
            lessonTimer = null;
        }
        lessonStartTime = null;
        
        // Reset counters
        keyTimestamps = [];
        correctChars = 0;
        incorrectChars = 0;
        
        // Reset UI
        document.querySelector('.speedometer-value').textContent = '0 WPM';
        document.getElementById('lesson-accuracy').textContent = '100%';
        document.getElementById('lesson-time').textContent = '0s';
        document.getElementById('lesson-text-input').value = '';
        
        // Reset speedometer dial
        updateSpeedometerDial(0);
    }
    
    /**
     * Complete a lesson step
     */
    function completeLessonStep() {
        // Stop timer
        if (lessonTimer) {
            clearInterval(lessonTimer);
            lessonTimer = null;
        }
        
        // Calculate final metrics
        const elapsedTime = Math.floor((Date.now() - lessonStartTime) / 1000);
        const userInput = document.getElementById('lesson-text-input').value;
        const inputLength = userInput.length;
        const inputWords = inputLength / 5;
        const wpm = Math.round(inputWords / (elapsedTime / 60));
        const accuracy = Math.round((correctChars / inputLength) * 100);
        
        // Update lesson progress
        updateLessonProgress(currentLessonType, wpm, accuracy);
        
        // Show completion modal
        showCompletionModal(wpm, accuracy, elapsedTime);
    }
    
    /**
     * Update lesson progress in database and localStorage
     */
    async function updateLessonProgress(lessonType, wpm, accuracy) {
        try {
            // Calculate progress percentage
            const progressPercentage = Math.min(
                Math.round((wpm / 60) * 100), // Progressive % based on WPM (60 WPM = 100%)
                100 // Max 100%
            );
            
            // Create progress object
            const progressData = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
            progressData[lessonType] = progressPercentage;
            
            // Save to localStorage as backup
            localStorage.setItem('lessonProgress', JSON.stringify(progressData));
            
            // Get current user
            const currentUser = localStorage.getItem('typingTestUser');
            
            // Save to database if user is logged in
            if (currentUser && window.typingDB && typeof window.typingDB.saveUserProgress === 'function') {
                await window.typingDB.saveUserProgress(currentUser, progressData);
                console.log('Progress saved to database for user:', currentUser);
            }
            
            // Update UI
            updateProgressUI(progressData);
        } catch (e) {
            console.error('Error saving lesson progress:', e);
        }
    }
    
    /**
     * Show completion modal
     */
    function showCompletionModal(wpm, accuracy, time) {
        // Update completion stats
        document.getElementById('completion-wpm').textContent = wpm;
        document.getElementById('completion-accuracy').textContent = accuracy;
        document.getElementById('completion-time').textContent = time;
        
        // Set appropriate feedback
        let feedback = '';
        if (wpm > 80) {
            feedback = 'Outstanding! You\'re racing at top speed! 🏆';
        } else if (wpm > 60) {
            feedback = 'Great driving! You\'re cruising at a good speed! 🏁';
        } else if (wpm > 40) {
            feedback = 'Good job! You\'re picking up speed! 🚗';
        } else {
            feedback = 'Keep practicing! More laps will improve your speed. 🔄';
        }
        
        document.getElementById('completion-feedback').textContent = feedback;
        
        // Show the modal
        document.querySelector('.completion-modal').style.display = 'flex';
        
        // Add event listeners for buttons
        document.querySelector('.restart-lesson-btn').addEventListener('click', function() {
            document.querySelector('.completion-modal').style.display = 'none';
            resetLessonMetrics();
            setupLessonText(lessonData[currentLessonType][0].text);
        });
        
        document.querySelector('.return-lessons-btn').addEventListener('click', function() {
            document.querySelector('.completion-modal').style.display = 'none';
            lessonPractice.style.display = 'none';
            lessonSelector.style.display = 'block';
        });
    }
}

/**
 * Setup lesson navigation
 */
function setupLessonNavigation() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            if (!prevBtn.disabled) {
                navigateLesson('prev');
            }
        });
        
        nextBtn.addEventListener('click', function() {
            navigateLesson('next');
        });
    }
}

/**
 * Navigate between lesson steps
 */
function navigateLesson(direction) {
    const practiceArea = document.querySelector('.lesson-practice');
    const lessonType = practiceArea.dataset.lessonType;
    const lessonIndex = parseInt(practiceArea.dataset.lessonIndex);
    const stepIndex = parseInt(practiceArea.dataset.stepIndex);
    
    // This would need access to the lessonData object
    // For simplicity, we'll just show an alert
    alert(`Navigating ${direction}. This would move to the ${direction === 'next' ? 'next' : 'previous'} step or lesson.`);
}

/**
 * Setup Bigram Blitz challenge
 */
function setupBigramBlitz(bigramData) {
    // Handle bigram group tabs
    const bigramGroups = document.querySelectorAll('.bigram-group');
    bigramGroups.forEach(group => {
        group.addEventListener('click', function() {
            bigramGroups.forEach(g => g.classList.remove('active'));
            this.classList.add('active');
            
            // Update current bigrams based on selected group
            const groupType = this.dataset.group;
            if (groupType !== 'custom') {
                updateBigramDisplay(bigramData[groupType]);
            }
        });
    });
    
    // Start Bigram Blitz button
    const startBigramBtn = document.querySelector('.start-bigram-btn');
    let bigramBlitzActive = false;
    let bigramTimer;
    let currentScore = 0;
    let currentStreak = 0;
    let currentAccuracy = 0;
    let totalAttempts = 0;
    let correctAttempts = 0;
    
    if (startBigramBtn) {
        startBigramBtn.addEventListener('click', function() {
            if (!bigramBlitzActive) {
                startBigramChallenge();
            } else {
                stopBigramChallenge();
            }
        });
    }
    
    // Custom bigram feature
    setupCustomBigramFeature(bigramData);
    
    // Bigram input handler
    const bigramInput = document.querySelector('.bigram-input');
    if (bigramInput) {
        bigramInput.addEventListener('input', function() {
            if (!bigramBlitzActive) return;
            
            const typedBigram = bigramInput.value.toLowerCase();
            const currentBigram = document.querySelector('.current-bigram').textContent.toLowerCase();
            
            if (typedBigram.length === 2) {
                // Check if correct
                if (typedBigram === currentBigram) {
                    // Correct - update stats
                    correctAttempts++;
                    currentStreak++;
                    // Flash green
                    document.querySelector('.current-bigram').style.color = '#4CAF50';
                    setTimeout(() => {
                        document.querySelector('.current-bigram').style.color = 'white';
                    }, 200);
                } else {
                    // Incorrect - reset streak
                    currentStreak = 0;
                    // Flash red
                    document.querySelector('.current-bigram').style.color = '#FF5252';
                    setTimeout(() => {
                        document.querySelector('.current-bigram').style.color = 'white';
                    }, 200);
                }
                
                totalAttempts++;
                
                // Update stats
                currentAccuracy = Math.round((correctAttempts / totalAttempts) * 100) || 0;
                currentScore = Math.round(correctAttempts * (1 + currentStreak * 0.1));
                
                updateBigramStats(currentScore, currentAccuracy, currentStreak);
                
                // Clear input and show next bigram
                bigramInput.value = '';
                const activeGroup = document.querySelector('.bigram-group.active');
                const groupType = activeGroup.dataset.group;
                
                let bigrams;
                if (groupType === 'custom') {
                    // Get custom bigrams
                    const customChips = document.querySelectorAll('.custom-chips .bigram-chip');
                    bigrams = Array.from(customChips).map(chip => chip.textContent);
                    if (bigrams.length === 0) {
                        bigrams = bigramData.common; // Fallback to common if no custom bigrams
                    }
                } else {
                    bigrams = bigramData[groupType];
                }
                
                updateBigramDisplay(bigrams);
            }
        });
    }
    
    function startBigramChallenge() {
        bigramBlitzActive = true;
        startBigramBtn.textContent = 'Stop Challenge';
        
        // Reset stats
        currentScore = 0;
        currentStreak = 0;
        currentAccuracy = 0;
        totalAttempts = 0;
        correctAttempts = 0;
        updateBigramStats(0, 0, 0);
        
        // Enable input and focus it
        const bigramInput = document.querySelector('.bigram-input');
        bigramInput.disabled = false;
        bigramInput.value = '';
        bigramInput.focus();
        
        // Start the timer animation
        const timerProgress = document.querySelector('.timer-progress');
        timerProgress.style.width = '100%';
        timerProgress.style.transition = 'width 60s linear';
        
        // Update timer text
        let timeLeft = 60;
        const timerText = document.querySelector('.timer-text');
        
        bigramTimer = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft + 's';
            
            if (timeLeft <= 0) {
                stopBigramChallenge();
                
                // Show results
                alert(`Time's up! Your score: ${currentScore}, Accuracy: ${currentAccuracy}%, Streak: ${currentStreak}`);
            }
        }, 1000);
    }
    
    function stopBigramChallenge() {
        clearInterval(bigramTimer);
        bigramBlitzActive = false;
        startBigramBtn.textContent = 'Start Bigram Blitz';
        
        // Disable input
        const bigramInput = document.querySelector('.bigram-input');
        bigramInput.disabled = true;
        
        // Reset timer
        const timerProgress = document.querySelector('.timer-progress');
        timerProgress.style.width = '0%';
        timerProgress.style.transition = 'none';
        document.querySelector('.timer-text').textContent = '60s';
    }
    
    function updateBigramStats(score, accuracy, streak) {
        const statValues = document.querySelectorAll('.bigram-stats .stat-value');
        statValues[0].textContent = score;
        statValues[1].textContent = accuracy + '%';
        statValues[2].textContent = streak;
    }
    
    function updateBigramDisplay(bigrams) {
        // Pick a random bigram
        const randomIndex = Math.floor(Math.random() * bigrams.length);
        const currentBigram = bigrams[randomIndex];
        
        // Update display
        document.querySelector('.current-bigram').textContent = currentBigram;
        
        // Update next bigrams preview
        const nextBigramsContainer = document.querySelector('.next-bigrams');
        nextBigramsContainer.innerHTML = '';
        
        // Show 3 random next bigrams
        const nextIndices = [];
        while (nextIndices.length < 3 && bigrams.length > 1) {
            const idx = Math.floor(Math.random() * bigrams.length);
            if (idx !== randomIndex && !nextIndices.includes(idx)) {
                nextIndices.push(idx);
            }
        }
        
        nextIndices.forEach(idx => {
            const span = document.createElement('span');
            span.textContent = bigrams[idx];
            nextBigramsContainer.appendChild(span);
        });
    }
}

/**
 * Setup custom bigram feature
 */
function setupCustomBigramFeature(bigramData) {
    const addCustomBigramBtn = document.getElementById('add-custom-bigram');
    const customBigramInput = document.getElementById('custom-bigram');
    const customChips = document.querySelector('.custom-chips');
    
    if (addCustomBigramBtn && customBigramInput && customChips) {
        addCustomBigramBtn.addEventListener('click', function() {
            const value = customBigramInput.value.trim().toLowerCase();
            
            // Validate input: must be exactly 2 letters
            if (value.length === 2 && /^[a-z]{2}$/.test(value)) {
                // Create and add the chip
                const chip = document.createElement('span');
                chip.className = 'bigram-chip';
                chip.textContent = value;
                customChips.appendChild(chip);
                
                // Clear input
                customBigramInput.value = '';
                
                // Add click event to remove the chip
                chip.addEventListener('click', function() {
                    chip.remove();
                });
            } else {
                alert('Please enter exactly 2 letters (a-z).');
            }
        });
        
        // Allow pressing Enter to add a custom bigram
        customBigramInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCustomBigramBtn.click();
            }
        });
    }
} 