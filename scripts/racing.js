// Code snippets database
const codeSnippets = {
    javascript: {
        easy: [
            `function greet(name) {\n    return "Hello, " + name + "!";\n}`,
            `const sum = (a, b) => a + b;`,
            `let counter = 0;\nfunction increment() {\n    counter++;\n}`
        ],
        medium: [
            `function fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}`,
            `const filterArray = arr => arr.filter(item => typeof item === 'number');`
        ],
        hard: [
            `class BinarySearchTree {\n    constructor() {\n        this.root = null;\n    }\n}`,
            `const quickSort = arr => {\n    if (arr.length <= 1) return arr;\n    // ... complex sorting logic\n}`
        ]
    },
    python: {
        easy: [
            `def greet(name):\n    return f"Hello, {name}!"`,
            `numbers = [1, 2, 3, 4, 5]\nsum = sum(numbers)`,
            `def is_even(n):\n    return n % 2 == 0`
        ],
        medium: [
            `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]`,
        ],
        hard: [
            `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None`,
        ]
    },
    // Add more languages as needed
};

// Reset functionality
function resetRace() {
    // Reset timer
    clearInterval(timerInterval);
    timeElapsed = 0;
    updateTimer();
    
    // Reset typing progress
    currentIndex = 0;
    mistakes = 0;
    wordsPerMinute = 0;
    accuracy = 100;
    
    // Reset UI
    updateStats();
    highlightCurrentCharacter();
    
    // Clear user input
    userInput.value = '';
    userInput.disabled = false;
    
    // Reset code display
    const currentLanguage = document.querySelector('.language-select').value;
    const currentDifficulty = document.querySelector('.difficulty-select').value;
    loadNewCodeSnippet(currentLanguage, currentDifficulty);
}

// Load new code snippet based on language and difficulty
function loadNewCodeSnippet(language, difficulty) {
    const snippets = codeSnippets[language][difficulty];
    const randomIndex = Math.floor(Math.random() * snippets.length);
    const codeSnippet = snippets[randomIndex];
    
    document.querySelector('.code-display').textContent = codeSnippet;
    currentText = codeSnippet;
    highlightCurrentCharacter();
}

// Event listeners
document.querySelector('.reset-btn').addEventListener('click', resetRace);
document.querySelector('.language-select').addEventListener('change', (e) => {
    loadNewCodeSnippet(e.target.value, document.querySelector('.difficulty-select').value);
    resetRace();
});
document.querySelector('.difficulty-select').addEventListener('change', (e) => {
    loadNewCodeSnippet(document.querySelector('.language-select').value, e.target.value);
    resetRace();
});