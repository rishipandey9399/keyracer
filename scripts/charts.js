// Chart rendering and progress tracking

// Initialize charts when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial delay to ensure DOM is fully loaded
    setTimeout(() => {
        if (window.chartFunctions) {
            window.chartFunctions.initCharts();
        }
    }, 500);
});

// Function to initialize all charts
function initCharts() {
    console.log('Initializing charts...');
    
    // Setup for historical progress chart if element exists
    if (document.getElementById('history-chart')) {
        setupHistoryChart();
        
        // Load user history when charts are initialized
        setTimeout(() => {
            if (window.typingDB) {
                loadUserHistory();
            }
        }, 1000); // Delay to ensure DB is ready
    } else {
        console.log('History chart container not found on this page');
    }
}

// Function to setup history chart
function setupHistoryChart() {
    const historyChartContainer = document.getElementById('history-chart');
    
    if (!historyChartContainer) {
        console.log('History chart container not found on this page');
        return;
    }
    
    // Create canvas if it doesn't exist
    let ctx = historyChartContainer.querySelector('canvas');
    if (!ctx) {
        ctx = document.createElement('canvas');
        historyChartContainer.appendChild(ctx);
    }
    
    // Get historical data from localStorage or use empty array
    const historyData = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please ensure the script is included.');
        return;
    }
    
    try {
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
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

// Function to add new test result to history
function addTestToHistory(testStats) {
    // Get existing history or create new array
    const history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    
    // Make sure accuracy is consistent (0-100 percentage)
    let accuracy = testStats.accuracy;
    if (accuracy <= 1) {
        accuracy = Math.round(accuracy * 100);
    }
    
    // Add new test data with timestamp
    history.push({
        wpm: testStats.wpm,
        accuracy: accuracy,
        errors: testStats.errors,
        timestamp: new Date().toISOString(),
        difficulty: testStats.difficulty || window.currentDifficulty || 'beginner',
        mode: testStats.mode || 'standard'
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
                // Also store in localStorage for quick access
                const historyData = records.slice(0, 10).map(record => {
                    // Ensure accuracy is percentage (0-100)
                    let accuracy = record.accuracy;
                    if (accuracy <= 1) {
                        accuracy = Math.round(accuracy * 100);
                    }
                    
                    return {
                        wpm: record.wpm,
                        accuracy: accuracy,
                        errors: record.errors,
                        timestamp: record.timestamp,
                        difficulty: record.difficulty || 'beginner',
                        mode: record.mode || 'standard'
                    };
                });
                
                localStorage.setItem('typingHistory', JSON.stringify(historyData));
                
                // Reverse records to show oldest to newest for progress chart
                const chartRecords = [...records].reverse().slice(0, 10);
                
                // Update history chart with actual data
                updateHistoryChartWithData(chartRecords);
            }
        } catch (error) {
            console.error('Error loading user history:', error);
        }
    }
}

// Function to update history chart with specific data
function updateHistoryChartWithData(records) {
    if (!window.historyChart) return;
    
    // Process records to ensure consistent data format
    const processedRecords = records.map(record => {
        // Ensure accuracy is percentage (0-100)
        let accuracy = record.accuracy;
        if (accuracy <= 1) {
            accuracy = Math.round(accuracy * 100);
        }
        
        return {
            ...record,
            accuracy: accuracy
        };
    });
    
    window.historyChart.data.labels = processedRecords.map((_, index) => 
        `Test ${index + 1}`
    );
    
    window.historyChart.data.datasets[0].data = processedRecords.map(record => record.wpm);
    window.historyChart.data.datasets[1].data = processedRecords.map(record => record.accuracy);
    
    window.historyChart.update();
}

// For compatibility with other scripts that might call these functions
function updateWPMChart() {
    // No-op function since we've removed the WPM chart
}

function resetWPMChart() {
    // No-op function since we've removed the WPM chart
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.chartFunctions = {
        updateWPMChart,
        resetWPMChart,
        addTestToHistory,
        updateHistoryChart,
        loadUserHistory,
        initCharts
    };
} 