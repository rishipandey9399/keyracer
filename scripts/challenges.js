/**
 * Key Racer - Coding Challenges
 * Handles coding challenge execution and verification
 */

class ChallengeManager {
    constructor() {
        this.challenges = [];
        this.currentChallengeIndex = 0;
        this.codeExecutor = new CodeExecutor();
        this.completedChallenges = this.loadCompletedChallenges();
        this.initializeUI();
    }

    loadCompletedChallenges() {
        const completed = localStorage.getItem('completedChallenges');
        return completed ? JSON.parse(completed) : [];
    }

    saveCompletedChallenge(challengeId) {
        const completed = this.loadCompletedChallenges();
        if (!completed.includes(challengeId)) {
            completed.push(challengeId);
            localStorage.setItem('completedChallenges', JSON.stringify(completed));
            this.completedChallenges = completed;
        }
    }

    getLastCompletedChallenge() {
        const completed = this.loadCompletedChallenges();
        return completed.length > 0 ? Math.max(...completed) : -1;
    }

    isCompleted(challengeId) {
        return this.completedChallenges.includes(challengeId);
    }

    async initialize() {
        try {
            const response = await fetch('/scripts/challenges.json');
            const data = await response.json();
            this.challenges = data.challenges;
            this.loadCurrentChallenge();
        } catch (error) {
            console.error('Failed to load challenges:', error);
        }
    }

    initializeUI() {
        // Get UI elements
        this.codeInput = document.querySelector('.code-input');
        this.runButton = document.querySelector('.run-btn');
        this.submitButton = document.querySelector('.submit-btn');
        this.outputSection = document.querySelector('.code-output');

        // Add event listeners
        this.runButton.addEventListener('click', () => this.runCode());
        this.submitButton.addEventListener('click', () => this.submitSolution());
    }

    loadCurrentChallenge() {
        // Skip completed challenges if not explicitly accessed
        if (this.currentChallengeIndex < this.challenges.length - 1 && 
            this.isCompleted(this.challenges[this.currentChallengeIndex].id) &&
            !window.location.hash.includes('challenge')) {
            this.currentChallengeIndex++;
            this.loadCurrentChallenge();
            return;
        }

        const challenge = this.challenges[this.currentChallengeIndex];
        
        // Update challenge title with completion status
        const titleEl = document.querySelector('.challenge-title');
        titleEl.textContent = challenge.title;
        if (this.isCompleted(challenge.id)) {
            titleEl.innerHTML += ' <span class="completion-badge">✓</span>';
        }
        
        // Update challenge description
        document.querySelector('.challenge-description').textContent = challenge.description;
        
        // Update examples
        const examplesSection = document.querySelector('.example-section');
        examplesSection.innerHTML = `
            <h3>Examples</h3>
            <p>Expected output:</p>
            <pre><code>${challenge.examples.output}</code></pre>
        `;
        
        // Update notes
        const notesSection = document.querySelectorAll('.example-section')[1];
        notesSection.innerHTML = `
            <h3>Notes</h3>
            <ul>
                ${challenge.notes.map(note => `<li>${note}</li>`).join('')}
            </ul>
        `;

        // Clear code input and output
        this.codeInput.value = '# Write your solution here\n';
        this.outputSection.textContent = '';
        
        // Update URL with challenge ID
        window.location.hash = `challenge-${challenge.id}`;
    }

    async runCode() {
        const code = this.codeInput.value;
        try {
            const result = await this.codeExecutor.execute(code, 'python');
            this.outputSection.textContent = result.error || result.output;
        } catch (error) {
            this.outputSection.textContent = 'Error executing code: ' + error.message;
        }
    }

