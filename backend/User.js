const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayName: { type: String },
  username: { type: String },
  email: { type: String, unique: true },
  googleId: { type: String, unique: true, sparse: true },
  picture: { type: String },
  authMethod: { type: String, enum: ['local', 'google'], default: 'local' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
