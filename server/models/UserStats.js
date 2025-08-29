const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Overall stats
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
  overallAccuracy: {
    type: Number,
    default: 0
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
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  
  // Language-specific stats
  languageStats: {
    python: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      avgTime: { type: Number, default: 0 }
    },
    java: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      avgTime: { type: Number, default: 0 }
    },
    javascript: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      avgTime: { type: Number, default: 0 }
    },
    cpp: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      avgTime: { type: Number, default: 0 }
    },
    csharp: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      avgTime: { type: Number, default: 0 }
    }
  },
  
  // Difficulty-specific stats
  difficultyStats: {
    easy: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    medium: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    hard: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    expert: {
      completed: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    }
  },
  
  // Achievements
  badges: [{
    type: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Activity tracking for streaks
  dailyActivity: [{
    date: {
      type: Date,
      required: true
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    pointsEarned: {
      type: Number,
      default: 0
    }
  }],
  
  // Performance trends
  weeklyStats: [{
    weekStart: Date,
    challengesCompleted: Number,
    pointsEarned: Number,
    averageTime: Number,
    accuracy: Number
  }],
  
  // Latest test results (for leaderboard)
  lastWpm: {
    type: Number,
    default: 0
  },
  lastAccuracy: {
    type: Number,
    default: 0
  },
  lastDifficulty: {
    type: String,
    default: 'beginner'
  },
  lastTimestamp: {
    type: Date,
    default: Date.now
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for leaderboard queries
userStatsSchema.index({ totalPoints: -1 });
userStatsSchema.index({ rank: 1 });
userStatsSchema.index({ level: 1, totalPoints: -1 });

// Calculate user level based on points and achievements
userStatsSchema.methods.calculateLevel = function() {
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
userStatsSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastActivity = new Date(this.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);
  
  // Check if user was active today
  if (lastActivity.getTime() === today.getTime()) {
    // Already counted for today
    return;
  }
  
  // Check if user was active yesterday (continuing streak)
  if (lastActivity.getTime() === yesterday.getTime()) {
    this.currentStreak += 1;
  } else if (lastActivity.getTime() < yesterday.getTime()) {
    // Streak broken
    this.currentStreak = 1;
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  this.lastActivityDate = today;
  
  // Add streak bonuses
  const streakBonuses = {
    3: 10,   // 3-day streak: +10 points
    7: 30,   // 7-day streak: +30 points
    30: 100  // 30-day streak: +100 points
  };
  
  if (streakBonuses[this.currentStreak]) {
    this.totalPoints += streakBonuses[this.currentStreak];
  }
};

// Award badges based on achievements
userStatsSchema.methods.checkAndAwardBadges = function() {
  const newBadges = [];
  const currentBadgeTypes = this.badges.map(b => b.type);
  
  // First completion badge
  if (this.challengesCompleted >= 1 && !currentBadgeTypes.includes('first_solve')) {
    newBadges.push({ type: 'first_solve' });
  }
  
  // Speed demon (complete challenge in under 2 minutes)
  if (this.averageCompletionTime < 120000 && !currentBadgeTypes.includes('speed_demon')) {
    newBadges.push({ type: 'speed_demon' });
  }
  
  // Perfectionist (90%+ accuracy)
  if (this.overallAccuracy >= 90 && !currentBadgeTypes.includes('perfectionist')) {
    newBadges.push({ type: 'perfectionist' });
  }
  
  // Streak master
  if (this.longestStreak >= 7 && !currentBadgeTypes.includes('streak_master')) {
    newBadges.push({ type: 'streak_master' });
  }
  
  // Language specialist badges
  Object.keys(this.languageStats).forEach(lang => {
    const stats = this.languageStats[lang];
    if (stats.completed >= 10 && !currentBadgeTypes.includes('${lang}_specialist')) {
      newBadges.push({ type: '${lang}_specialist' });
    }
  });
  
  // Add new badges
  this.badges.push(...newBadges);
  
  return newBadges;
};

module.exports = mongoose.model('UserStats', userStatsSchema);