const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  attempts: [{
    attemptNumber: {
      type: Number,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    completionTime: {
      type: Number, // in milliseconds
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    testsPassed: {
      type: Number,
      default: 0
    },
    totalTests: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number, // percentage
      default: 0
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bestAttempt: {
    type: Number, // index of best attempt
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  averageTime: {
    type: Number,
    default: 0
  },
  bestTime: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER
  },
  bestAccuracy: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  firstCompletedAt: {
    type: Date
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
userChallengeSchema.index({ userId: 1, isCompleted: 1 });
userChallengeSchema.index({ challengeId: 1, isCompleted: 1 });

// Calculate points based on attempt number and performance
userChallengeSchema.methods.calculatePoints = function(challenge, attempt) {
  let basePoints = challenge.points;
  
  // Attempt multipliers
  const attemptMultipliers = {
    1: 2.0,   // +100% for first attempt
    2: 0.9,   // -10% for second attempt
    3: 0.8,   // -20% for third attempt
  };
  
  const multiplier = attemptMultipliers[attempt.attemptNumber] || 0.7; // -30% for 4+ attempts
  let points = Math.floor(basePoints * multiplier);
  
  // Time bonus (if completed in top percentile)
  if (attempt.isCorrect) {
    // This would need global stats to determine percentiles
    // For now, we'll use a simple time-based bonus
    const timeBonus = Math.max(0, (challenge.timeLimit - attempt.completionTime) / challenge.timeLimit * 0.5);
    points += Math.floor(basePoints * timeBonus);
  }
  
  // Accuracy bonus
  if (attempt.accuracy >= 95) {
    points += Math.floor(basePoints * 0.1);
  }
  
  return Math.max(0, points);
};

// Update best attempt and totals
userChallengeSchema.methods.updateBestAttempt = function() {
  if (this.attempts.length === 0) return;
  
  let bestIndex = 0;
  let bestScore = 0;
  
  this.attempts.forEach((attempt, index) => {
    // Score based on correctness, time, and accuracy
    let score = 0;
    if (attempt.isCorrect) {
      score = 1000000 - attempt.completionTime + (attempt.accuracy * 1000);
    } else {
      score = attempt.testsPassed * 1000 + attempt.accuracy * 100;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  
  this.bestAttempt = bestIndex;
  const best = this.attempts[bestIndex];
  
  this.bestTime = Math.min(this.bestTime, best.completionTime);
  this.bestAccuracy = Math.max(this.bestAccuracy, best.accuracy);
  
  // Calculate average time for completed attempts only
  const completedAttempts = this.attempts.filter(a => a.isCorrect);
  if (completedAttempts.length > 0) {
    this.averageTime = completedAttempts.reduce((sum, a) => sum + a.completionTime, 0) / completedAttempts.length;
    
    if (!this.isCompleted && best.isCorrect) {
      this.isCompleted = true;
      this.completedAt = best.submittedAt;
      if (!this.firstCompletedAt) {
        this.firstCompletedAt = best.submittedAt;
      }
    }
  }
  
  // Update total points
  this.totalPoints = Math.max(...this.attempts.map(a => a.pointsEarned));
};

module.exports = mongoose.model('UserChallenge', userChallengeSchema);
