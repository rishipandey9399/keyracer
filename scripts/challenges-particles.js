// Particles.js configuration for challenges page
function initializeChallengesParticles() {
    if (typeof particlesJS !== 'undefined') {
        try {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80 },
                    "color": { "value": "#00C2FF" },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5 },
                    "size": { "value": 3 },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#00C2FF",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": { "enable": true, "speed": 2 }
                },
                "interactivity": {
                    "events": {
                        "onhover": { "enable": true, "mode": "repulse" }
                    }
                }
            });
        } catch (error) {
            console.log('Particles.js failed to load:', error);
        }
    } else {
        console.log('Particles.js not available');
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChallengesParticles);