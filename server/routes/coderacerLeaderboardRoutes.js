const express = require('express');
console.log('[DIAGNOSTIC] coderacerLeaderboardRoutes.js loaded');
const router = express.Router();
const CoderacerStats = require('../models/CoderacerStats');
const User = require('../models/User');

// Submit coding challenge result
router.post('/coderacer-leaderboard/submit', async (req, res) => {
  console.log('[DIAGNOSTIC] POST /coderacer-leaderboard/submit called');
  console.log('[DIAGNOSTIC] Request body:', req.body);
  let responseSent = false;
  try {
    let { userId, pointsEarned, attempts, completionTime, email, googleId } = req.body;
    if ((!userId && !email && !googleId) || !pointsEarned || !attempts || !completionTime) {
      responseSent = true;
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // If userId is a string like 'google_...' treat it as googleId
    if (userId && typeof userId === 'string' && userId.startsWith('google_')) {
      googleId = userId;
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
        // Only auto-create user for Google sign-in
        if (googleId) {
          const newUserData = {
            googleId: googleId,
            email: email || `user_${Date.now()}@keyracer.in`,
            displayName: `User${Math.floor(Math.random() * 100000)}`,
            authMethod: 'google',
            isVerified: true
          };
          const newUser = new User(newUserData);
          await newUser.save();
          user = newUser;
        } else {
          // Do not auto-create local users in leaderboard submission
          responseSent = true;
          return res.status(404).json({ success: false, message: 'User not found and cannot be auto-created without Google ID.' });
        }
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
    responseSent = true;
    res.json({ success: true, message: 'Challenge result saved.' });
  } catch (error) {
    console.error('[DIAGNOSTIC] Error in /coderacer-leaderboard/submit:', error);
    if (!responseSent) {
      res.status(500).json({ success: false, message: 'Server error.' });
    }
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
