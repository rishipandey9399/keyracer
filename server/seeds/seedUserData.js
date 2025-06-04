const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const UserStats = require('../models/UserStats');
const connectDB = require('../utils/dbConnect');

// Sample users for testing (these would normally be created through authentication)
const sampleUsers = [
  {
    username: 'alice_dev',
    email: 'alice@example.com',
    displayName: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    isActive: true
  },
  {
    username: 'bob_coder',
    email: 'bob@example.com',
    displayName: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    isActive: true
  },
  {
    username: 'charlie_py',
    email: 'charlie@example.com',
    displayName: 'Charlie Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    isActive: true
  },
  {
    username: 'diana_js',
    email: 'diana@example.com',
    displayName: 'Diana Prince',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    isActive: true
  },
  {
    username: 'eve_algo',
    email: 'eve@example.com',
    displayName: 'Eve Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    isActive: true
  }
];

// Generate realistic user challenge attempts
function generateUserChallengeAttempts(users, challenges) {
  const attempts = [];
  const now = new Date();
  
  users.forEach((user, userIndex) => {
    // Each user completes a different number of challenges
    const completionRates = [0.8, 0.6, 0.9, 0.7, 0.5]; // Alice, Bob, Charlie, Diana, Eve
    const userSkillLevels = [0.8, 0.6, 0.9, 0.7, 0.5]; // Skill multiplier for time/accuracy
    
    challenges.forEach((challenge, challengeIndex) => {
      // Not every user attempts every challenge
      if (Math.random() > completionRates[userIndex]) return;
      
      const skillLevel = userSkillLevels[userIndex];
      const difficultyMultiplier = {
        'easy': 1,
        'medium': 1.5,
        'hard': 2.5,
        'expert': 4
      }[challenge.difficulty];
      
      // Generate 1-4 attempts per challenge
      const numAttempts = Math.floor(Math.random() * 4) + 1;
      let bestTime = Infinity;
      let finalAccuracy = 0;
      let completed = false;
      
      for (let attempt = 1; attempt <= numAttempts; attempt++) {
        // Time taken (in seconds) - varies by skill and difficulty
        const baseTime = challenge.timeLimit / 1000 * 0.3; // 30% of time limit as base
        const timeVariation = baseTime * (2 - skillLevel) * difficultyMultiplier;
        const timeTaken = Math.max(30, Math.floor(baseTime + (Math.random() - 0.5) * timeVariation));
        
        // Accuracy improves with skill and attempts
        const baseAccuracy = Math.min(0.95, 0.5 + (skillLevel * 0.4) + (attempt * 0.1));
        const accuracy = Math.max(0.3, baseAccuracy + (Math.random() - 0.5) * 0.2);
        
        // Completion status - higher skill users complete more challenges
        const completionChance = skillLevel * 0.8 + (attempt * 0.1);
        const isCompleted = Math.random() < completionChance;
        
        if (isCompleted) {
          completed = true;
          bestTime = Math.min(bestTime, timeTaken);
          finalAccuracy = Math.max(finalAccuracy, accuracy);
        }
        
        // Create attempt record
        const attemptDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
        
        attempts.push({
          userId: user._id,
          challengeId: challenge._id,
          completed: isCompleted,
          timeTaken: timeTaken,
          accuracy: accuracy,
          attemptNumber: attempt,
          pointsEarned: isCompleted ? calculatePoints(challenge, timeTaken, attempt, accuracy) : 0,
          submittedAt: attemptDate,
          codeSubmitted: generateSampleCode(challenge.language),
          testsPassed: Math.floor(accuracy * challenge.testCases.length),
          testsTotal: challenge.testCases.length
        });
      }
    });
  });
  
  return attempts;
}

// Calculate points based on the scoring system
function calculatePoints(challenge, timeTaken, attempt, accuracy) {
  let points = challenge.points;
  
  // Time bonus (simplified - in real system this would compare to all users)
  const timeBonus = timeTaken < 60 ? 0.5 : timeTaken < 120 ? 0.25 : timeTaken < 300 ? 0.1 : 0;
  points += points * timeBonus;
  
  // Attempt penalty
  const attemptMultiplier = attempt === 1 ? 2 : attempt === 2 ? 0.9 : attempt === 3 ? 0.8 : 0.7;
  points *= attemptMultiplier;
  
  // Accuracy bonus
  points *= accuracy;
  
  return Math.round(points);
}

