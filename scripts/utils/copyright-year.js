// Utility function to set current year for copyright
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setCurrentYear);