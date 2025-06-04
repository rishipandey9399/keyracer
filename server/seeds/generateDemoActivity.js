const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const UserStats = require('../models/UserStats');
const connectDB = require('../utils/dbConnect');

/**
 * Generate recent activity to make the leaderboard more dynamic
 * This simulates recent challenge submissions and updates
 */
async function generateDemoActivity() {
  try {
    console.log('🎬 Generating demo activity...');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Get existing users and challenges
    const users = await User.find({});
    const challenges = await Challenge.find({});
    
    if (users.length === 0 || challenges.length === 0) {
      throw new Error('No users or challenges found. Please run the main seeding first.');
    }

    console.log(`📊 Found ${users.length} users and ${challenges.length} challenges`);

    // Generate activity for the last 7 days
    const now = new Date();
    const daysToGenerate = 7;
    
    for (let day = 0; day < daysToGenerate; day++) {
      const activityDate = new Date(now.getTime() - (day * 24 * 60 * 60 * 1000));
      
      // Each day, 60-80% of users are active
      const activeUsers = users.filter(() => Math.random() < 0.7);
      
      console.log(`📅 Day ${day + 1}: ${activeUsers.length} active users`);
      
      for (const user of activeUsers) {
        // Each active user attempts 1-3 challenges per day
        const challengesToAttempt = Math.floor(Math.random() * 3) + 1;
        const userChallenges = challenges
          .sort(() => Math.random() - 0.5)
          .slice(0, challengesToAttempt);
        
        for (const challenge of userChallenges) {
          // Check if user already has a recent attempt for this challenge
          const existingAttempt = await UserChallenge.findOne({
            userId: user._id,
            challengeId: challenge._id,
            submittedAt: { $gte: new Date(activityDate.getTime() - 24 * 60 * 60 * 1000) }
          });
          
          if (existingAttempt) continue; // Skip if already attempted recently
          
          // Generate realistic attempt data
          const userSkill = 0.3 + Math.random() * 0.6; // Skill level 0.3-0.9
          const difficultyMultiplier = {
            'easy': 1,
            'medium': 1.5,
            'hard': 2.5,
            'expert': 4
          }[challenge.difficulty];
          
          // Time taken (scaled by difficulty and skill)
          const baseTime = 60 + (challenge.difficulty === 'expert' ? 300 : 
                                challenge.difficulty === 'hard' ? 180 :
                                challenge.difficulty === 'medium' ? 120 : 60);
          const timeTaken = Math.max(30, Math.floor(baseTime * difficultyMultiplier * (2 - userSkill)));
          
          // Accuracy (higher skill = better accuracy)
          const accuracy = Math.min(0.98, Math.max(0.4, userSkill * 0.8 + Math.random() * 0.2));
          
          // Completion (higher skill = more likely to complete)
          const completed = Math.random() < (userSkill * 0.8 + 0.1);
          
          // Calculate points
          let points = 0;
          if (completed) {
            points = challenge.points * accuracy;
            
            // Time bonus (simplified)
            if (timeTaken < 60) points *= 1.5;
            else if (timeTaken < 120) points *= 1.25;
            else if (timeTaken < 300) points *= 1.1;
            
            points = Math.round(points);
          }
          
          // Create the attempt
          const attempt = new UserChallenge({
            userId: user._id,
            challengeId: challenge._id,
            completed,
            timeTaken,
            accuracy,
            attemptNumber: 1, // Simplified for demo
            pointsEarned: points,
            submittedAt: activityDate,
            codeSubmitted: generateSampleCode(challenge.language),
            testsPassed: Math.floor(accuracy * challenge.testCases.length),
            testsTotal: challenge.testCases.length
          });
          
          await attempt.save();
          
          // Update user stats if completed
          if (completed) {
            await updateUserStats(user._id, points);
          }
        }
      }
    }

    // Recalculate all user rankings
    await recalculateRankings();
    
    console.log('✅ Demo activity generation completed!');
    
  } catch (error) {
    console.error('❌ Error generating demo activity:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

async function updateUserStats(userId, pointsEarned) {
  try {
    const stats = await UserStats.findOne({ userId });
    if (stats) {
      stats.totalPoints += pointsEarned;
      stats.challengesCompleted += 1;
      stats.lastActive = new Date();
      await stats.save();
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

async function recalculateRankings() {
  try {
    const allStats = await UserStats.find({}).sort({ totalPoints: -1 });
    
    for (let i = 0; i < allStats.length; i++) {
      allStats[i].rank = i + 1;
      await allStats[i].save();
    }
    
    console.log('🏆 Rankings recalculated');
  } catch (error) {
    console.error('Error recalculating rankings:', error);
  }
}

function generateSampleCode(language) {
  const samples = {
    python: `def solution(nums):
    # Optimized solution
    result = []
    for num in nums:
        result.append(num * 2)
    return result`,
    javascript: `function solution(nums) {
    // Efficient implementation
    return nums.map(num => num * 2);
}`,
    java: `public class Solution {
    public int[] solution(int[] nums) {
        int[] result = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            result[i] = nums[i] * 2;
        }
        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums) {
        vector<int> result;
        for (int num : nums) {
            result.push_back(num * 2);
        }
        return result;
    }
};`
  };
  
  return samples[language] || samples.python;
}

// Run if called directly
if (require.main === module) {
  generateDemoActivity()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Demo activity generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateDemoActivity };
