const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    enum: ['quant', 'logical-reasoning', 'verbal', 'puzzles'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'text'],
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  points: {
    type: Number,
    default: function() {
      const pointMap = { 'easy': 2, 'medium': 4, 'hard': 6 };
      return pointMap[this.difficulty] || 2;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);