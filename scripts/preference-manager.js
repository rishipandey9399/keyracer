// Preference management functions
function markPreferencesComplete(preferenceType) {
    // Store the user's preference
    localStorage.setItem('userPreference', preferenceType);
    
    // Also mark that preferences have been set
    localStorage.setItem('preferencesComplete', 'true');
    
    // Add XP for making a selection
    const userStats = JSON.parse(localStorage.getItem('userStats')) || {
        wpm: 0,
        accuracy: 0,
        xp: 0,
        level: 1
    };
    
    userStats.xp = (userStats.xp || 0) + 5;
    if (userStats.xp >= 100) {
        userStats.level = (userStats.level || 1) + 1;
        userStats.xp = userStats.xp - 100;
    }
    
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

// Add keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const cards = document.querySelectorAll('.preference-card');
        let focusedCard = document.activeElement.closest('.preference-card');
        let focusedIndex = -1;
        
        if (focusedCard) {
            for (let i = 0; i < cards.length; i++) {
                if (cards[i] === focusedCard) {
                    focusedIndex = i;
                    break;
                }
            }
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                if (focusedIndex > 0) {
                    cards[focusedIndex - 1].querySelector('.card-btn').focus();
                } else if (focusedIndex === -1) {
                    cards[0].querySelector('.card-btn').focus();
                }
                break;
            case 'ArrowRight':
                if (focusedIndex < cards.length - 1) {
                    cards[focusedIndex + 1].querySelector('.card-btn').focus();
                } else if (focusedIndex === -1) {
                    cards[0].querySelector('.card-btn').focus();
                }
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                if (focusedIndex === -1) {
                    cards[0].querySelector('.card-btn').focus();
                }
                break;
        }
    });
}

// Initialize keyboard navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeKeyboardNavigation);