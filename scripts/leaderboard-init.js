// Leaderboard initialization and auto-refresh
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    setInterval(()=>loadLeaderboard(),30000);
});