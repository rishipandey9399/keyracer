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
      user = new User({ username, displayName: username, email: `${username}@keyracer.in`, password: 'guest', authMethod: 'local', isVerified: false });
      await user.save();
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
const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const User = require('../models/User');
const UserChallenge = require('../models/UserChallenge');

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
    
    // Build aggregation pipeline
    let matchStage = {};
    let userMatchStage = {};
    
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
        matchStage.lastUpdated = { $gte: startDate };
      }
    }
    
    // Language filter
    if (language !== 'all') {
      userMatchStage[`languageStats.${language}.completed`] = { $gt: 0 };
    }
    
    // Get leaderboard data
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $match: userMatchStage },
      {
        $project: {
          userId: 1,
          totalPoints: 1,
          challengesCompleted: 1,
          averageCompletionTime: 1,
          overallAccuracy: 1,
          currentStreak: 1,
          longestStreak: 1,
          level: 1,
          rank: 1,
          badges: 1,
          languageStats: 1,
          difficultyStats: 1,
          'user.displayName': 1,
          'user.username': 1,
          'user.picture': 1
        }
      },
      { $sort: { totalPoints: -1, challengesCompleted: -1, averageCompletionTime: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ];
    
    const leaderboardData = await UserStats.aggregate(pipeline);
    
    // Get total count for pagination
    const totalUsers = await UserStats.countDocuments(matchStage);
    
    // Format leaderboard data
    const formattedData = leaderboardData.map((entry, index) => {
      const actualRank = (page - 1) * limit + index + 1;
      
      // Get language-specific data if filter is applied
      let languageData = {};
      if (language !== 'all' && entry.languageStats[language]) {
        languageData = entry.languageStats[language];
      }
      
      // Format badges
      const badgeIcons = {
        'first_solve': '🎯',
        'speed_demon': '⚡',
        'perfectionist': '💎',
        'streak_master': '🔥',
        'python_specialist': '🐍',
        'java_specialist': '☕',
        'javascript_specialist': '📜',
        'cpp_specialist': '⚙️',
        'csharp_specialist': '🔷'
      };
      
      const badges = entry.badges.map(badge => ({
        type: badge.type,
        icon: badgeIcons[badge.type] || '🏅',
        earnedAt: badge.earnedAt
      }));
      
      return {
        rank: actualRank,
        user: {
          id: entry.userId,
          name: entry.user.displayName || entry.user.username || 'Anonymous',
          avatar: entry.user.picture || null,
          level: entry.level
        },
        stats: {
          totalPoints: entry.totalPoints,
          challengesCompleted: entry.challengesCompleted,
          averageTime: Math.round(entry.averageCompletionTime / 1000), // Convert to seconds
          accuracy: Math.round(entry.overallAccuracy * 10) / 10, // Round to 1 decimal
          currentStreak: entry.currentStreak,
          longestStreak: entry.longestStreak
        },
        badges,
        languageData
      };
    });
    
    // Get global stats for context
    const globalStats = await UserStats.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalChallengesCompleted: { $sum: '$challengesCompleted' },
          averagePoints: { $avg: '$totalPoints' },
          topScore: { $max: '$totalPoints' }
        }
      }
    ]);
    
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
        globalStats: globalStats[0] || {
          totalUsers: 0,
          totalChallengesCompleted: 0,
          averagePoints: 0,
          topScore: 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching leaderboard' 
    });
  }
});

// Get user's position in leaderboard
router.get('/leaderboard/position/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const userStats = await UserStats.findOne({ userId })
      .populate('userId', 'displayName username picture');
    
    if (!userStats) {
      return res.status(404).json({ 
        success: false, 
        message: 'User stats not found' 
      });
    }
    
    // Get users with higher scores
    const higherScoreCount = await UserStats.countDocuments({
      totalPoints: { $gt: userStats.totalPoints }
    });
    
    const position = higherScoreCount + 1;
    
    // Get nearby users (5 above and 5 below)
    const nearbyUsers = await UserStats.find({})
      .populate('userId', 'displayName username picture')
      .sort({ totalPoints: -1, challengesCompleted: -1 })
      .skip(Math.max(0, position - 6))
      .limit(11);
    
    res.json({
      success: true,
      data: {
        position,
        userStats,
        nearbyUsers: nearbyUsers.map((user, index) => ({
          rank: Math.max(1, position - 5) + index,
          user: user.userId,
          stats: {
            totalPoints: user.totalPoints,
            challengesCompleted: user.challengesCompleted,
            averageTime: Math.round(user.averageCompletionTime / 1000),
            accuracy: Math.round(user.overallAccuracy * 10) / 10,
            currentStreak: user.currentStreak
          },
          isCurrentUser: user.userId._id.toString() === userId
        }))
      }
    });
    
  } catch (error) {
    console.error('Error fetching user position:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user position' 
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
