// Language-specific code snippets and challenge data
const codeSnippets = {
    python: {
        "Print Hello World": {
            code: 'print("Hello, World!")',
            description: 'Write a program that prints "Hello, World!" to the console.',
            difficulty: 'beginner'
        },
        "Print Name": {
            code: 'name = "Ramesh"\nprint(f"Hello, {name}!")',
            description: 'Print a greeting with a specific name.',
            difficulty: 'beginner'
        },
        "Print Multiple Names": {
            code: 'names = ["Alice", "Bob", "Charlie"]\nfor name in names:\n    print(f"Hello, {name}!")',
            description: 'Print greetings for multiple names using a loop.',
            difficulty: 'intermediate'
        },
        "Basic Addition": {
            code: 'a = 5\nb = 3\nsum = a + b\nprint(f"Sum of {a} and {b} is {sum}")',
            description: 'Add two numbers and print the result.',
            difficulty: 'beginner'
        },
        "Sum of Numbers": {
            code: 'def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(5, 3)\nprint(result)',
            description: 'Write a function that takes two numbers and returns their sum.',
            difficulty: 'beginner'
        },
        "Advanced Calculator": {
            code: 'def calculate(a, b, operation):\n    if operation == "add":\n        return a + b\n    elif operation == "subtract":\n        return a - b\n    elif operation == "multiply":\n        return a * b\n    elif operation == "divide":\n        return a / b if b != 0 else "Error: Division by zero"\n\nresult = calculate(10, 5, "add")\nprint(result)',
            description: 'Create a calculator function that can perform multiple operations.',
            difficulty: 'intermediate'
        },
        "Decorator Pattern": {
            code: 'def timing_decorator(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"Function {func.__name__} took {end-start} seconds")\n        return result\n    return wrapper',
            description: 'Implement a timing decorator that measures function execution time.'
        },
        "Async Function": {
            code: 'async def fetch_data(url: str) -> dict:\n    async with aiohttp.ClientSession() as session:\n        async with session.get(url) as response:\n            return await response.json()',
            description: 'Create an async function to fetch data from an API.'
        }
    },
    javascript: {
        "Print Hello World": {
            code: 'console.log("Hello, World!");',
            description: 'Write a program that prints "Hello, World!" to the console.'
        },
        "Sum of Two Numbers": {
            code: 'function addNumbers(a, b) {\n    return a + b;\n}\n\nconst result = addNumbers(5, 3);\nconsole.log(result);',
            description: 'Write a function that takes two numbers and returns their sum.'
        },
        "Promise Chain": {
            code: 'function fetchUserData(userId) {\n    return fetch(`/api/users/${userId}`)\n        .then(response => response.json())\n        .then(user => fetch(`/api/posts/${user.id}`))\n        .then(response => response.json())\n        .catch(error => console.error(error));\n}',
            description: 'Create a promise chain to fetch user data and their posts.'
        },
        "Async Iterator": {
            code: 'async function* generateSequence(start, end) {\n    for (let i = start; i <= end; i++) {\n        await new Promise(resolve => setTimeout(resolve, 1000));\n        yield i;\n    }\n}',
            description: 'Implement an async iterator that generates a sequence of numbers.'
        }
    },
    cpp: {
        "Print Hello World": {
            code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
            description: 'Write a program that prints "Hello, World!" to the console.'
        },
        "Sum of Two Numbers": {
            code: '#include <iostream>\n\nint addNumbers(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = addNumbers(5, 3);\n    std::cout << result << std::endl;\n    return 0;\n}',
            description: 'Write a function that takes two numbers and returns their sum.'
        }
    },
    java: {
        "Print Hello World": {
            code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
            description: 'Write a program that prints "Hello, World!" to the console.'
        },
        "Sum of Two Numbers": {
            code: 'public class Main {\n    public static int addNumbers(int a, int b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        int result = addNumbers(5, 3);\n        System.out.println(result);\n    }\n}',
            description: 'Write a function that takes two numbers and returns their sum.'
        }
    },
    typescript: {
        "Print Hello World": {
            code: 'console.log("Hello, World!");',
            description: 'Write a program that prints "Hello, World!" to the console.'
        },
        "Generic Function": {
            code: 'function identity<T>(arg: T): T {\n    return arg;\n}\n\nconst result = identity<string>("Hello TypeScript");\nconsole.log(result);',
            description: 'Create a generic function that returns its input.'
        },
        "Interface Implementation": {
            code: 'interface Shape {\n    area(): number;\n}\n\nclass Circle implements Shape {\n    constructor(private radius: number) {}\n    \n    area(): number {\n        return Math.PI * this.radius * this.radius;\n    }\n}',
            description: 'Implement a Shape interface with a Circle class.'
        }
    },
    rust: {
        "Print Hello World": {
            code: 'fn main() {\n    println!("Hello, World!");\n}',
            description: 'Write a program that prints "Hello, World!" to the console.'
        },
        "Generic Struct": {
            code: 'struct Point<T> {\n    x: T,\n    y: T,\n}\n\nfn main() {\n    let integer = Point { x: 5, y: 10 };\n    let float = Point { x: 1.0, y: 4.0 };\n}',
            description: 'Create a generic Point struct and use it with different types.'
        },
        "Error Handling": {
            code: 'fn divide(a: i32, b: i32) -> Result<i32, String> {\n    if b == 0 {\n        return Err(String::from("Division by zero"));\n    }\n    Ok(a / b)\n}',
            description: 'Implement a function that handles division by zero errors.'
        }
    },
    go: {
        "Print Hello World": {
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
            description: 'Write a program that prints "Hello, World!" to the console.'
        },
        "Goroutine Channel": {
            code: 'package main\n\nimport "fmt"\n\nfunc sum(s []int, c chan int) {\n    sum := 0\n    for _, v := range s {\n        sum += v\n    }\n    c <- sum\n}',
            description: 'Create a function that sums numbers using goroutines and channels.'
        }
    }
};

