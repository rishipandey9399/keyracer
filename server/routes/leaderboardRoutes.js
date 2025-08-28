const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const User = require('../models/User');
const UserChallenge = require('../models/UserChallenge');

// Submit typing test result for leaderboard
router.post('/leaderboard/submit', async (req, res) => {
  try {
    const { username, wpm, accuracy, difficulty, timestamp } = req.body;
    if (!username || !wpm || !accuracy) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Find or create user
    let user = await User.findOne({ username });
    if (!user) {
      // Only create a user if they are not logged in
      if (req.user) {
        user = req.user; // Use the authenticated user
      } else {
        user = new User({ username, displayName: username, email: `${username}@keyracer.in`, password: 'guest', authMethod: 'local', isVerified: false });
        await user.save();
      }
    }

    // Find or create UserStats
    let stats = await UserStats.findOne({ userId: user._id });
    if (!stats) {
      stats = new UserStats({ userId: user._id });
    }

    // Update stats
    stats.challengesCompleted += 1;
    stats.totalAttempts += 1;
    stats.totalPoints += Math.round(wpm * (accuracy / 100));
    stats.averageCompletionTime = ((stats.averageCompletionTime * (stats.challengesCompleted - 1)) + (timestamp ? new Date(timestamp).getTime() : Date.now())) / stats.challengesCompleted;
    stats.overallAccuracy = ((stats.overallAccuracy * (stats.challengesCompleted - 1)) + accuracy) / stats.challengesCompleted;
    stats.lastActivityDate = new Date(timestamp || Date.now());

    // Save most recent test stats
    stats.lastWpm = wpm;
    stats.lastAccuracy = accuracy;
    stats.lastDifficulty = difficulty || 'Standard';
    stats.lastTimestamp = timestamp ? new Date(timestamp) : new Date();

    // Update difficulty stats
    if (difficulty && stats.difficultyStats[difficulty]) {
      stats.difficultyStats[difficulty].completed += 1;
      stats.difficultyStats[difficulty].points += Math.round(wpm * (accuracy / 100));
    }

    await stats.save();

    res.json({ success: true, message: 'Result submitted and leaderboard updated.' });
  } catch (error) {
    console.error('Error submitting leaderboard result:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting result' });
  }
});

