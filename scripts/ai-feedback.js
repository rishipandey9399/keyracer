// AI Feedback Generator

function generateAIFeedback(testStats) {
    const { wpm, accuracy, errors, errorChars, slowestKeys, consistencyScore } = testStats;
    
    // Create feedback based on performance metrics
    let feedback = '';
    
    // Speed feedback
    if (wpm < 20) {
        feedback += `<p><strong>Speed (${wpm} WPM):</strong> You're currently typing at a beginner's pace. With regular practice, you can significantly improve your speed.</p>`;
    } else if (wpm < 40) {
        feedback += `<p><strong>Speed (${wpm} WPM):</strong> You're typing at a modest speed. Continue practicing to reach the average typing speed of 40-60 WPM.</p>`;
    } else if (wpm < 60) {
        feedback += `<p><strong>Speed (${wpm} WPM):</strong> Your typing speed is approaching the average range. Keep up the good work!</p>`;
    } else if (wpm < 80) {
        feedback += `<p><strong>Speed (${wpm} WPM):</strong> You're typing at an above-average speed. Well done!</p>`;
    } else {
        feedback += `<p><strong>Speed (${wpm} WPM):</strong> Excellent typing speed! You're typing faster than most people.</p>`;
    }
    
    // Accuracy feedback
    if (accuracy < 85) {
        feedback += `<p><strong>Accuracy (${accuracy}%):</strong> Your accuracy needs improvement. Try slowing down slightly to focus on hitting the correct keys.</p>`;
    } else if (accuracy < 95) {
        feedback += `<p><strong>Accuracy (${accuracy}%):</strong> Your accuracy is decent. With practice, you can reach 95% or higher.</p>`;
    } else {
        feedback += `<p><strong>Accuracy (${accuracy}%):</strong> Excellent accuracy! You're making very few mistakes.</p>`;
    }
    
    // Error analysis
    if (errors > 0 && errorChars && errorChars.length > 0) {
        feedback += `<p><strong>Common Errors:</strong> You struggled most with these characters: ${errorChars.slice(0, 3).join(', ')}. Focus on these in your practice.</p>`;
    }
    
    // Consistency feedback
    if (consistencyScore < 60) {
        feedback += `<p><strong>Consistency:</strong> Your typing rhythm is inconsistent. Try to maintain a steady pace rather than typing in bursts.</p>`;
    } else if (consistencyScore < 80) {
        feedback += `<p><strong>Consistency:</strong> You have a reasonably consistent typing rhythm. Keep working on maintaining a steady pace.</p>`;
    } else {
        feedback += `<p><strong>Consistency:</strong> You have excellent typing rhythm and consistency. This is a sign of a skilled typist!</p>`;
    }
    
    // Problem keys feedback
    if (slowestKeys && slowestKeys.length > 0) {
        feedback += `<p><strong>Areas for Improvement:</strong> Practice with these keys that slowed you down: ${slowestKeys.slice(0, 3).join(', ')}.</p>`;
    }
    
    // Add personalized tips based on level
    feedback += generatePersonalizedTips(wpm, accuracy);
    
    // Add heat map analysis
    if (testStats.heatmap) {
        feedback += analyzeHeatmapData(testStats.heatmap);
    }
    
    // Add speed pattern analysis
    if (testStats.wpm > 0 && testStats.speedPattern) {
        feedback += analyzeSpeedPattern(testStats.speedPattern);
    }
    
    return feedback;
}

function generatePersonalizedTips(wpm, accuracy) {
    let tips = '<p><strong>Tips to Improve:</strong></p><ul>';
    
    // General tips for everyone
    tips += '<li>Practice regularly, even if just for 10-15 minutes per day.</li>';
    
    // Speed-specific tips
    if (wpm < 30) {
        tips += '<li>Focus on proper finger positioning using the home row (ASDF JKL;).</li>';
        tips += '<li>Don\'t look at the keyboard as you type (use our virtual keyboard guide instead).</li>';
    } else if (wpm < 60) {
        tips += '<li>Try timed exercises to push your speed slightly beyond your comfort zone.</li>';
        tips += '<li>Practice with common digraphs (two-letter combinations) like "th", "in", "er".</li>';
    } else {
        tips += '<li>Challenge yourself with advanced texts that include special characters and punctuation.</li>';
        tips += '<li>Work on maintaining speed while switching between different types of content.</li>';
    }
    
    // Accuracy-specific tips
    if (accuracy < 90) {
        tips += '<li>Slow down slightly and focus on hitting the correct keys.</li>';
        tips += '<li>Do targeted practice with the characters you frequently miss.</li>';
    }
    
    tips += '</ul>';
    
    return tips;
}