// Map language to Prism class
const prismLangMap = {
    python: 'python',
    javascript: 'javascript',
    cpp: 'cpp',
    java: 'java',
    csharp: 'csharp',
    typescript: 'typescript',
    rust: 'rust',
    go: 'go'
};

class CodeRacer {    constructor() {
        this.currentLang = 'python';
        this.currentChallenge = 'Print Hello World';
        this.currentMode = 'practice'; // 'practice' or 'challenge'
        this.evaluator = new CodeEvaluator();
        
        // Initialize DOM elements
        this.initializeDOM();
        // Set up event listeners
        this.setupEventListeners();
        // Initialize the first challenge
        this.loadChallenge();
    }

    initializeDOM() {
        this.elements = {
            langButtons: document.querySelectorAll('.lang-btn'),
            startButtons: document.querySelectorAll('.start-btn'),
            codeSnippetArea: document.getElementById('code-snippet-area'),
            codeInput: document.getElementById('code-input'),
            modeToggle: document.getElementById('mode-toggle'),
            evaluationResults: document.getElementById('evaluation-results')
        };
    }

    setupEventListeners() {
        // Language selection
        this.elements.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLang = btn.textContent.toLowerCase();
                this.loadChallenge();
            });
        });

        // Start challenge
        this.elements.startButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.startChallenge(e));
        });

        // Code input
        this.elements.codeInput.addEventListener('input', () => this.handleInput());        // Mode toggle
        if (this.elements.modeToggle) {
            this.elements.modeToggle.addEventListener('click', () => this.toggleMode());
        }
        
        // Reset button
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetChallenge());
        }
    }

    loadChallenge() {
        const challenge = codeSnippets[this.currentLang][this.currentChallenge];
        
        // Update code display with syntax highlighting
        this.elements.codeSnippetArea.textContent = challenge.code;
        this.elements.codeSnippetArea.className = 'language-' + (prismLangMap[this.currentLang] || this.currentLang);
        if (window.Prism) Prism.highlightElement(this.elements.codeSnippetArea);
        
        // Reset input and stats
        this.elements.codeInput.value = '';
        this.elements.codeInput.disabled = true;
        this.updateStats(true);
        
        // Show challenge description
        this.updateChallengeDescription(challenge.description);
    }    async startChallenge(event) {
        const card = event.target.closest('.challenge-card');
        const challengeTitle = card.querySelector('.challenge-title').textContent;
        const startBtn = event.target;
        
        // Disable button and show loading state
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        try {
            this.currentChallenge = challengeTitle;
            
            // Hide challenge selection and show editor
            document.getElementById('challenge-selection').style.display = 'none';
            document.getElementById('challenge-editor').style.display = 'block';
            
            // Update challenge name and description in editor
            document.querySelector('.challenge-name').textContent = challengeTitle;
            
            this.loadChallenge();
            
            // Add a short delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Start countdown animation
            await this.showStartCountdown();
            
            // Enable typing after countdown
            this.elements.codeInput.disabled = false;
            this.elements.codeInput.focus();
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => this.updateStats(), 200);
            
            // Update all start buttons
            this.elements.startButtons.forEach(b => {
                b.disabled = true;
                b.innerHTML = '<i class="fas fa-code"></i> In Progress...';
            });
        } catch (error) {
            console.error('Error starting challenge:', error);
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Challenge';
        }
    }    handleInput() {
        this.updateInputFeedback();
        
        // Check if challenge is complete
        if (this.elements.codeInput.value === codeSnippets[this.currentLang][this.currentChallenge].code) {
            this.completeChallenge();
        }
    }

    async completeChallenge() {
        this.elements.codeInput.disabled = true;
        
        // Enable start buttons
        this.elements.startButtons.forEach(b => {
            b.disabled = false;
            b.innerHTML = '<i class="fas fa-play"></i> Start Challenge';
        });

        // In challenge mode, evaluate the code
        if (this.currentMode === 'challenge') {
            const results = await this.evaluator.evaluateCode(
                this.currentChallenge,
                this.elements.codeInput.value,
                this.currentLang
            );
            this.evaluator.displayResults(results, this.elements.evaluationResults);
        }
    }

    updateStats(finish = false) {
        const input = this.elements.codeInput.value;
        let errors = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== codeSnippets[this.currentLang][this.currentChallenge].code[i]) errors++;
        }
        errors += Math.max(0, codeSnippets[this.currentLang][this.currentChallenge].code.length - input.length);
        this.elements.errorsSpan.textContent = errors;
        
        const correctChars = input.split('').filter((ch, i) => ch === codeSnippets[this.currentLang][this.currentChallenge].code[i]).length;
        const accuracy = input.length ? Math.round((correctChars / input.length) * 100) : 100;
        this.elements.accuracySpan.textContent = accuracy;
        
        const elapsed = ((finish ? Date.now() : Date.now()) - this.startTime) / 1000 / 60;
        const wpm = input.length ? Math.round((input.length / 5) / (elapsed || 1/60)) : 0;
        this.elements.wpmSpan.textContent = wpm;
    }

    updateInputFeedback() {
        const input = this.elements.codeInput.value;
        let html = '';
        for (let i = 0; i < codeSnippets[this.currentLang][this.currentChallenge].code.length; i++) {
            const char = codeSnippets[this.currentLang][this.currentChallenge].code[i];
            const inputChar = input[i];
            if (inputChar === undefined) {
                html += `<span class="remaining">${char}</span>`;
            } else if (inputChar === char) {
                html += `<span class="correct">${char}</span>`;
            } else {
                html += `<span class="incorrect">${char}</span>`;
            }
        }
        this.elements.codeSnippetArea.innerHTML = html;
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <h3>Challenge Complete! 🎉</h3>
            <p>WPM: ${this.elements.wpmSpan.textContent}</p>
            <p>Accuracy: ${this.elements.accuracySpan.textContent}%</p>
            <p>Errors: ${this.elements.errorsSpan.textContent}</p>
        `;
        
        const existingMessage = document.querySelector('.completion-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        document.querySelector('.code-content').appendChild(message);
    }    // Leaderboard functionality removed

    toggleMode() {
        this.currentMode = this.currentMode === 'practice' ? 'challenge' : 'practice';
        this.elements.modeToggle.textContent = `Switch to ${this.currentMode === 'practice' ? 'Challenge' : 'Practice'} Mode`;
        
        // Show/hide evaluation results based on mode
        if (this.elements.evaluationResults) {
            this.elements.evaluationResults.style.display = 
                this.currentMode === 'challenge' ? 'block' : 'none';
        }
    }

    async showStartCountdown() {
        return new Promise((resolve) => {
            const countdownOverlay = document.createElement('div');
            countdownOverlay.className = 'race-start-countdown';
            countdownOverlay.innerHTML = `
                <div class="countdown-content">
                    <div class="lights-container">
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                    </div>
                    <div class="countdown-number"></div>
                </div>
            `;
            
            document.querySelector('.challenge-content').appendChild(countdownOverlay);
            
            const lights = countdownOverlay.querySelectorAll('.light');
            const countdownNumber = countdownOverlay.querySelector('.countdown-number');
            let count = 3;
            
            const animateCountdown = () => {
                if (count > 0) {
                    lights[3 - count].classList.add('active');
                    countdownNumber.textContent = count;
                    count--;
                    setTimeout(animateCountdown, 1000);
                } else {
                    lights.forEach(light => light.classList.add('green'));
                    countdownNumber.textContent = 'GO!';
                    countdownNumber.classList.add('go-text');
                    
                    setTimeout(() => {
                        countdownOverlay.remove();
                        resolve();
                    }, 1000);
                }
            };
            
            animateCountdown();
        });
    }

    updateChallengeDescription(description) {
        const descriptionElement = document.querySelector('.challenge-description');
        if (descriptionElement) {
            descriptionElement.textContent = description;
        }
    }

    resetChallenge() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Reset input and stats
        this.elements.codeInput.value = '';
        this.elements.codeInput.disabled = true;
        this.startTime = null;
        this.updateStats(true);
        
        // Reset UI
        document.getElementById('challenge-editor').style.display = 'none';
        document.getElementById('challenge-selection').style.display = 'block';
        
        // Reset buttons
        this.elements.startButtons.forEach(b => {
            b.disabled = false;
            b.innerHTML = '<i class="fas fa-play"></i> Start Challenge';
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.codeRacer = new CodeRacer();

    // Difficulty selection logic
    const difficultyBtns = document.querySelectorAll('.difficulty-btn-header');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            difficultyBtns.forEach(b => b.classList.remove('active', 'beginner-selected', 'intermediate-selected', 'advanced-selected'));
            this.classList.add('active');
            // Add color class based on difficulty
            if (this.dataset.level === 'beginner') {
                this.classList.add('beginner-selected');
            } else if (this.dataset.level === 'intermediate') {
                this.classList.add('intermediate-selected');
            } else if (this.dataset.level === 'advanced') {
                this.classList.add('advanced-selected');
            }
        });
    });

    // Set initial color for the default active button
    const initialActive = document.querySelector('.difficulty-btn-header.active');
    if (initialActive) {
        initialActive.classList.add(initialActive.dataset.level + '-selected');
    }

    // Mode selection logic (only one can be active)
    const modeBtns = document.querySelectorAll('.mode-btn-header');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Add CSS for unique difficulty colors
const style = document.createElement('style');
style.innerHTML = `
.difficulty-btn-header.beginner-selected.active {
    background: linear-gradient(90deg, #00C2FF 0%, #00FFDD 100%) !important;
    color: #181c2f !important;
    border-color: #00C2FF !important;
}
.difficulty-btn-header.intermediate-selected.active {
    background: linear-gradient(90deg, #FFB347 0%, #FF7F50 100%) !important;
    color: #181c2f !important;
    border-color: #FFB347 !important;
}
.difficulty-btn-header.advanced-selected.active {
    background: linear-gradient(90deg, #FFD700 0%, #FFC700 100%) !important;
    color: #181c2f !important;
    border-color: #FFD700 !important;
}
`;
document.head.appendChild(style);

(function() {
    // Ensure this runs only once
    if (window.__codeRacerHeaderLogicInitialized) return;
    window.__codeRacerHeaderLogicInitialized = true;

    document.addEventListener('DOMContentLoaded', function () {
        // Difficulty selection logic
        const difficultyBtns = document.querySelectorAll('.difficulty-btn-header');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                difficultyBtns.forEach(b => b.classList.remove('active', 'beginner-selected', 'intermediate-selected', 'advanced-selected'));
                this.classList.add('active');
                // Add color class based on difficulty
                if (this.dataset.level === 'beginner') {
                    this.classList.add('beginner-selected');
                } else if (this.dataset.level === 'intermediate') {
                    this.classList.add('intermediate-selected');
                } else if (this.dataset.level === 'advanced') {
                    this.classList.add('advanced-selected');
                }
            });
        });

        // Set initial color for the default active button
        const initialActive = document.querySelector('.difficulty-btn-header.active');
        if (initialActive) {
            initialActive.classList.add(initialActive.dataset.level + '-selected');
        }

        // Mode selection logic (only one can be active)
        const modeBtns = document.querySelectorAll('.mode-btn-header');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                modeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

    // Add CSS for unique difficulty colors (only once)
    if (!document.getElementById('difficulty-mode-header-style')) {
        const style = document.createElement('style');
        style.id = 'difficulty-mode-header-style';
        style.innerHTML = `
        .difficulty-btn-header.beginner-selected.active {
            background: linear-gradient(90deg, #00C2FF 0%, #00FFDD 100%) !important;
            color: #181c2f !important;
            border-color: #00C2FF !important;
        }
        .difficulty-btn-header.intermediate-selected.active {
            background: linear-gradient(90deg, #FFB347 0%, #FF7F50 100%) !important;
            color: #181c2f !important;
            border-color: #FFB347 !important;
        }
        .difficulty-btn-header.advanced-selected.active {
            background: linear-gradient(90deg, #FFD700 0%, #FFC700 100%) !important;
            color: #181c2f !important;
            border-color: #FFD700 !important;
        }
        `;
        document.head.appendChild(style);
    }
})();