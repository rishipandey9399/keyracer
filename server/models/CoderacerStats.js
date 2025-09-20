const mongoose = require('mongoose');

const coderacerStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // CodeRacer specific stats
  totalPoints: {
    type: Number,
    default: 0
  },
  challengesCompleted: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  
  // Level and rank
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'master', 'grandmaster'],
    default: 'beginner'
  },
  rank: {
    type: Number,
    default: 0
  },
  
  // Streaks
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  
  // Track completed challenges to prevent duplicate points
  completedChallenges: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for leaderboard queries
coderacerStatsSchema.index({ totalPoints: -1 });
coderacerStatsSchema.index({ rank: 1 });

// Calculate user level based on points and achievements
coderacerStatsSchema.methods.calculateLevel = function() {
  const points = this.totalPoints;
  const completed = this.challengesCompleted;
  
  if (points >= 5000 && completed >= 100) return 'grandmaster';
  if (points >= 2000 && completed >= 50) return 'master';
  if (points >= 1000 && completed >= 25) return 'expert';
  if (points >= 500 && completed >= 15) return 'advanced';
  if (points >= 100 && completed >= 5) return 'intermediate';
  return 'beginner';
};

// Update streak based on daily activity
coderacerStatsSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastActivity = new Date(this.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);
  
  // Check if user was active today
  if (lastActivity.getTime() === today.getTime()) {
    return;
  }
  
  // Check if user was active yesterday (continuing streak)
  if (lastActivity.getTime() === yesterday.getTime()) {
    this.currentStreak += 1;
  } else if (lastActivity.getTime() < yesterday.getTime()) {
    this.currentStreak = 1;
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  this.lastActivityDate = today;
};

module.exports = mongoose.model('CoderacerStats', coderacerStatsSchema);