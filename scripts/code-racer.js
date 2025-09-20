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

class CodeRacer {
    constructor() {
        this.currentLang = 'python';
        this.currentDifficulty = 'beginner';
        this.currentChallenge = null;
        this.currentMode = 'practice';
        this.isRacing = false;
        this.timer = null;
        this.startTime = null;
        
        // Initialize DOM elements
        this.initializeDOM();
        // Set up event listeners
        this.setupEventListeners();
        // Initialize the first challenge
        this.loadChallenge();
    }

    initializeDOM() {
        this.elements = {
            languageSelect: document.querySelector('.language-select'),
            difficultySelect: document.querySelector('.difficulty-select'),
            codeSnippetArea: document.getElementById('code-snippet-area'),
            codeInput: document.getElementById('code-input'),
            modeToggle: document.getElementById('mode-toggle'),
            evaluationResults: document.getElementById('evaluation-results'),
            resetBtn: document.querySelector('.reset-btn'),
            challengeDescription: document.querySelector('.challenge-description')
        };

        // Set initial language from select if it exists
        if (this.elements.languageSelect) {
            this.currentLang = this.elements.languageSelect.value;
        }

        // Set initial difficulty from select if it exists
        if (this.elements.difficultySelect) {
            this.currentDifficulty = this.elements.difficultySelect.value;
        }
    }

    setupEventListeners() {
        // Language selection
        if (this.elements.languageSelect) {
            this.elements.languageSelect.addEventListener('change', (e) => {
                this.currentLang = e.target.value;
                this.resetChallenge();
                this.loadChallenge();
            });
        }

        // Difficulty selection
        if (this.elements.difficultySelect) {
            this.elements.difficultySelect.addEventListener('change', (e) => {
                this.currentDifficulty = e.target.value;
                this.resetChallenge();
                this.loadChallenge();
            });
        }

        // Code input
        if (this.elements.codeInput) {
            this.elements.codeInput.addEventListener('input', () => this.handleInput());
            this.elements.codeInput.addEventListener('keydown', (e) => {
                // Prevent tab from changing focus
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = this.elements.codeInput.selectionStart;
                    const end = this.elements.codeInput.selectionEnd;
                    this.elements.codeInput.value = 
                        this.elements.codeInput.value.substring(0, start) + 
                        '    ' + 
                        this.elements.codeInput.value.substring(end);
                    this.elements.codeInput.selectionStart = 
                    this.elements.codeInput.selectionEnd = start + 4;
                }
            });
        }

        // Reset button
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => this.resetChallenge());
        }
    }

    getRandomChallenge() {
        if (!codeSnippets[this.currentLang]) {
            console.error(`No snippets found for language: ${this.currentLang}`);
            return null;
        }

        const availableChallenges = Object.entries(codeSnippets[this.currentLang])
            .filter(([_, challenge]) => 
                !challenge.difficulty || 
                challenge.difficulty.toLowerCase() === this.currentDifficulty.toLowerCase()
            );

        if (availableChallenges.length === 0) {
            // If no challenges match the current difficulty, return the first challenge
            const firstChallenge = Object.entries(codeSnippets[this.currentLang])[0];
            return { name: firstChallenge[0], ...firstChallenge[1] };
        }

        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        const [name, challenge] = availableChallenges[randomIndex];
        return { name, ...challenge };
    }

    loadChallenge() {
        const challenge = this.getRandomChallenge();
        if (!challenge) {
            console.error('Failed to load challenge');
            return;
        }

        this.currentChallenge = challenge.name;
        
        // Update code display with syntax highlighting
        if (this.elements.codeSnippetArea) {
            this.elements.codeSnippetArea.textContent = challenge.code;
            this.elements.codeSnippetArea.className = 'language-' + (prismLangMap[this.currentLang] || this.currentLang);
            
            if (window.Prism) {
                Prism.highlightElement(this.elements.codeSnippetArea);
            }
        }
        
        // Reset input and stats
        this.elements.codeInput.value = '';
        this.elements.codeInput.disabled = false;
        this.isRacing = false;
        this.startTime = null;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Show challenge description
        if (challenge.description && this.elements.challengeDescription) {
            this.elements.challengeDescription.textContent = challenge.description;
        } else if (challenge.description) {
            console.log('Challenge description element not found');
        }

        this.updateStats(true);
    }

    startChallenge() {
        if (!this.isRacing) {
            this.isRacing = true;
            this.elements.codeInput.disabled = false;
            this.elements.codeInput.focus();
            this.startTime = new Date();
            this.updateStats();
            
            // Start the timer
            this.timer = setInterval(() => this.updateStats(), 1000);
        }
    }

    handleInput() {
        if (!this.isRacing) {
            this.startChallenge();
        }

        const currentInput = this.elements.codeInput.value;
        const targetCode = codeSnippets[this.currentLang][this.currentChallenge].code;

        // Check for completion
        if (currentInput === targetCode) {
            this.finishChallenge();
        }

        // Update stats
        this.updateStats();
    }

    finishChallenge() {
        this.isRacing = false;
        clearInterval(this.timer);
        this.timer = null;

        const endTime = new Date();
        const timeElapsed = (endTime - this.startTime) / 1000; // in seconds
        
        // Calculate WPM
        const words = this.elements.codeInput.value.length / 5; // standard word length
        const wpm = Math.round((words / timeElapsed) * 60);

        // Show completion message
        if (this.elements.evaluationResults) {
            this.elements.evaluationResults.innerHTML = `
                <div class="completion-message">
                    <h3>Typing Practice Complete!</h3>
                    <p>Time: ${timeElapsed.toFixed(2)} seconds</p>
                    <p>Speed: ${wpm} WPM</p>
                    <p><small>Complete real challenges in <a href="challenges.html">Challenges</a> to earn points!</small></p>
                </div>
            `;
        }

            // Note: This is the old code-racer.html typing practice, not the actual challenges
            // Real challenge completion happens in solve-challenge.html
            console.log('Code typing practice completed - this does not affect CodeRacer leaderboard');
    }

    resetChallenge() {
        this.isRacing = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.elements.codeInput.value = '';
        this.elements.codeInput.disabled = false;
        this.startTime = null;
        this.updateStats(true);
        this.loadChallenge();
    }

    updateStats(reset = false) {
        if (!this.elements.evaluationResults) return;

        if (reset) {
            this.elements.evaluationResults.innerHTML = '<div class="stats">Ready to start typing!</div>';
            return;
        }

        if (!this.startTime) return;

        const currentTime = new Date();
        const timeElapsed = (currentTime - this.startTime) / 1000; // in seconds
        const currentInput = this.elements.codeInput.value;
        const words = currentInput.length / 5; // standard word length
        const wpm = Math.round((words / timeElapsed) * 60);

        this.elements.evaluationResults.innerHTML = `
            <div class="stats">
                Time: ${timeElapsed.toFixed(2)}s | Speed: ${wpm} WPM
            </div>
        `;
    }

    updateChallengeDescription(description) {
        if (this.elements.challengeDescription) {
            this.elements.challengeDescription.textContent = description;
        }
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