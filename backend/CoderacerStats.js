const mongoose = require('mongoose');

const coderacerStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalPoints: { type: Number, default: 0 },
  challengesCompleted: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  averageCompletionTime: { type: Number, default: 0 }, // ms
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoderacerStats', coderacerStatsSchema);