// Generate sample code for different languages
function generateSampleCode(language) {
  const samples = {
    python: `def solution(nums):
    # Implementation here
    return result`,
    javascript: `function solution(nums) {
    // Implementation here
    return result;
}`,
    java: `public class Solution {
    public int solution(int[] nums) {
        // Implementation here
        return result;
    }
}`,
    cpp: `class Solution {
public:
    int solution(vector<int>& nums) {
        // Implementation here
        return result;
    }
};`,
    csharp: `public class Solution {
    public int Solution(int[] nums) {
        // Implementation here
        return result;
    }
}`,
    go: `func solution(nums []int) int {
    // Implementation here
    return result
}`,
    rust: `impl Solution {
    pub fn solution(nums: Vec<i32>) -> i32 {
        // Implementation here
        result
    }
}`
  };
  
  return samples[language] || samples.python;
}

// Generate user statistics
function generateUserStats(users, userChallenges) {
  const stats = [];
  
  users.forEach(user => {
    const userAttempts = userChallenges.filter(uc => uc.userId.equals(user._id));
    const completedChallenges = userAttempts.filter(uc => uc.completed);
    
    // Calculate statistics
    const totalPoints = completedChallenges.reduce((sum, uc) => sum + uc.pointsEarned, 0);
    const averageAccuracy = userAttempts.length > 0 
      ? userAttempts.reduce((sum, uc) => sum + uc.accuracy, 0) / userAttempts.length 
      : 0;
    
    // Language breakdown
    const languageStats = {};
    completedChallenges.forEach(uc => {
      // We'll need to join with challenges to get language, for now use sample data
      const languages = ['python', 'javascript', 'java', 'cpp'];
      const lang = languages[Math.floor(Math.random() * languages.length)];
      languageStats[lang] = (languageStats[lang] || 0) + 1;
    });
    
    // Difficulty breakdown
    const difficultyStats = {
      easy: Math.floor(completedChallenges.length * 0.4),
      medium: Math.floor(completedChallenges.length * 0.3),
      hard: Math.floor(completedChallenges.length * 0.2),
      expert: Math.floor(completedChallenges.length * 0.1)
    };
    
    // Generate badges based on achievements
    const badges = [];
    if (completedChallenges.length >= 10) badges.push('Dedicated Solver');
    if (totalPoints >= 500) badges.push('Point Master');
    if (averageAccuracy >= 0.8) badges.push('Accuracy Expert');
    if (Object.keys(languageStats).length >= 3) badges.push('Polyglot');
    
    stats.push({
      userId: user._id,
      totalPoints,
      challengesCompleted: completedChallenges.length,
      challengesAttempted: userAttempts.length,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      bestStreak: Math.floor(Math.random() * 15) + 1, // Random streak for demo
      currentStreak: Math.floor(Math.random() * 8),
      badges,
      languageStats,
      difficultyStats,
      categoryStats: {
        algorithms: difficultyStats.easy + difficultyStats.medium,
        'data-structures': difficultyStats.hard,
        strings: difficultyStats.medium,
        arrays: difficultyStats.easy
      },
      rank: 0, // Will be calculated after insertion
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last week
    });
  });
  
  // Sort by total points and assign ranks
  stats.sort((a, b) => b.totalPoints - a.totalPoints);
  stats.forEach((stat, index) => {
    stat.rank = index + 1;
  });
  
  return stats;
}

async function seedUserData() {
  try {
    console.log('👥 Starting user data seeding...');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Get existing challenges
    const challenges = await Challenge.find({});
    if (challenges.length === 0) {
      throw new Error('No challenges found. Please run seedChallenges first.');
    }
    console.log(`📚 Found ${challenges.length} challenges`);

    // Clear existing user data
    await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
    await UserChallenge.deleteMany({});
    await UserStats.deleteMany({});
    console.log('🗑️  Cleared existing user data');

    // Create sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`👤 Created ${insertedUsers.length} sample users`);

    // Generate and insert user challenge attempts
    const userChallengeAttempts = generateUserChallengeAttempts(insertedUsers, challenges);
    const insertedAttempts = await UserChallenge.insertMany(userChallengeAttempts);
    console.log(`🎯 Created ${insertedAttempts.length} challenge attempts`);

    // Generate and insert user statistics
    const userStats = generateUserStats(insertedUsers, insertedAttempts);
    const insertedStats = await UserStats.insertMany(userStats);
    console.log(`📊 Created ${insertedStats.length} user statistics records`);

    // Log summary
    console.log('\n📈 User Data Summary:');
    for (let i = 0; i < insertedUsers.length; i++) {
      const user = insertedUsers[i];
      const stats = userStats[i];
      console.log(`  ${user.displayName}:`);
      console.log(`    Rank: #${stats.rank}`);
      console.log(`    Points: ${stats.totalPoints}`);
      console.log(`    Completed: ${stats.challengesCompleted}/${stats.challengesAttempted}`);
      console.log(`    Accuracy: ${(stats.averageAccuracy * 100).toFixed(1)}%`);
      console.log(`    Badges: ${stats.badges.join(', ') || 'None'}`);
    }

    console.log('\n🎉 User data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding user data:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedUserData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('User data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUserData };
