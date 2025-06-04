const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true
  },
  language: {
    type: String,
    enum: ['python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust'],
    required: true
  },
  category: {
    type: String,
    enum: ['algorithms', 'data-structures', 'dynamic-programming', 'graphs', 'strings', 'arrays', 'sorting'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: function() {
      const pointMap = {
        'easy': 10,
        'medium': 30,
        'hard': 50,
        'expert': 100
      };
      return pointMap[this.difficulty] || 10;
    }
  },
  starterCode: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  timeLimit: {
    type: Number, // in milliseconds
    default: 300000 // 5 minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

challengeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Challenge', challengeSchema);
