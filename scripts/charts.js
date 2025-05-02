// Chart rendering and progress tracking

// Initialize charts when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup for real-time WPM chart
    setupWPMChart();
    
    // Setup for historical progress chart
    setupHistoryChart();

    // Load user history when page loads
    setTimeout(() => {
        if (window.typingDB) {
            loadUserHistory();
        }
    }, 1000); // Delay to ensure DB is ready
});

// Function to setup real-time WPM chart
function setupWPMChart() {
    const ctx = document.createElement('canvas');
    document.getElementById('progress-chart').appendChild(ctx);
    
    window.wpmChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'WPM Over Time',
                data: [],
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Words Per Minute'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                }
            }
        }
    });
}

// Function to update WPM chart with new data
function updateWPMChart(wpm, elapsedTime) {
    if (!window.wpmChart) return;
    
    // Convert elapsed time to seconds
    const timeInSeconds = Math.floor(elapsedTime / 1000);
    
    // Add new data point
    window.wpmChart.data.labels.push(timeInSeconds);
    window.wpmChart.data.datasets[0].data.push(wpm);
    
    // Update chart
    window.wpmChart.update();
}

// Function to reset WPM chart
function resetWPMChart() {
    if (!window.wpmChart) return;
    
    window.wpmChart.data.labels = [];
    window.wpmChart.data.datasets[0].data = [];
    window.wpmChart.update();
}

// Function to setup history chart
function setupHistoryChart() {
    const ctx = document.createElement('canvas');
    document.getElementById('history-chart').appendChild(ctx);
    
    // Get historical data from localStorage or use empty array
    const historyData = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    
    window.historyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: historyData.map((_, index) => `Test ${index + 1}`),
            datasets: [{
                label: 'WPM',
                data: historyData.map(item => item.wpm),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
            }, {
                label: 'Accuracy %',
                data: historyData.map(item => item.accuracy),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to add new test result to history
function addTestToHistory(testStats) {
    // Get existing history or create new array
    const history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    
    // Add new test data with timestamp
    history.push({
        wpm: testStats.wpm,
        accuracy: testStats.accuracy,
        errors: testStats.errors,
        timestamp: new Date().toISOString(),
        difficulty: currentDifficulty
    });
    
    // Keep only the last 10 tests
    if (history.length > 10) {
        history.shift();
    }
    
    // Save back to localStorage
    localStorage.setItem('typingHistory', JSON.stringify(history));
    
    // Update history chart
    updateHistoryChart();
}

// Function to update history chart with new data
function updateHistoryChart() {
    if (!window.historyChart) return;
    
    const historyData = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    
    window.historyChart.data.labels = historyData.map((_, index) => `Test ${index + 1}`);
    window.historyChart.data.datasets[0].data = historyData.map(item => item.wpm);
    window.historyChart.data.datasets[1].data = historyData.map(item => item.accuracy);
    
    window.historyChart.update();
}

// Function to load user history for charts
async function loadUserHistory() {
    const currentUser = localStorage.getItem('typingTestUser');
    if (currentUser && window.typingDB) {
        try {
            const records = await window.typingDB.getTypingRecords(currentUser);
            if (records.length > 0) {
                // Reverse records to show oldest to newest for progress chart
                const chartRecords = [...records].reverse().slice(0, 10);
                
                // Update history chart with actual data
                updateHistoryChartWithData(chartRecords);
                
                // Show progress chart if we have enough data
                if (records.length > 1) {
                    document.getElementById('progress-chart').style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error loading user history:', error);
        }
    }
}

// Function to update history chart with specific data
function updateHistoryChartWithData(records) {
    if (!window.historyChart) return;
    
    window.historyChart.data.labels = records.map((record, index) => 
        `Test ${index + 1}`
    );
    
    window.historyChart.data.datasets[0].data = records.map(record => record.wpm);
    window.historyChart.data.datasets[1].data = records.map(record => record.accuracy);
    
    window.historyChart.update();
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.chartFunctions = {
        updateWPMChart,
        resetWPMChart,
        addTestToHistory
    };
} 