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
const racingKeys = ['w', 'a', 's', 'd', 'Space', 'Shift'];

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
            
            // Add racing theme to racing keys
            if (racingKeys.includes(key.toLowerCase()) || racingKeys.includes(key)) {
                keyElement.classList.add('racing-key');
                
                // Add racing stripe to Space bar
                if (key === 'Space') {
                    const stripe = document.createElement('div');
                    stripe.className = 'racing-stripe';
                    keyElement.appendChild(stripe);
                }
                
                // Add special icon to racing control keys
                if (['w', 'a', 's', 'd'].includes(key.toLowerCase())) {
                    const icon = document.createElement('i');
                    
                    if (key.toLowerCase() === 'w') {
                        icon.className = 'fas fa-chevron-up racing-icon';
                    } else if (key.toLowerCase() === 'a') {
                        icon.className = 'fas fa-chevron-left racing-icon';
                    } else if (key.toLowerCase() === 's') {
                        icon.className = 'fas fa-chevron-down racing-icon';
                    } else if (key.toLowerCase() === 'd') {
                        icon.className = 'fas fa-chevron-right racing-icon';
                    }
                    
                    keyElement.appendChild(icon);
                }
                
                // Add boost icon to Shift keys
                if (key === 'Shift') {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-bolt racing-icon-small';
                    keyElement.appendChild(icon);
                }
            }

            // Set key label
            if (key === 'Space') {
                keyElement.setAttribute('aria-label', 'Space');
            } else {
                keyElement.textContent = key;
            }
            
            rowElement.appendChild(keyElement);
        });

        keyboardElement.appendChild(rowElement);
    });
    
    // Add glow effect to keyboard
    addKeyboardEffects(keyboardId);
}

