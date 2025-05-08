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

// Special keys with racing themes
const racingKeys = ['w', 'a', 's', 'd', 'Space'];

// Initialize the keyboard
function initKeyboard(keyboardId = 'keyboard') {
    const keyboardElement = document.getElementById(keyboardId);
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
            
            // Add racing theme to WASD keys
            if (racingKeys.includes(key.toLowerCase())) {
                keyElement.classList.add('racing-key');
                
                // Add racing stripe to Space bar
                if (key === 'Space') {
                    const stripe = document.createElement('div');
                    stripe.className = 'racing-stripe';
                    keyElement.appendChild(stripe);
                }
            }

            // Set key label
            keyElement.textContent = key === 'Space' ? '' : key;
            
            rowElement.appendChild(keyElement);
        });

        keyboardElement.appendChild(rowElement);
    });
    
    // Add 3D effect to keyboard
    add3DEffect(keyboardId);
}

// Add 3D effect to the keyboard
function add3DEffect(keyboardId = 'keyboard') {
    const keyboard = document.getElementById(keyboardId);
    if (!keyboard) return;
    
    // Add perspective to keyboard
    keyboard.style.transform = 'perspective(1000px) rotateX(10deg)';
    keyboard.style.transformStyle = 'preserve-3d';

    // Add hover effect
    keyboard.addEventListener('mouseover', function() {
        keyboard.style.transform = 'perspective(1000px) rotateX(5deg)';
    });
    
    keyboard.addEventListener('mouseout', function() {
        keyboard.style.transform = 'perspective(1000px) rotateX(10deg)';
    });
    
    // Add 3D effect to keys
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach((key, index) => {
        // Add slight delay for each key
        setTimeout(() => {
            key.style.transform = 'translateZ(5px)';
        }, index * 10);
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
        
        // Add particle effect for racing keys
        if (racingKeys.includes(keyChar)) {
            createKeyParticle(keyElement);
        }
    }
}

// Clear all key highlights
function clearKeyHighlights() {
    const highlightedKeys = document.querySelectorAll('.key.highlight');
    highlightedKeys.forEach(key => key.classList.remove('highlight'));
}

// Create particles for key press effects
function createKeyParticle(keyElement) {
    const rect = keyElement.getBoundingClientRect();
    const keyboard = document.getElementById('keyboard');
    
    // Create 5 particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('key-particle');
        
        // Random position around the key
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top - 5;
        
        // Set initial position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random color
        const colors = ['#FF4A4A', '#00FFDD', '#FFD700'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Add to document
        document.body.appendChild(particle);
        
        // Animate and remove
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}

// Initialize the keyboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initKeyboard();
    
    // Add CSS for particle effects
    const style = document.createElement('style');
    style.textContent = `
        .racing-key {
            background: linear-gradient(to bottom, var(--racing-stripe-light), var(--key-bg)) !important;
            border-color: var(--racing-stripe-light) !important;
        }
        
        .racing-stripe {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 6px;
            background: repeating-linear-gradient(
                90deg,
                var(--racing-stripe-light) 0px,
                var(--racing-stripe-light) 20px,
                var(--racing-stripe-dark) 20px,
                var(--racing-stripe-dark) 40px
            );
            transform: translateY(-50%);
            opacity: 0.5;
        }
        
        .key-particle {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            pointer-events: none;
            animation: key-particle 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            z-index: 1000;
        }
        
        @keyframes key-particle {
            0% { 
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% { 
                opacity: 0;
                transform: translate(${Math.random() * 30 - 15}px, -20px) scale(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.keyboardFunctions = {
        initKeyboard,
        highlightKey,
        clearKeyHighlights
    };
} 