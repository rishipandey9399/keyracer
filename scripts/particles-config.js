// Particles.js configuration and initialization
function initializeParticles() {
    // Initialize particles.js with error handling
    if (typeof particlesJS !== 'undefined') {
        try {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": ["#FFC700", "#FF4A4A", "#00FFDD", "#00C2FF"] },
                    "shape": { "type": ["circle", "triangle", "edge"], "polygon": { "nb_sides": 5 } },
                    "opacity": { "value": 0.6, "random": true },
                    "size": { "value": 5, "random": true },
                    "line_linked": { "enable": true, "distance": 150, "color": "#00C2FF", "opacity": 0.5, "width": 1.5 },
                    "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": true, "rotateX": 600, "rotateY": 1200 } }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                      "onhover": { "enable": true, "mode": "grab" },
                      "onclick": { "enable": true, "mode": "push" },
                      "resize": true
                    },
                    "modes": {
                      "grab": { "distance": 180, "line_linked": { "opacity": 0.8 } },
                      "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                      "repulse": { "distance": 200, "duration": 0.4 },
                      "push": { "particles_nb": 6 },
                      "remove": { "particles_nb": 2 }
                    }
                },
                "retina_detect": true
            });
        } catch (error) {
            console.log('Particles.js failed to load:', error);
        }
    } else {
        console.log('Particles.js not available');
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeParticles);