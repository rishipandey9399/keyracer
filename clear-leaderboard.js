// Clear all leaderboard data due to cheating
async function clearAllLeaderboardData() {
    console.log('Clearing all leaderboard data...');
    
    // Clear localStorage
    localStorage.removeItem('typingRecords');
    localStorage.removeItem('leaderboard_update');
    
    // Clear IndexedDB
    if (window.indexedDB) {
        try {
            const request = indexedDB.open('TypingSpeedDB', 1);
            
            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['typingRecords'], 'readwrite');
                const store = transaction.objectStore('typingRecords');
                
                const clearRequest = store.clear();
                
                clearRequest.onsuccess = function() {
                    console.log('IndexedDB typing records cleared successfully');
                    alert('All leaderboard data has been cleared due to cheating violations.');
                    
                    // Reload the page to refresh the leaderboard
                    window.location.reload();
                };
                
                clearRequest.onerror = function(e) {
                    console.error('Error clearing IndexedDB:', e);
                };
            };
            
            request.onerror = function(e) {
                console.error('Error opening database:', e);
            };
        } catch (error) {
            console.error('Error accessing IndexedDB:', error);
        }
    }
    
    // Clear server-side data if API exists
    try {
        const response = await fetch('/api/leaderboard/clear', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            console.log('Server leaderboard data cleared');
        }
    } catch (error) {
        console.log('No server API available or error clearing server data');
    }
}

// Execute immediately
clearAllLeaderboardData();