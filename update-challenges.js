const fs = require('fs');

// Read the current challenges.json
const challengesData = JSON.parse(fs.readFileSync('./scripts/challenges.json', 'utf8'));

// Define difficulty levels and their corresponding points
const challengeUpdates = [
    { _id: 1, difficulty: "Easy", points: 10, category: "Basics" },
    { _id: 2, difficulty: "Easy", points: 10, category: "Loops" },
    { _id: 3, difficulty: "Medium", points: 30, category: "Functions" },
    { _id: 4, difficulty: "Easy", points: 10, category: "Basics" },
    { _id: 5, difficulty: "Easy", points: 10, category: "Variables" },
    { _id: 6, difficulty: "Medium", points: 30, category: "Loops" },
    { _id: 7, difficulty: "Medium", points: 30, category: "Loops" },
    { _id: 8, difficulty: "Medium", points: 30, category: "Functions" },
    { _id: 9, difficulty: "Hard", points: 50, category: "Functions" },
    { _id: 10, difficulty: "Hard", points: 50, category: "Functions" },
    { _id: 11, difficulty: "Easy", points: 10, category: "Lists" },
    { _id: 12, difficulty: "Medium", points: 30, category: "Lists" },
    { _id: 13, difficulty: "Medium", points: 30, category: "Lists" },
    { _id: 14, difficulty: "Hard", points: 50, category: "Lists" },
    { _id: 15, difficulty: "Hard", points: 50, category: "Lists" },
    { _id: 16, difficulty: "Medium", points: 30, category: "Strings" },
    { _id: 17, difficulty: "Hard", points: 50, category: "Strings" },
    { _id: 18, difficulty: "Expert", points: 100, category: "Algorithms" },
    { _id: 19, difficulty: "Expert", points: 100, category: "Algorithms" },
    { _id: 20, difficulty: "Expert", points: 100, category: "Algorithms" }
];

// Update each challenge with the new properties
challengesData.challenges.forEach(challenge => {
    const update = challengeUpdates.find(u => u._id === challenge._id);
    if (update) {
        challenge.difficulty = update.difficulty;
        challenge.points = update.points;
        challenge.category = update.category;
    }
});

// Write the updated data back to the file
fs.writeFileSync('./scripts/challenges.json', JSON.stringify(challengesData, null, 4));

console.log('Successfully updated challenges.json with difficulty, points, and category fields!');
console.log(`Updated ${challengesData.challenges.length} challenges.`);
