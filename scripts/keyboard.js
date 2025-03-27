// Keyboard layout configuration
const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
];

// Key class mappings
const keyClasses = {
    'Backspace': 'wide',
    'Tab': 'wide',
    'Caps': 'wide',
    'Enter': 'wide',
    'Shift': 'extra-wide',
    'Ctrl': 'wide',
    'Win': 'wide',
    'Alt': 'wide',
    'Space': 'space',
    'Menu': 'wide'
};

// Initialize the keyboard
function initKeyboard() {
    const keyboardElement = document.getElementById('keyboard');
    if (!keyboardElement) return;

    // Clear any existing keyboard
    keyboardElement.innerHTML = '';

    // Create rows
    keyboardLayout.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';

        // Create keys
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';
            keyElement.dataset.key = key.toLowerCase();
            
            // Add special classes
            if (keyClasses[key]) {
                keyElement.classList.add(keyClasses[key]);
            }

            // Set key label
            keyElement.textContent = key === 'Space' ? '' : key;
            
            rowElement.appendChild(keyElement);
        });

        keyboardElement.appendChild(rowElement);
    });
}

// Highlight a key on the keyboard
function highlightKey(keyChar) {
    // Clear all highlights first
    clearKeyHighlights();

    if (!keyChar) return;

    // Convert keyChar to lowercase for matching
    keyChar = keyChar.toLowerCase();
    
    // Handle space key separately
    if (keyChar === ' ') keyChar = 'space';
    
    // Find the key and highlight it
    const keyElement = document.querySelector(`.key[data-key="${keyChar}"]`);
    if (keyElement) {
        keyElement.classList.add('highlight');
    }
}

// Clear all key highlights
function clearKeyHighlights() {
    const highlightedKeys = document.querySelectorAll('.key.highlight');
    highlightedKeys.forEach(key => key.classList.remove('highlight'));
}

// Initialize the keyboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', initKeyboard);

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.keyboardFunctions = {
        initKeyboard,
        highlightKey,
        clearKeyHighlights
    };
} 