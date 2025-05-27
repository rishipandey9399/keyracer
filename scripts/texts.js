const typingTexts = {
    beginner: [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.",
        "Learning to type quickly and accurately is an essential skill in today's digital world.",
        "Practice makes perfect. The more you type, the better you will become at it.",
        "Daily typing practice can help improve your speed, accuracy, and overall productivity.",
        "Simple sentences like this one are great for beginners who are learning how to type.",
        "Start with the home row keys: A, S, D, F, J, K, L, and semicolon. These are your foundation.",
        "Keep your fingers curved and your wrists straight while typing to prevent strain.",
        "Look at the screen, not the keyboard, as you type to improve your speed and accuracy.",
        "Take regular breaks during long typing sessions to keep your hands and mind fresh.",
        "Remember to use both hands equally when typing to maintain balance and efficiency."
    ],
    intermediate: [
        "Technology continues to advance at an unprecedented rate, transforming how we live, work, and communicate with one another.",
        "Developing good typing habits early on will benefit you throughout your career and personal life.",
        "The average professional typist can type between 65 and 75 words per minute. With practice, you can reach or exceed this speed.",
        "When practicing typing, focus on accuracy first. Speed will naturally improve as you become more comfortable with the keyboard layout.",
        "Touch typing involves using muscle memory to know where the keys are without looking. This technique significantly improves typing efficiency.",
        "The modern workplace demands efficient typing skills, as most jobs require regular computer use and communication.",
        "Regular typing practice can help reduce mental fatigue and increase your overall productivity at work.",
        "Learning to type without looking at the keyboard allows you to focus on your thoughts and ideas while typing.",
        "Proper posture and ergonomics are essential for comfortable and efficient typing over long periods.",
        "Many successful professionals attribute part of their success to their ability to type quickly and accurately."
    ],
    advanced: [
        "According to research, the most efficient typists maintain a steady rhythm rather than typing in bursts. This consistency helps reduce fatigue and maintain accuracy over longer periods.",
        "The QWERTY keyboard layout, designed in the 1870s for mechanical typewriters, was actually created to slow typists down to prevent jamming. Despite this, it remains the standard layout worldwide.",
        "Ergonomic keyboards are designed to reduce strain on your hands and wrists by positioning them in a more natural alignment. Many professionals who type extensively find these keyboards help prevent repetitive strain injuries.",
        "Programming requires not only fast typing but also precision with special characters and syntax. Developers often customize their keyboard layouts to optimize for the languages they use most frequently.",
        "The world record for typing speed is over 200 words per minute, achieved using a specialized stenographic keyboard that allows typing entire words with a single keystroke combination.",
        "Advanced typists often develop their own unique rhythm and style, allowing them to maintain high speeds while minimizing errors.",
        "The Dvorak keyboard layout was designed to be more efficient than QWERTY, with the most common letters placed on the home row.",
        "Many professional typists use keyboard shortcuts and macros to increase their productivity and reduce repetitive tasks.",
        "The ability to type quickly and accurately is becoming increasingly important in the age of remote work and digital communication.",
        "Some typists can achieve speeds over 150 WPM by using advanced techniques like chorded typing and predictive text."
    ]
};

// Function to get a random text based on difficulty
function getRandomText(difficulty = 'beginner') {
    const texts = typingTexts[difficulty] || typingTexts.beginner;
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}

// Function to get a text that hasn't been used recently
function getFreshText(difficulty = 'beginner') {
    const texts = typingTexts[difficulty] || typingTexts.beginner;
    const recentTexts = JSON.parse(localStorage.getItem('recentTexts') || '[]');
    
    // Filter out recently used texts
    const availableTexts = texts.filter(text => !recentTexts.includes(text));
    
    // If all texts have been used recently, reset the history
    if (availableTexts.length === 0) {
        localStorage.setItem('recentTexts', JSON.stringify([]));
        return getRandomText(difficulty);
    }
    
    // Get a random text from available texts
    const randomIndex = Math.floor(Math.random() * availableTexts.length);
    const selectedText = availableTexts[randomIndex];
    
    // Update recent texts
    recentTexts.push(selectedText);
    if (recentTexts.length > 5) recentTexts.shift(); // Keep only last 5 texts
    localStorage.setItem('recentTexts', JSON.stringify(recentTexts));
    
    return selectedText;
}

// Export the texts and functions for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { typingTexts, getRandomText, getFreshText };
}
// Attach to window for browser usage
if (typeof window !== 'undefined') {
    window.typingTexts = typingTexts;
    window.getRandomText = getRandomText;
    window.getFreshText = getFreshText;
} 