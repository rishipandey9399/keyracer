const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const UserStats = require('../models/UserStats');
const { authenticate } = require('../middleware/authMiddleware');

// Get all challenges with filters
router.get('/challenges', async (req, res) => {
  try {
    const { language, difficulty, category, page = 1, limit = 20 } = req.query;
    
    const filter = { isActive: true };
    if (language && language !== 'all') filter.language = language;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (category && category !== 'all') filter.category = category;
    
    const challenges = await Challenge.find(filter)
      .select('-solution -testCases.expectedOutput')
      .sort({ difficulty: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Challenge.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        challenges,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get specific challenge
router.get('/challenges/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .select('-solution -testCases.expectedOutput');
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    
    res.json({ success: true, data: challenge });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Submit challenge solution
router.post('/challenges/:id/submit', authenticate, async (req, res) => {
  try {
    const { code, completionTime, testResults } = req.body;
    const challengeId = req.params.id;
    const userId = req.user._id;
    
    // Get challenge details
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    
    // Find or create user challenge record
    let userChallenge = await UserChallenge.findOne({ userId, challengeId });
    if (!userChallenge) {
      userChallenge = new UserChallenge({ userId, challengeId, attempts: [] });
    }
    
    // Calculate accuracy and correctness
    const testsPassed = testResults.filter(t => t.passed).length;
    const totalTests = testResults.length;
    const accuracy = (testsPassed / totalTests) * 100;
    const isCorrect = testsPassed === totalTests;
    
    // Create new attempt
    const attemptNumber = userChallenge.attempts.length + 1;
    const attempt = {
      attemptNumber,
      code,
      completionTime,
      isCorrect,
      testsPassed,
      totalTests,
      accuracy,
      pointsEarned: 0, // Will be calculated
      submittedAt: new Date()
    };
    
    // Calculate points
    attempt.pointsEarned = userChallenge.calculatePoints(challenge, attempt);
    
    // Add attempt and update best
    userChallenge.attempts.push(attempt);
    userChallenge.lastAttemptAt = new Date();
    userChallenge.updateBestAttempt();
    
    await userChallenge.save();
    
    // Update user stats
    await updateUserStats(userId, challenge, attempt, userChallenge);
    
    res.json({
      success: true,
      data: {
        pointsEarned: attempt.pointsEarned,
        isCorrect,
        accuracy,
        attemptNumber,
        bestAttempt: userChallenge.bestAttempt === userChallenge.attempts.length - 1
      }
    });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's challenge progress
router.get('/user/progress', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userChallenges = await UserChallenge.find({ userId })
      .populate('challengeId', 'title difficulty language category points')
      .sort({ lastAttemptAt: -1 });
    
    const userStats = await UserStats.findOne({ userId });
    
    res.json({
      success: true,
      data: {
        challenges: userChallenges,
        stats: userStats || {}
      }
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to update user stats
async function updateUserStats(userId, challenge, attempt, userChallenge) {
  try {
    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = new UserStats({ userId });
    }
    
    // Update basic stats
    userStats.totalAttempts += 1;
    
    if (attempt.isCorrect && !userChallenge.isCompleted) {
      userStats.challengesCompleted += 1;
      userStats.totalPoints += attempt.pointsEarned;
      
      // Update language stats
      const langStats = userStats.languageStats[challenge.language];
      if (langStats) {
        langStats.completed += 1;
        langStats.points += attempt.pointsEarned;
        
        // Update average time for this language
        const avgTime = ((langStats.avgTime * (langStats.completed - 1)) + attempt.completionTime) / langStats.completed;
        langStats.avgTime = avgTime;
      }
      
      // Update difficulty stats
      const diffStats = userStats.difficultyStats[challenge.difficulty];
      if (diffStats) {
        diffStats.completed += 1;
        diffStats.points += attempt.pointsEarned;
      }
      
      // Update streaks
      userStats.updateStreak();
    }
    
    // Recalculate overall averages
    if (userStats.challengesCompleted > 0) {
      const allCompletedChallenges = await UserChallenge.find({ 
        userId, 
        isCompleted: true 
      });
      
      const totalTime = allCompletedChallenges.reduce((sum, uc) => sum + uc.bestTime, 0);
      const totalAccuracy = allCompletedChallenges.reduce((sum, uc) => sum + uc.bestAccuracy, 0);
      
      userStats.averageCompletionTime = totalTime / userStats.challengesCompleted;
      userStats.overallAccuracy = totalAccuracy / userStats.challengesCompleted;
    }
    
    // Update level
    userStats.level = userStats.calculateLevel();
    
    // Check for new badges
    userStats.checkAndAwardBadges();
    
    userStats.lastUpdated = new Date();
    await userStats.save();
    
    // Update user rank (this could be optimized with a background job)
    await updateUserRanks();
    
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

// Update all user ranks based on total points
async function updateUserRanks() {
  try {
    const users = await UserStats.find({}).sort({ totalPoints: -1 });
    
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }
  } catch (error) {
    console.error('Error updating user ranks:', error);
  }
}

module.exports = router;