    async submitSolution() {
        const code = this.codeInput.value;
        const challenge = this.challenges[this.currentChallengeIndex];
        
        try {
            // Run all test cases
            let allTestsPassed = true;
            let failedTestCase = null;
            
            for (const testCase of challenge.testCases) {
                const result = await this.codeExecutor.execute(code, 'python', testCase.input);
                
                if (result.error) {
                    allTestsPassed = false;
                    failedTestCase = { input: testCase.input, error: result.error };
                    break;
                }
                
                // Clean up output by removing any trailing newlines
                const cleanOutput = result.output.trim();
                const cleanExpected = testCase.expectedOutput.trim();
                
                if (cleanOutput !== cleanExpected) {
                    allTestsPassed = false;
                    failedTestCase = { 
                        input: testCase.input, 
                        expected: cleanExpected,
                        got: cleanOutput 
                    };
                    break;
                }
            }

            if (allTestsPassed) {
                // Save progress
                const currentChallenge = this.challenges[this.currentChallengeIndex];
                this.saveCompletedChallenge(currentChallenge.id);
                
                // Show success message
                this.outputSection.textContent = '🎉 Congratulations! All tests passed!';
                
                // Update completion badge
                const titleEl = document.querySelector('.challenge-title');
                if (!titleEl.innerHTML.includes('completion-badge')) {
                    titleEl.innerHTML += ' <span class="completion-badge">✓</span>';
                }
                
                // Show next challenge button if there are more challenges
                if (this.currentChallengeIndex < this.challenges.length - 1) {
                    this.showNextChallengePrompt();
                } else {
                    this.outputSection.textContent += '\n🏆 You have completed all challenges!';
                }
            } else if (failedTestCase) {
                if (failedTestCase.error) {
                    this.outputSection.textContent = `❌ Error with input "${failedTestCase.input}":\n${failedTestCase.error}`;
                } else {
                    this.outputSection.textContent = `❌ Test failed with input "${failedTestCase.input}"\nExpected: ${failedTestCase.expected}\nGot: ${failedTestCase.got}`;
                }
            } else {
                this.outputSection.textContent = '❌ Some tests failed. Please check your solution and try again.';
            }
        } catch (error) {
            this.outputSection.textContent = 'Error executing tests: ' + error.message;
        }
    }

    showNextChallengePrompt() {
        // Create next challenge button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Challenge';
        nextButton.className = 'next-challenge-btn';
        nextButton.addEventListener('click', () => {
            this.currentChallengeIndex++;
            this.loadCurrentChallenge();
            nextButton.remove();
        });

        // Add button to output section
        this.outputSection.appendChild(document.createElement('br'));
        this.outputSection.appendChild(nextButton);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the challenge selection page or a specific challenge page
    const isChallengePage = window.location.pathname.includes('python-challenges.html');
    
    if (isChallengePage) {
        const challengeManager = new ChallengeManager();
        challengeManager.initialize();
    } else {
        initializeLanguageSelection();
    }
});

// Handle language selection page
function initializeLanguageSelection() {
    const disabledButtons = document.querySelectorAll('.start-learning-btn.disabled');
    disabledButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('This language will be available soon!');
        });
    });
}

// Handle specific challenge page
function initializeChallengePage() {
    const codeExecutor = new CodeExecutor();
    const codeInput = document.querySelector('.code-input');
    const outputArea = document.querySelector('.code-output');
    const runButton = document.querySelector('.run-btn');
    const submitButton = document.querySelector('.submit-btn');

    if (runButton) {
        runButton.addEventListener('click', async () => {
            if (!codeInput || !outputArea) return;
            
            outputArea.textContent = 'Running...';
            const code = codeInput.value;
            
            const result = await codeExecutor.execute(code, 'python');
            outputArea.textContent = result.error ? 'Error: ' + result.error : result.output;
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            if (!codeInput || !outputArea) return;
            
            outputArea.textContent = 'Testing...';
            const code = codeInput.value;
            
            const result = await codeExecutor.execute(code, 'python');
            const expectedOutput = 'Hello, World!\n';
            
            if (result.error) {
                outputArea.textContent = 'Error: ' + result.error;
            } else if (result.output.trim() === expectedOutput.trim()) {
                outputArea.textContent = '🎉 Congratulations! Your solution is correct!';
                // Save progress here
            } else {
                outputArea.textContent = `Test failed!\nExpected: ${expectedOutput}\nGot: ${result.output}`;
            }
        });
    }
}