// Function to analyze typing data and create test stats
function analyzeTypingData(typingData, totalTime) {
    // Extract typing data
    const { text, userInput, keyTimings } = typingData;
    
    // Calculate basic metrics
    const totalChars = userInput.length;
    const words = totalChars / 5; // Standard WPM calculation (5 chars = 1 word)
    const minutes = totalTime / 60000; // Convert ms to minutes
    const wpm = Math.round(words / minutes);
    
    // Calculate accuracy
    let correctChars = 0;
    const errorMap = {};
    
    for (let i = 0; i < Math.min(text.length, userInput.length); i++) {
        if (text[i] === userInput[i]) {
            correctChars++;
        } else if (userInput[i]) {
            // Track error characters
            errorMap[text[i]] = (errorMap[text[i]] || 0) + 1;
        }
    }
    
    const accuracy = Math.round((correctChars / text.length) * 100);
    const errors = text.length - correctChars;
    
    // Find most problematic characters
    const errorChars = Object.keys(errorMap).sort((a, b) => errorMap[b] - errorMap[a]);
    
    // Analyze key timing data to find slowest keys
    const keyTimingMap = {};
    
    if (keyTimings && keyTimings.length > 0) {
        for (let i = 1; i < keyTimings.length; i++) {
            const key = userInput[i - 1];
            const timeDiff = keyTimings[i] - keyTimings[i - 1];
            
            if (!keyTimingMap[key]) {
                keyTimingMap[key] = [];
            }
            
            // Only include reasonable timing differences (less than 2 seconds)
            if (timeDiff < 2000) {
                keyTimingMap[key].push(timeDiff);
            }
        }
    }
    
    // Calculate average time for each key
    const keyAverages = {};
    for (const key in keyTimingMap) {
        const times = keyTimingMap[key];
        if (times.length > 0) {
            keyAverages[key] = times.reduce((sum, time) => sum + time, 0) / times.length;
        }
    }
    
    // Find slowest keys
    const slowestKeys = Object.keys(keyAverages)
        .sort((a, b) => keyAverages[b] - keyAverages[a])
        .filter(key => key.trim() !== ''); // Filter out spaces and empty strings
    
    // Calculate consistency score (lower variation is better)
    let consistencyScore = 100;
    if (keyTimings && keyTimings.length > 3) {
        const intervals = [];
        for (let i = 1; i < keyTimings.length; i++) {
            const interval = keyTimings[i] - keyTimings[i - 1];
            if (interval < 1000) { // Ignore pauses over 1 second
                intervals.push(interval);
            }
        }
        
        if (intervals.length > 0) {
            const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
            const variances = intervals.map(interval => Math.pow(interval - avgInterval, 2));
            const variance = variances.reduce((sum, val) => sum + val, 0) / variances.length;
            
            // Convert variance to a 0-100 score (lower variance = higher score)
            consistencyScore = Math.max(0, 100 - (Math.sqrt(variance) / 5));
        }
    }
    
    // Calculate typing rhythm patterns
    const speedPattern = calculateSpeedPattern(keyTimings);
    
    return {
        wpm,
        accuracy,
        errors,
        errorChars,
        slowestKeys,
        consistencyScore: Math.round(consistencyScore),
        speedPattern,
        heatmap: typingData.heatmap || {}
    };
}

// Function to calculate speed pattern over time
function calculateSpeedPattern(keyTimings) {
    const pattern = [];
    
    if (keyTimings && keyTimings.length > 10) {
        // Divide the test into 10 segments
        const totalKeys = keyTimings.length - 1;
        const segmentSize = Math.floor(totalKeys / 10);
        
        for (let i = 0; i < 10; i++) {
            const startIdx = i * segmentSize + 1;
            const endIdx = Math.min((i + 1) * segmentSize, totalKeys);
            
            // Calculate WPM for this segment
            let totalTime = 0;
            for (let j = startIdx; j <= endIdx; j++) {
                totalTime += keyTimings[j] - keyTimings[j - 1];
            }
            
            const keysTyped = endIdx - startIdx + 1;
            const minutes = totalTime / 60000; // Convert ms to minutes
            const segmentWPM = Math.round((keysTyped / 5) / minutes); // 5 chars = 1 word
            
            pattern.push(segmentWPM);
        }
    }
    
    return pattern;
}

// Function to analyze heatmap data
function analyzeHeatmapData(heatmap) {
    let slowestKeys = [];
    let averageTimes = {};
    
    // Calculate average time for each key
    for (const key in heatmap) {
        if (heatmap[key].length > 0) {
            const times = heatmap[key];
            averageTimes[key] = times.reduce((sum, time) => sum + time, 0) / times.length;
        }
    }
    
    // Find 3 slowest keys
    slowestKeys = Object.keys(averageTimes)
        .sort((a, b) => averageTimes[b] - averageTimes[a])
        .slice(0, 3);
    
    if (slowestKeys.length > 0) {
        return `<p><strong>Key Timing Analysis:</strong> Your typing heatmap shows that you spend the most time on these keys: <span class="highlight-keys">${slowestKeys.join(', ')}</span>. Consider practicing these specific characters to improve your overall speed.</p>`;
    }
    
    return '';
}

// Function to analyze speed patterns
function analyzeSpeedPattern(speedPattern) {
    // Look for significant drops in speed
    const drops = [];
    let lastSpeed = speedPattern[0];
    
    for (let i = 1; i < speedPattern.length; i++) {
        const currentSpeed = speedPattern[i];
        const speedDrop = lastSpeed - currentSpeed;
        
        if (speedDrop > 10) { // Significant drop
            drops.push(i);
        }
        
        lastSpeed = currentSpeed;
    }
    
    if (drops.length > 0) {
        return `<p><strong>Speed Consistency:</strong> I noticed ${drops.length} significant drop${drops.length > 1 ? 's' : ''} in your typing speed. Try to maintain a steady rhythm throughout the test.</p>`;
    } else {
        return `<p><strong>Speed Consistency:</strong> Your typing speed was very consistent throughout the test. Great job maintaining a steady rhythm!</p>`;
    }
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.aiFeedback = {
        generateAIFeedback,
        analyzeTypingData
    };
} 