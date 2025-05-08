document.addEventListener('DOMContentLoaded', function() {
    // Initialize finger animations
    initFingerAnimations();
    
    // Initialize practice exercises
    initPracticeExercises();
});

function initFingerAnimations() {
    const fingers = document.querySelectorAll('.finger');
    
    // Initialize the keyboard in the Proper Finger Positioning section
    const keyboardElement = document.querySelector('.finger-positioning .keyboard');
    if (keyboardElement) {
        keyboardElement.id = 'finger-positioning-keyboard';
        initKeyboard('finger-positioning-keyboard');
    }
    
    // Add hover effect to show finger labels
    fingers.forEach(finger => {
        finger.addEventListener('mouseenter', () => {
            finger.querySelector('.finger-label').style.opacity = '1';
        });
        
        finger.addEventListener('mouseleave', () => {
            finger.querySelector('.finger-label').style.opacity = '0';
        });
    });
    
    // Animate fingers for home row position
    animateFingersToHomeRow();
}

function animateFingersToHomeRow() {
    const fingers = document.querySelectorAll('.finger');
    const homeRowPositions = {
        'left-pinky': { top: '50%', left: '10%' },
        'left-ring': { top: '45%', left: '20%' },
        'left-middle': { top: '40%', left: '30%' },
        'left-index': { top: '35%', left: '40%' },
        'right-index': { top: '35%', left: '60%' },
        'right-middle': { top: '40%', left: '70%' },
        'right-ring': { top: '45%', left: '80%' },
        'right-pinky': { top: '50%', left: '90%' }
    };
    
    fingers.forEach(finger => {
        const className = Array.from(finger.classList)
            .find(cls => cls.includes('left-') || cls.includes('right-'));
        
        if (className && homeRowPositions[className]) {
            const position = homeRowPositions[className];
            finger.style.top = position.top;
            finger.style.left = position.left;
        }
    });
}

function initPracticeExercises() {
    const textInputs = document.querySelectorAll('.text-input');
    
    textInputs.forEach(input => {
        const textDisplay = input.previousElementSibling;
        const targetText = textDisplay.textContent;
        
        input.addEventListener('input', () => {
            const currentText = input.value;
            const accuracy = calculateAccuracy(currentText, targetText);
            
            // Update text display with color coding
            updateTextDisplay(textDisplay, currentText, targetText);
            
            // Check if exercise is complete
            if (currentText === targetText) {
                input.disabled = true;
                input.style.borderColor = '#4CAF50';
                showCompletionMessage(input);
            }
        });
    });
}

function calculateAccuracy(current, target) {
    if (current.length === 0) return 0;
    
    let correct = 0;
    for (let i = 0; i < current.length; i++) {
        if (current[i] === target[i]) correct++;
    }
    
    return (correct / target.length) * 100;
}

function updateTextDisplay(display, current, target) {
    let html = '';
    for (let i = 0; i < target.length; i++) {
        if (i < current.length) {
            const char = current[i];
            const isCorrect = char === target[i];
            html += `<span style="color: ${isCorrect ? '#4CAF50' : '#f44336'}">${char}</span>`;
        } else {
            html += `<span style="color: #666">${target[i]}</span>`;
        }
    }
    display.innerHTML = html;
}

function showCompletionMessage(input) {
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.textContent = 'Great job! Try the next exercise.';
    message.style.color = '#4CAF50';
    message.style.marginTop = '10px';
    message.style.textAlign = 'center';
    
    input.parentNode.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
} 