// Add enhanced effects to the keyboard
function addKeyboardEffects(keyboardId = 'keyboard') {
    const keyboard = document.getElementById(keyboardId);
    if (!keyboard) return;
    
    // Add perspective and 3D effect to keyboard
    keyboard.style.transform = 'perspective(1200px) rotateX(12deg)';
    keyboard.style.transformStyle = 'preserve-3d';
    keyboard.style.transition = 'all 0.5s ease';

    // Add ambient light effect
    const ambientLight = document.createElement('div');
    ambientLight.className = 'keyboard-ambient-light';
    keyboard.parentNode.insertBefore(ambientLight, keyboard);

    // Add hover effect to keyboard
    keyboard.addEventListener('mouseover', function() {
        keyboard.style.transform = 'perspective(1200px) rotateX(8deg)';
        ambientLight.style.opacity = '0.7';
    });
    
    keyboard.addEventListener('mouseout', function() {
        keyboard.style.transform = 'perspective(1200px) rotateX(12deg)';
        ambientLight.style.opacity = '0.4';
    });
    
    // Add 3D effect to keys with staggered animation
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach((key, index) => {
        // Add random delay for each key for a wave effect
        const delay = Math.random() * 0.5;
        key.style.animation = `keyAppear 0.5s ${delay}s both`;
        
        // Add transform for 3D effect
            key.style.transform = 'translateZ(5px)';
        
        // Add hover effect to individual keys
        key.addEventListener('mouseover', function() {
            if (!this.classList.contains('highlight')) {
                this.style.transform = 'translateZ(10px) translateY(-2px)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
            }
        });
        
        key.addEventListener('mouseout', function() {
            if (!this.classList.contains('highlight')) {
                this.style.transform = 'translateZ(5px)';
                this.style.boxShadow = '';
            }
        });
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
            
            // Add speedline effect for racing keys
            if (['w', 'a', 's', 'd', 'space'].includes(keyChar)) {
                createSpeedLines(keyElement);
            }
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
    
    // Create 8 particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('key-particle');
        
        // Random position around the key
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top - 5;
        
        // Set initial position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random color
        const colors = ['#FF4A4A', '#00FFDD', '#FFD700', '#00C2FF'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = 3 + Math.random() * 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Add to document
        document.body.appendChild(particle);
        
        // Animate and remove
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Create speed lines for racing key effects
function createSpeedLines(keyElement) {
    const rect = keyElement.getBoundingClientRect();
    const direction = keyElement.dataset.key;
    
    // Create 5 speed lines
    for (let i = 0; i < 5; i++) {
        const speedLine = document.createElement('div');
        speedLine.classList.add('speed-line');
        
        // Position based on key and direction
        let x = rect.left + rect.width / 2;
        let y = rect.top + rect.height / 2;
        
        // Set line position and style
        speedLine.style.left = `${x}px`;
        speedLine.style.top = `${y}px`;
        
        // Set direction based on key
        if (direction === 'w') {
            speedLine.style.transform = `rotate(${90 + (Math.random() * 30 - 15)}deg)`;
        } else if (direction === 's') {
            speedLine.style.transform = `rotate(${270 + (Math.random() * 30 - 15)}deg)`;
        } else if (direction === 'a') {
            speedLine.style.transform = `rotate(${180 + (Math.random() * 30 - 15)}deg)`;
        } else if (direction === 'd') {
            speedLine.style.transform = `rotate(${0 + (Math.random() * 30 - 15)}deg)`;
        } else {
            // Random direction for space
            speedLine.style.transform = `rotate(${Math.random() * 360}deg)`;
        }
        
        // Random length
        const length = 30 + Math.random() * 50;
        speedLine.style.width = `${length}px`;
        
        // Add to document
        document.body.appendChild(speedLine);
        
        // Animate and remove
        setTimeout(() => {
            speedLine.remove();
        }, 500);
    }
}

// Initialize the keyboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initKeyboard();
    
    // Add CSS for enhanced keyboard effects
    const style = document.createElement('style');
    style.textContent = `
        /* Racing key styling */
        .racing-key {
            background: linear-gradient(to bottom, var(--primary-color), #AA1612) !important;
            border-color: var(--primary-color) !important;
            color: white !important;
        }
        
        .racing-stripe {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 8px;
            background: repeating-linear-gradient(
                90deg,
                #FFC700 0px,
                #FFC700 20px,
                var(--secondary-color) 20px,
                var(--secondary-color) 40px
            );
            transform: translateY(-50%);
            opacity: 0.7;
            border-radius: 4px;
        }
        
        .racing-icon {
            position: absolute;
            font-size: 0.8rem;
            opacity: 0.7;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .racing-icon-small {
            position: absolute;
            font-size: 0.7rem;
            right: 10px;
            top: 10px;
            color: #FFC700;
        }
        
        /* Keyboard ambient light */
        .keyboard-ambient-light {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at 50% 50%,
                var(--accent-color) 0%,
                transparent 70%
            );
            opacity: 0.4;
            pointer-events: none;
            transition: all 0.5s ease;
            z-index: 0;
        }
        
        /* Key particle effects */
        .key-particle {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            pointer-events: none;
            animation: key-particle 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            z-index: 1000;
            filter: blur(1px);
        }
        
        @keyframes key-particle {
            0% { 
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% { 
                opacity: 0;
                transform: translate(${Math.random() * 50 - 25}px, -40px) scale(0);
            }
        }
        
        /* Speed line effects */
        .speed-line {
            position: fixed;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--accent-color), transparent);
            pointer-events: none;
            z-index: 999;
            opacity: 0.7;
            transform-origin: left center;
            animation: speed-line 0.5s ease-out forwards;
        }
        
        @keyframes speed-line {
            0% {
                opacity: 0.7;
                transform: translateX(0) scaleX(0);
            }
            100% {
                opacity: 0;
                transform: translateX(20px) scaleX(1);
            }
        }
        
        /* Key appear animation */
        @keyframes keyAppear {
            0% {
                opacity: 0;
                transform: translateZ(-10px);
            }
            100% {
                opacity: 1;
                transform: translateZ(5px);
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