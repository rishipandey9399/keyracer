const typingTexts = {
    beginner: [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.",
        "Learning to type quickly and accurately is an essential skill in today's digital world.",
        "Practice makes perfect. The more you type, the better you will become at it.",
        "Daily typing practice can help improve your speed, accuracy, and overall productivity.",
        "Simple sentences like this one are great for beginners who are learning how to type."
    ],
    intermediate: [
        "Technology continues to advance at an unprecedented rate, transforming how we live, work, and communicate with one another.",
        "Developing good typing habits early on will benefit you throughout your career and personal life.",
        "The average professional typist can type between 65 and 75 words per minute. With practice, you can reach or exceed this speed.",
        "When practicing typing, focus on accuracy first. Speed will naturally improve as you become more comfortable with the keyboard layout.",
        "Touch typing involves using muscle memory to know where the keys are without looking. This technique significantly improves typing efficiency."
    ],
    advanced: [
        "According to research, the most efficient typists maintain a steady rhythm rather than typing in bursts. This consistency helps reduce fatigue and maintain accuracy over longer periods.",
        "The QWERTY keyboard layout, designed in the 1870s for mechanical typewriters, was actually created to slow typists down to prevent jamming. Despite this, it remains the standard layout worldwide.",
        "Ergonomic keyboards are designed to reduce strain on your hands and wrists by positioning them in a more natural alignment. Many professionals who type extensively find these keyboards help prevent repetitive strain injuries.",
        "Programming requires not only fast typing but also precision with special characters and syntax. Developers often customize their keyboard layouts to optimize for the languages they use most frequently.",
        "The world record for typing speed is over 200 words per minute, achieved using a specialized stenographic keyboard that allows typing entire words with a single keystroke combination."
    ]
};

// Export the texts for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { typingTexts };
} 