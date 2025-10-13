// Leaderboard Manager Functions
function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderLeaderboard(leaderboardData) {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    if (!leaderboardData || leaderboardData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2rem; color:#b3b8d0;"><i class='fas fa-trophy'></i> No participants yet. Complete challenges to appear on the leaderboard!</td></tr>`;
        return;
    }
    let currentUserName = null;
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) currentUserName = user.displayName || user.username || user.name || null;
    } catch (e) {
        // fallback for old login
        const legacy = localStorage.getItem('typingTestUser');
        if (legacy) currentUserName = legacy;
    }
    leaderboardData.forEach(entry => {
        const stats = entry.stats || {};
        const totalPoints = typeof stats.totalPoints === 'number' ? stats.totalPoints : 0;
        const challengesCompleted = typeof stats.challengesCompleted === 'number' ? stats.challengesCompleted : 0;
        let playerName = (entry.user && entry.user.name) ? entry.user.name : 'Player';
        const isCurrentUser = currentUserName && playerName && playerName.toLowerCase() === currentUserName.toLowerCase();
        const row = document.createElement('tr');
        if (isCurrentUser) row.classList.add('highlighted');
        
        let rankDisplay = entry.rank;
        if (entry.rank === 1) rankDisplay = '🥇';
        else if (entry.rank === 2) rankDisplay = '🥈';
        else if (entry.rank === 3) rankDisplay = '🥉';
        
        row.innerHTML = `
            <td>${rankDisplay}</td>
            <td><div class="racer-cell"><span class="racer-avatar">${escapeHtml(playerName.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2))}</span><span class="racer-name">${escapeHtml(playerName)}</span></div></td>
            <td>${totalPoints.toLocaleString()}</td>
            <td>${challengesCompleted}</td>
        `;
        tbody.appendChild(row);
    });
}

function showLoading() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = `<tr class='loading-placeholder'><td colspan='3' style='text-align:center; padding:2.5rem; color:#64ffda;'><i class='fas fa-spinner fa-spin' style='font-size:2rem; margin-bottom:1rem;'></i><p>Loading champion rankings...</p></td></tr>`;
}

async function loadLeaderboard(page=1) {
    showLoading();
    try {
        const params = new URLSearchParams({page,limit:50});
        const response = await fetch(`/api/coderacer-leaderboard?${params}`);
        const data = await response.json();
        if (data.success) renderLeaderboard(data.data.leaderboard);
        else renderLeaderboard([]);
    } catch (e) {
        renderLeaderboard([]);
    }
}