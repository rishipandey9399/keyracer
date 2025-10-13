// Preloader functionality for preference page
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loader-bar');
    const loadingText = document.getElementById('loading-text');
    let width = 0;
    const loadingMessages = [
        "Loading your experience...",
        "Preparing your dashboard...",
        "Setting up your preferences...",
        "Almost ready!"
    ];
    let messageIndex = 0;
    
    const messageInterval = setInterval(function() {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[messageIndex];
    }, 1200);
    
    const interval = setInterval(function() {
        width += Math.floor(Math.random() * 10) + 1;
        if (width > 100) width = 100;
        loaderBar.style.width = width + '%';
        if (width === 100) {
            clearInterval(interval);
            clearInterval(messageInterval);
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 500);
        }
    }, 100);
}

// Initialize preloader when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePreloader);