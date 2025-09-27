const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  currentStep: {
    type: Number,
    default: 0
  },
  profile: {
    name: String,
    year: String,
    collegeTier: String,
    skills: String,
    careerGoal: String
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  roadmapGenerated: {
    type: Boolean,
    default: false
  },
  roadmap: {
    type: String,
    default: ''
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours TTL
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

chatSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);