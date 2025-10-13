// Preloader animation
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loader-bar');
    const loadingText = document.getElementById('loading-text');
    let width = 0;
    
    // Dynamic loading messages
    const loadingMessages = [
        "Preparing hackathon environment",
        "Initializing collaboration tools",
        "Loading anti-cheating systems",
        "Setting up tech stack options",
        "Configuring participant interfaces",
        "Establishing secure connections",
        "Ready to launch!"
    ];
    
    let messageIndex = 0;
    
    // Change loading message periodically
    const messageInterval = setInterval(function() {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[messageIndex];
    }, 2000);
    
    const interval = setInterval(function() {
        width += Math.floor(Math.random() * 10) + 1;
        if (width > 100) width = 100;
        loaderBar.style.width = width + '%';
        
        if (width === 100) {
            clearInterval(interval);
            clearInterval(messageInterval);
            loadingText.textContent = "Launch complete!";
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 800);
        }
    }, 100);
});