// Challenge Definitions
const challenges = {
    python: {
        'hello-world': {
            title: 'Hello World',
            description: 'Write a program that prints "Hello, World!" to the console.',
            initialCode: '# Write your code here\n',
            testCases: [
                { input: '', expectedOutput: 'Hello, World!\n' }
            ]
        },
        'sum-numbers': {
            title: 'Sum Two Numbers',
            description: 'Write a function called `add_numbers` that takes two parameters (a and b) and returns their sum.',
            initialCode: 'def add_numbers(a, b):\n    # Write your code here\n    pass\n',
            testCases: [
                { input: [1, 2], expectedOutput: '3' },
                { input: [-1, 5], expectedOutput: '4' },
                { input: [0, 0], expectedOutput: '0' }
            ]
        },
        'even-odd': {
            title: 'Even or Odd',
            description: 'Write a function called `is_even` that takes a number and returns "Even" if it\'s even, "Odd" if it\'s odd.',
            initialCode: 'def is_even(number):\n    # Write your code here\n    pass\n',
            testCases: [
                { input: [4], expectedOutput: 'Even' },
                { input: [7], expectedOutput: 'Odd' },
                { input: [0], expectedOutput: 'Even' }
            ]
        }
    }
};

// DOM Elements and State
let currentLanguage = 'python';
let currentChallenge = null;

