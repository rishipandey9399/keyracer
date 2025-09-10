const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const User = require('../models/User');

// Submit typing test result
router.post('/leaderboard/submit', async (req, res) => {
  try {
    const { username, wpm, accuracy, difficulty, timestamp, errors, textLength, charsTyped } = req.body;
    
    if (!username || typeof wpm !== 'number' || typeof accuracy !== 'number') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log(`[LEADERBOARD] Submitting result for ${username}: ${wpm} WPM, ${accuracy}% accuracy`);

    // Find or create user (case insensitive)
    let user = await User.findOne({ 
      $or: [
        { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { displayName: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      ]
    });

    if (!user) {
      console.log(`[LEADERBOARD] Creating new user: ${username}`);
      user = new User({
        username: username,
        displayName: username,
        email: `${username.toLowerCase().replace(/\s+/g, '')}@keyracer.in`,
        password: 'typing_user',
        authMethod: 'local',
        isVerified: true
      });
      await user.save();
    }

    // Find or create user stats
    let stats = await UserStats.findOne({ userId: user._id });
    if (!stats) {
      console.log(`[LEADERBOARD] Creating new stats for user: ${username}`);
      stats = new UserStats({ 
        userId: user._id,
        challengesCompleted: 0,
        totalAttempts: 0,
        totalPoints: 0,
        overallAccuracy: 0,
        averageCompletionTime: 0,
        lastWpm: 0,
        lastAccuracy: 0,
        lastDifficulty: 'beginner',
        lastTimestamp: new Date(),
        lastActivityDate: new Date(),
        difficultyStats: {
          beginner: { completed: 0, points: 0 },
          intermediate: { completed: 0, points: 0 },
          advanced: { completed: 0, points: 0 }
        }
      });
    }

    // Update stats with new test result
    const oldChallenges = stats.challengesCompleted;
    stats.challengesCompleted += 1;
    stats.totalAttempts += 1;
    stats.totalPoints += Math.round(wpm * (accuracy / 100));
    
    // Update averages
    if (oldChallenges > 0) {
      stats.overallAccuracy = ((stats.overallAccuracy * oldChallenges) + accuracy) / stats.challengesCompleted;
    } else {
      stats.overallAccuracy = accuracy;
    }

    // Update latest test data
    stats.lastWpm = wpm;
    stats.lastAccuracy = accuracy;
    stats.lastDifficulty = difficulty || 'beginner';
    stats.lastTimestamp = new Date();
    stats.lastActivityDate = new Date();

    // Update difficulty stats
    const diffKey = difficulty || 'beginner';
    if (stats.difficultyStats && stats.difficultyStats[diffKey]) {
      stats.difficultyStats[diffKey].completed += 1;
      stats.difficultyStats[diffKey].points += Math.round(wpm * (accuracy / 100));
    }

    await stats.save();
    console.log(`[LEADERBOARD] Stats updated for ${username}: ${wpm} WPM saved`);

    res.json({ 
      success: true, 
      message: 'Result submitted and leaderboard updated.',
      data: {
        username: user.displayName || user.username,
        wpm: stats.lastWpm,
        accuracy: stats.lastAccuracy,
        timestamp: stats.lastTimestamp
      }
    });

  } catch (error) {
    console.error('[LEADERBOARD] Error submitting result:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting result' });
  }
});

// Get leaderboard data
router.get('/leaderboard', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    console.log(`[LEADERBOARD] Fetching leaderboard data (page ${page})`);

    // Simple aggregation pipeline to get leaderboard
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          lastWpm: { $exists: true, $gt: 0 }
        }
      },
      {
        $sort: { 
          lastWpm: -1, 
          lastAccuracy: -1, 
          lastUpdated: -1
        }
      },
      {
        $project: {
          username: { $ifNull: ['$user.displayName', '$user.username'] },
          wpm: { $ifNull: ['$lastWpm', { $divide: ['$totalPoints', { $max: ['$challengesCompleted', 1] }] }] },
          accuracy: { $ifNull: ['$lastAccuracy', '$overallAccuracy', 85] },
          difficulty: { $ifNull: ['$lastDifficulty', 'beginner'] },
          timestamp: { $ifNull: ['$lastTimestamp', '$lastUpdated'] },
          totalPoints: '$totalPoints',
          challengesCompleted: '$challengesCompleted'
        }
      },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    ];

    const leaderboardData = await UserStats.aggregate(pipeline);
    
    console.log(`[LEADERBOARD] Raw aggregation returned ${leaderboardData.length} entries`);
    
    // Add rank to each entry
    const formattedData = leaderboardData.map((entry, index) => ({
      rank: (parseInt(page) - 1) * parseInt(limit) + index + 1,
      username: entry.username || 'Anonymous',
      wpm: Math.round(entry.wpm || 0),
      accuracy: Math.round(entry.accuracy || 0),
      difficulty: entry.difficulty || 'beginner',
      timestamp: entry.timestamp,
      totalPoints: entry.totalPoints || 0,
      challengesCompleted: entry.challengesCompleted || 0
    }));

    // Get total count
    const totalCount = await UserStats.countDocuments({ 
      lastWpm: { $exists: true, $gt: 0 }
    });

    console.log(`[LEADERBOARD] Returning ${formattedData.length} entries`);

    res.json({
      success: true,
      data: {
        leaderboard: formattedData,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalUsers: totalCount,
          hasNext: (parseInt(page) * parseInt(limit)) < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('[LEADERBOARD] Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching leaderboard data' 
    });
  }
});

// Debug total stats count
router.get('/leaderboard/debug', async (req, res) => {
  try {
    const totalStats = await UserStats.countDocuments();
    const statsWithWpm = await UserStats.countDocuments({ lastWpm: { $gt: 0 } });
    const statsWithChallenges = await UserStats.countDocuments({ challengesCompleted: { $gt: 0 } });
    const allStats = await UserStats.find({}).limit(5).populate('userId');
    
    res.json({
      success: true,
      totalStats,
      statsWithWpm,
      statsWithChallenges,
      sampleStats: allStats.map(s => ({
        username: s.userId?.username || s.userId?.displayName,
        lastWpm: s.lastWpm,
        lastAccuracy: s.lastAccuracy,
        challengesCompleted: s.challengesCompleted,
        totalPoints: s.totalPoints,
        overallAccuracy: s.overallAccuracy
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all leaderboard data (admin only)
router.delete('/leaderboard/clear', async (req, res) => {
  try {
    console.log('[LEADERBOARD] Clearing all leaderboard data...');
    
    // Delete all user stats
    const deleteResult = await UserStats.deleteMany({});
    
    console.log(`[LEADERBOARD] Cleared ${deleteResult.deletedCount} user stats records`);
    
    res.json({
      success: true,
      message: `Cleared ${deleteResult.deletedCount} leaderboard records`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('[LEADERBOARD] Error clearing data:', error);
    res.status(500).json({ success: false, message: 'Error clearing leaderboard data' });
  }
});

// Debug endpoint
router.get('/leaderboard/debug/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ 
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { displayName: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });
    
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    const stats = await UserStats.findOne({ userId: user._id });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        authMethod: user.authMethod,
        isVerified: user.isVerified
      },
      stats: stats ? {
        lastWpm: stats.lastWpm,
        lastAccuracy: stats.lastAccuracy,
        lastTimestamp: stats.lastTimestamp,
        challengesCompleted: stats.challengesCompleted,
        totalPoints: stats.totalPoints
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;