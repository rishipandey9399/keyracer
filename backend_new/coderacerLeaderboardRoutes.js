const express = require('express');
const router = express.Router();
const CoderacerStats = require('./CoderacerStats');
const User = require('./User');

// Submit coding challenge result
router.post('/coderacer-leaderboard/submit', async (req, res) => {
  try {
    const { email, displayName, pointsEarned, attempts, completionTime } = req.body;
    if (!email || !displayName || !pointsEarned || !attempts || !completionTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, displayName });
      await user.save();
    }
    let stats = await CoderacerStats.findOne({ userId: user._id });
    if (!stats) {
      stats = new CoderacerStats({ userId: user._id });
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
      .populate('userId', 'displayName email')
      .sort({ totalPoints: -1, challengesCompleted: -1, averageCompletionTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const leaderboard = stats.map((entry, idx) => {
      const user = entry.userId || {};
      let name = user.displayName || user.email || 'Anonymous';
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
    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