// Initialize UI when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.querySelector('.lang-btn');
    const challengeList = document.querySelector('.challenge-list');
    const codeEditor = document.querySelector('.code-input');
    const outputArea = document.querySelector('.code-output');
    const runButton = document.querySelector('.run-btn');
    const submitButton = document.querySelector('.submit-btn');

    // Initialize language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLanguage = btn.dataset.lang;
                loadChallenges(currentLanguage);
            }
        });
    });

    // Load challenges for a language
    function loadChallenges(language) {
        const languageChallenges = challenges[language];
        if (!challengeList) return;
        
        challengeList.innerHTML = '';

        Object.entries(languageChallenges).forEach(([id, challenge]) => {
            const card = document.createElement('div');
            card.className = 'challenge-card';
            card.innerHTML = `
                <h2 class="challenge-title">${challenge.title}</h2>
                <p class="challenge-desc">${challenge.description}</p>
                <button class="start-btn" data-challenge="${id}">Start Challenge</button>
            `;
            challengeList.appendChild(card);

            const startButton = card.querySelector('.start-btn');
            startButton.addEventListener('click', () => loadChallenge(language, id));
        });
    }

    // Load a specific challenge
    function loadChallenge(language, challengeId) {
        currentChallenge = challenges[language][challengeId];
        
        const challengeNameEl = document.querySelector('.challenge-name');
        const challengeDescEl = document.querySelector('.challenge-description');
        const codeAreaRow = document.querySelector('.code-area-row');
        
        if (challengeNameEl) challengeNameEl.textContent = currentChallenge.title;
        if (challengeDescEl) challengeDescEl.textContent = currentChallenge.description;
        if (codeEditor) codeEditor.value = currentChallenge.initialCode;
        if (outputArea) outputArea.textContent = '';
        if (codeAreaRow) codeAreaRow.style.display = 'flex';
    }

    // Run code using Piston API
    async function runCode(code, language) {
        try {
            const response = await fetch(API_URL + '/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    source: code,
                    stdin: ''
                })
            });

            const result = await response.json();
            return {
                output: result.output,
                error: result.error
            };
        } catch (error) {
            return {
                output: '',
                error: 'Connection error: ' + error.message
            };
        }
    }

    // Initialize code executor
    const codeExecutor = new CodeExecutor();

    // Event Listeners for run and submit
    if (runButton) {
        runButton.addEventListener('click', async () => {
            if (!codeEditor || !outputArea) return;
            
            const code = codeEditor.value;
            outputArea.textContent = 'Running...';
            
            const result = await codeExecutor.execute(code, currentLanguage);
            outputArea.textContent = result.error ? 'Error: ' + result.error : result.output;
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            if (!currentChallenge || !codeEditor || !outputArea) return;

            const code = codeEditor.value;
            outputArea.textContent = 'Testing...';

            const result = await codeExecutor.runTests(code, currentLanguage, currentChallenge.testCases);
            outputArea.textContent = result.output;

            if (result.passed) {
                // Save progress and enable next challenge
                const nextChallenge = document.querySelector('.challenge-card:not(.completed)');
                if (nextChallenge) {
                    nextChallenge.classList.add('available');
                }
            }
        });
    }

    // Initial load of challenges
    loadChallenges(currentLanguage);
});

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
    
    // Initialize language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLanguage = btn.dataset.lang;
                loadChallenges(currentLanguage);
            }
        });
    });

    // Load challenges for a language
    function loadChallenges(language) {
        const languageChallenges = challenges[language];
        const challengeList = document.querySelector('.challenge-list');
        if (!challengeList) return;
        
        challengeList.innerHTML = '';

        Object.entries(languageChallenges).forEach(([id, challenge]) => {
            const card = document.createElement('div');
            card.className = 'challenge-card';
            card.innerHTML = `
                <h2 class="challenge-title">${challenge.title}</h2>
                <p class="challenge-desc">${challenge.description}</p>
                <button class="start-btn" data-challenge="${id}">Start Challenge</button>
            `;
            challengeList.appendChild(card);

            const startButton = card.querySelector('.start-btn');
            startButton.addEventListener('click', () => loadChallenge(language, id));
        });
    }

    // Load a specific challenge
    function loadChallenge(language, challengeId) {
        currentChallenge = challenges[language][challengeId];
        
        const challengeNameEl = document.querySelector('.challenge-name');
        const challengeDescEl = document.querySelector('.challenge-description');
        const codeEditor = document.querySelector('.code-input');
        const outputArea = document.querySelector('.code-output');
        const codeAreaRow = document.querySelector('.code-area-row');
        
        if (challengeNameEl) challengeNameEl.textContent = currentChallenge.title;
        if (challengeDescEl) challengeDescEl.textContent = currentChallenge.description;
        if (codeEditor) codeEditor.value = currentChallenge.initialCode;
        if (outputArea) outputArea.textContent = '';
        if (codeAreaRow) codeAreaRow.style.display = 'flex';
    }

    // Run code using Piston API
    async function runCode(code, language) {
        try {
            const response = await fetch(API_URL + '/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    source: code,
                    stdin: ''
                })
            });

            const result = await response.json();
            return {
                output: result.output,
                error: result.error
            };
        } catch (error) {
            return {
                output: '',
                error: 'Connection error: ' + error.message
            };
        }
    }

    // Event Listeners
    const runButton = document.querySelector('.run-btn');
    const submitButton = document.querySelector('.submit-btn');

    if (runButton) {
        runButton.addEventListener('click', async () => {
            const codeEditor = document.querySelector('.code-input');
            const outputArea = document.querySelector('.code-output');
            if (!codeEditor || !outputArea) return;
            
            const code = codeEditor.value;
            outputArea.textContent = 'Running...';
            
            const result = await runCode(code, currentLanguage);
            if (result.error) {
                outputArea.textContent = 'Error: ' + result.error;
            } else {
                outputArea.textContent = result.output;
            }
        });
    }

    // Submit solution
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            if (!currentChallenge || !codeEditor || !outputArea) return;

            const code = codeEditor.value;
            const testCases = currentChallenge.testCases;
            let allTestsPassed = true;
            let errorMessage = '';

            // Run each test case
            for (const testCase of testCases) {
                const result = await runCode(code, currentLanguage, testCase.input);
                if (result.error) {
                    allTestsPassed = false;
                    errorMessage = 'Error: ' + result.error;
                    break;
                } else if (result.output.trim() !== testCase.expectedOutput.trim()) {
                    allTestsPassed = false;
                    errorMessage = `Test failed: expected "${testCase.expectedOutput}", got "${result.output}"`;
                    break;
                }
            }

            // Show result
            if (allTestsPassed) {
                outputArea.textContent = 'All tests passed!';
            } else {
                outputArea.textContent = errorMessage;
            }
        });
    }
});