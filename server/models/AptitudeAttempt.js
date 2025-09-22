const mongoose = require('mongoose');

const aptitudeAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    enum: ['practice', 'timed'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AptitudeQuestion'
    },
    userAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  badges: [{
    type: String,
    enum: ['math-whiz', 'fast-thinker', 'puzzle-master']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);