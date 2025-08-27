const express = require('express');
const router = express.Router();
const CoderacerStats = require('../models/CoderacerStats');
const User = require('../models/User');

// Submit coding challenge result
router.post('/coderacer-leaderboard/submit', async (req, res) => {
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
        // Only auto-create user for Google sign-in
        if (googleId) {
          const fallbackName = email ? email.split('@')[0] : `User${Math.floor(Math.random() * 100000)}`;
          const newUserData = {
            googleId: googleId,
            email: email || `user_${Date.now()}@keyracer.in`,
            displayName: fallbackName,
            username: fallbackName,
            authMethod: 'google',
            isVerified: true
          };
          const newUser = new User(newUserData);
          await newUser.save();
          user = newUser;
        } else {
          // Do not auto-create local users in leaderboard submission
          return res.status(404).json({ success: false, message: 'User not found and cannot be auto-created without Google ID.' });
        }
      }
      userObjectId = user._id;
    }
    let stats = await CoderacerStats.findOne({ userId: userObjectId });
    if (!stats) {
      stats = new CoderacerStats({ userId: userObjectId });
    }
    // Defensive: ensure all fields are numbers
    stats.challengesCompleted = typeof stats.challengesCompleted === 'number' ? stats.challengesCompleted : 0;
    stats.totalAttempts = typeof stats.totalAttempts === 'number' ? stats.totalAttempts : 0;
    stats.totalPoints = typeof stats.totalPoints === 'number' ? stats.totalPoints : 0;
    stats.averageCompletionTime = typeof stats.averageCompletionTime === 'number' ? stats.averageCompletionTime : 0;
    stats.currentStreak = typeof stats.currentStreak === 'number' ? stats.currentStreak : 0;
    stats.longestStreak = typeof stats.longestStreak === 'number' ? stats.longestStreak : 0;

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

    const leaderboard = stats.map((entry, idx) => {
      const user = entry.userId || {};
      let name = user.displayName || user.username || user.email || 'Anonymous';
      if (!name || name === 'Anonymous') {
        if (user.email) name = user.email.split('@')[0];
      }
      // Defensive defaults for all stats fields
      const totalPoints = typeof entry.totalPoints === 'number' ? entry.totalPoints : 0;
      const averageCompletionTime = typeof entry.averageCompletionTime === 'number' ? entry.averageCompletionTime : 0;
      const currentStreak = typeof entry.currentStreak === 'number' ? entry.currentStreak : 0;
      const longestStreak = typeof entry.longestStreak === 'number' ? entry.longestStreak : 0;
      let accuracy = 100;
      if (typeof entry.challengesCompleted === 'number' && typeof entry.totalAttempts === 'number' && entry.totalAttempts > 0) {
        accuracy = Math.round((entry.challengesCompleted / entry.totalAttempts) * 100);
      }
      const averageTime = averageCompletionTime ? Math.round(averageCompletionTime / 1000) : 0;
      return {
        rank: (page - 1) * limit + idx + 1,
        user: {
          name
        },
        stats: {
          totalPoints,
          averageTime,
          accuracy,
          currentStreak,
          longestStreak
        }
      };
    });
    // Debug: log leaderboard output
    console.log('Leaderboard:', leaderboard);
    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
