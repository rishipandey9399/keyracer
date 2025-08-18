const express = require('express');
console.log('[DIAGNOSTIC] coderacerLeaderboardRoutes.js loaded');
const router = express.Router();
const CoderacerStats = require('../models/CoderacerStats');
const User = require('../models/User');

// Submit coding challenge result
router.post('/coderacer-leaderboard/submit', async (req, res) => {
  console.log('[DIAGNOSTIC] POST /coderacer-leaderboard/submit called');
  console.log('[DIAGNOSTIC] Request body:', req.body);
  try {
    const { userId, pointsEarned, attempts, completionTime, email, googleId } = req.body;
    if ((!userId && !email && !googleId) || !pointsEarned || !attempts || !completionTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let userObjectId = userId;
    // If userId is not a valid ObjectId, try to look up by googleId or email
    if (!userObjectId || !userObjectId.match(/^[0-9a-fA-F]{24}$/)) {
      let user = null;
      if (googleId) {
        user = await User.findOne({ googleId });
      } else if (email) {
        user = await User.findOne({ email });
      }
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      userObjectId = user._id;
    }

    let stats = await CoderacerStats.findOne({ userId: userObjectId });
    if (!stats) {
      stats = new CoderacerStats({ userId: userObjectId });
    }

    // Update stats
    stats.challengesCompleted += 1;
    stats.totalAttempts += attempts;
    stats.totalPoints += pointsEarned;
    stats.averageCompletionTime =
      ((stats.averageCompletionTime * (stats.challengesCompleted - 1)) + completionTime) / stats.challengesCompleted;
    stats.lastActivityDate = new Date();

    // Streak logic (simple: if last activity was yesterday, increment streak)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (stats.lastActivityDate > yesterday) {
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) stats.longestStreak = stats.currentStreak;
    } else {
      stats.currentStreak = 1;
    }

    await stats.save();
    res.json({ success: true, message: 'Challenge result saved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Get coderacer leaderboard
router.get('/coderacer-leaderboard', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const stats = await CoderacerStats.find({})
      .populate('userId', 'displayName username picture')
      .sort({ totalPoints: -1, challengesCompleted: -1, averageCompletionTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const leaderboard = stats.map((entry, idx) => ({
      rank: (page - 1) * limit + idx + 1,
      user: entry.userId,
      totalPoints: entry.totalPoints,
      challengesCompleted: entry.challengesCompleted,
      totalAttempts: entry.totalAttempts,
      averageCompletionTime: entry.averageCompletionTime,
      currentStreak: entry.currentStreak,
      longestStreak: entry.longestStreak
    }));

    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