// Get CodeRacer leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { 
      timeFilter = 'all-time', 
      language = 'all', 
      difficulty = 'all', 
      category = 'all',
      page = 1,
      limit = 50
    } = req.query;
    
    // Build query conditions
    let queryConditions = {};
    
    // Time filter
    if (timeFilter !== 'all-time') {
      const now = new Date();
      let startDate;
      
      switch (timeFilter) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'monthly':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }
      
      if (startDate) {
        queryConditions.lastActivityDate = { $gte: startDate };
      }
    }
    
    // Get leaderboard data using aggregation pipeline to filter out guest users
    const leaderboardPipeline = [
      { $match: queryConditions },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Filter out guest users (users with authMethod 'local' and password 'guest')
      { 
        $match: { 
          $nor: [
            { 'user.authMethod': 'local', 'user.password': 'guest' }
          ]
        } 
      },
      { $sort: { totalPoints: -1, challengesCompleted: -1, averageCompletionTime: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          userId: 1,
          totalPoints: 1,
          challengesCompleted: 1,
          lastWpm: 1,
          lastAccuracy: 1,
          lastDifficulty: 1,
          lastTimestamp: 1,
          lastActivityDate: 1,
          averageCompletionTime: 1,
          currentStreak: 1,
          longestStreak: 1,
          'user.displayName': 1,
          'user.username': 1,
          'user.picture': 1
        }
      }
    ];
    
    const leaderboardData = await UserStats.aggregate(leaderboardPipeline);
    
    // Get total count for pagination (excluding guest users)
    const totalCountPipeline = [
      { $match: queryConditions },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Filter out guest users (users with authMethod 'local' and password 'guest')
      { 
        $match: { 
          $nor: [
            { 'user.authMethod': 'local', 'user.password': 'guest' }
          ]
        } 
      },
      { $count: 'total' }
    ];
    
    const totalCountResult = await UserStats.aggregate(totalCountPipeline);
    const totalUsers = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    
    // Format leaderboard data (flattened for frontend compatibility)
    const formattedData = leaderboardData.map((entry, index) => {
      return {
        rank: (page - 1) * limit + index + 1,
        username: (entry.user && (entry.user.displayName || entry.user.username)) || 'Anonymous',
        wpm: entry.lastWpm || 0,
        accuracy: entry.lastAccuracy || 0,
        difficulty: entry.lastDifficulty || 'Standard',
        timestamp: entry.lastTimestamp || entry.lastActivityDate || null,
        totalPoints: entry.totalPoints,
        challengesCompleted: entry.challengesCompleted,
        averageTime: entry.averageCompletionTime ? Math.round(entry.averageCompletionTime / 1000) : 0,
        currentStreak: entry.currentStreak,
        longestStreak: entry.longestStreak
      };
    });
    
    // Get global stats for context (excluding guest users)
    const globalStatsPipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Filter out guest users (users with authMethod 'local' and password 'guest')
      { 
        $match: { 
          $nor: [
            { 'user.authMethod': 'local', 'user.password': 'guest' }
          ]
        } 
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalChallengesCompleted: { $sum: '$challengesCompleted' },
          averagePoints: { $avg: '$totalPoints' },
          topScore: { $max: '$totalPoints' }
        }
      }
    ];
    
    const globalStatsResult = await UserStats.aggregate(globalStatsPipeline);
    const globalStats = globalStatsResult[0] || {
      totalUsers: 0,
      totalChallengesCompleted: 0,
      averagePoints: 0,
      topScore: 0
    };

    res.json({
      success: true,
      data: {
        leaderboard: formattedData,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: (page * limit) < totalUsers,
          hasPrev: page > 1
        },
        filters: {
          timeFilter,
          language,
          difficulty,
          category
        },
        globalStats: globalStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching leaderboard data' 
    });
  }
});

// Get leaderboard statistics
router.get('/leaderboard/stats', async (req, res) => {
  try {
    // Overall statistics
    const overallStats = await UserStats.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' },
          totalChallenges: { $sum: '$challengesCompleted' },
          avgAccuracy: { $avg: '$overallAccuracy' },
          avgTime: { $avg: '$averageCompletionTime' },
          longestStreak: { $max: '$longestStreak' }
        }
      }
    ]);
    
    // Language distribution
    const languageStats = await UserStats.aggregate([
      {
        $project: {
          languages: { $objectToArray: '$languageStats' }
        }
      },
      { $unwind: '$languages' },
      {
        $group: {
          _id: '$languages.k',
          totalCompleted: { $sum: '$languages.v.completed' },
          totalPoints: { $sum: '$languages.v.points' },
          avgTime: { $avg: '$languages.v.avgTime' },
          users: { $sum: { $cond: [{ $gt: ['$languages.v.completed', 0] }, 1, 0] } }
        }
      },
      { $sort: { totalCompleted: -1 } }
    ]);
    
    // Difficulty distribution
    const difficultyStats = await UserStats.aggregate([
      {
        $project: {
          difficulties: { $objectToArray: '$difficultyStats' }
        }
      },
      { $unwind: '$difficulties' },
      {
        $group: {
          _id: '$difficulties.k',
          totalCompleted: { $sum: '$difficulties.v.completed' },
          totalPoints: { $sum: '$difficulties.v.points' },
          users: { $sum: { $cond: [{ $gt: ['$difficulties.v.completed', 0] }, 1, 0] } }
        }
      },
      { $sort: { totalCompleted: -1 } }
    ]);
    
    // Level distribution
    const levelStats = await UserStats.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          avgPoints: { $avg: '$totalPoints' },
          avgChallenges: { $avg: '$challengesCompleted' }
        }
      },
      { $sort: { avgPoints: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overall: overallStats[0] || {},
        languages: languageStats,
        difficulties: difficultyStats,
        levels: levelStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching statistics' 
    });
  }
});

module.exports = router;
