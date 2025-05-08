/**
 * Key Racer - Typing Lessons
 * This script handles the typing lessons, tricky keys practice, and bigram blitz functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Lessons script loaded');
    
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
    
    // Set up listeners for lesson cards
    lessonCards.forEach(card => {
        card.addEventListener('click', () => {
            const lessonType = card.getAttribute('data-type');
            const lesson = lessonData[lessonType][0]; // For now, just use the first lesson of each type

            // Update lesson content
            document.getElementById('lesson-title').textContent = lesson.title;
            document.getElementById('lesson-description').textContent = lesson.description;
            document.getElementById('lesson-text').textContent = lesson.text;
            
            // Update tips
            const lessonTips = document.getElementById('lesson-tips');
            lessonTips.innerHTML = lesson.tips.map(tip => `<li>${tip}</li>`).join('');

            // Show lesson interface
            lessonSelector.style.display = 'none';
            lessonPractice.style.display = 'block';
        });
    });
    
    // Close lesson button
    if (closeLessonBtn) {
        closeLessonBtn.addEventListener('click', function() {
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