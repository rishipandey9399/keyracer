/**
 * Key Racer Lessons Integration
 * This script provides only the necessary race countdown functionality
 * for the lessons page without the full main.js code
 */

// Race start countdown - shared with main.js
window.showRaceStartCountdown = function() {
    return new Promise((resolve) => {
        // Create race start lights element if it doesn't exist
        let raceStartLights = document.querySelector('.race-start-lights');
        
        if (!raceStartLights) {
            raceStartLights = document.createElement('div');
            raceStartLights.className = 'race-start-lights';
            
            const lightsContainer = document.createElement('div');
            lightsContainer.className = 'lights-container';
            
            // Create racing lights
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
        }
        
        // Show the lights container
        raceStartLights.classList.add('active');
        
        // Countdown sequence
        let count = 3;
        const lights = raceStartLights.querySelectorAll('.light');
        const countdownNumber = raceStartLights.querySelector('.countdown-number');
        
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
                countdownNumber.classList.add('go-text');
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
                        countdownNumber.classList.remove('visible', 'go-text');
                    }, 300);
                    resolve();
                }, 1000);
            }
        }
        
        // Start the countdown
        updateCountdown();
    });
};

console.log('Lessons integration script loaded - race animation available'); 