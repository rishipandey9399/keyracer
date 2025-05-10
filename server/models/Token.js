const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['passwordReset', 'emailVerification'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Token expires after 1 hour (in seconds)
  }
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token; 