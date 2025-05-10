const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // Not required for OAuth users
  },
  username: {
    type: String,
    unique: true,
    sparse: true // Allow null values to be unique
  },
  displayName: String,
  firstName: String,
  lastName: String,
  picture: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: String,
  hasSetUsername: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this;
  
  // Only hash the password if it's modified or new
  if (!user.isModified('password') || !user.password) return next();
  
  try {
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User; 