const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
console.log("EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME);
console.log("BREVO_SMTP_HOST:", process.env.BREVO_SMTP_HOST ? "Set" : "Not Set");
console.log("BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER ? "Set" : "Not Set");
console.log("BREVO_SMTP_PASSWORD:", process.env.BREVO_SMTP_PASSWORD ? "Set (not displayed)" : "Not Set");

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { URLSearchParams } = require('url');
const rateLimit = require('express-rate-limit');

// Import database connection
const connectDB = require('./utils/dbConnect');

// Import models
const User = require('./models/User');
const Session = require('./models/Session');

// Import routes
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Import middleware
const { authenticate } = require('./middleware/authMiddleware');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().then(connected => {
  if (!connected) {
    console.error('Failed to connect to MongoDB. Please check your connection string.');
    // Continue running the server even if DB connection fails
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : true,
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: false // Disable for development, enable in production
}));
app.use(morgan('dev')); // Logging
app.use(cookieParser()); // Parse cookies for auth

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days for longer persistence
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Check if email configuration is valid
if (!process.env.EMAIL_FROM || !process.env.EMAIL_FROM_NAME) {
  console.error('WARNING: Email configuration is not properly set in environment variables');
  console.error('Email functionality may not work properly');
} else {
  console.log('Email configuration found using Brevo SMTP');
}

// Check if Google OAuth credentials are configured
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('WARNING: Google OAuth credentials are not properly set in environment variables');
  console.error('Google sign-in functionality will not work properly');
} else {
  console.log('Google OAuth credentials found. Configuring Passport...');
  
  // Configure Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://keyracer.in/auth/google/callback'
      : 'http://localhost:3000/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Get email from profile
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
      
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }
      
      // Check if user exists in database
      let user = await User.findOne({ email });
      
      if (!user) {
        // First time user - create a new user record
        user = new User({
          email,
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          picture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          authMethod: 'google',
          isVerified: true, // Google accounts are pre-verified
          hasSetUsername: false
        });
        
        await user.save();
        console.log(`New user ${email} created via Google OAuth`);
      } else {
        // Returning user - update profile information
        user.displayName = profile.displayName;
        user.picture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
        user.lastLogin = new Date();
        user.googleId = profile.id;
        user.authMethod = 'google';
        user.isVerified = true;
        
        await user.save();
      }
      
      console.log(`User ${email} authenticated via Google`);
      return done(null, user);
    } catch (error) {
      console.error('Error during Google authentication:', error);
      return done(error, null);
    }
  }));
  
  // Serialize user - store only the user ID in the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  // Deserialize user - retrieve user from database
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Static files - Serve the client app
app.use(express.static(path.join(__dirname, '../')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', challengeRoutes);
app.use('/api', leaderboardRoutes);

// Add rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/auth/send-verification', authLimiter);

// User info endpoint
app.get('/api/user', authenticate, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
      username: req.user.username,
      picture: req.user.picture,
      hasSetUsername: req.user.hasSetUsername,
      isVerified: req.user.isVerified
    }
  });
});

// Update username endpoint
app.post('/api/user/username', authenticate, async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    }
    
    // Check if username is already taken by another user
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: req.user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }
    
    // Update user's username
    req.user.username = username;
    req.user.hasSetUsername = true;
    await req.user.save();
    
    res.json({ 
      success: true, 
      message: 'Username updated successfully',
      user: {
        username,
        hasSetUsername: true
      }
    });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Direct Passport routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    // Check if user has set a username
    if (req.user && req.user.hasSetUsername) {
      // Returning user with username - redirect to dashboard
      res.redirect('/dashboard');
    } else {
      // New user or user without username - redirect to success page to set username
      const userParams = new URLSearchParams({
        provider: 'google',
        name: req.user.displayName || '',
        email: req.user.email || '',
        picture: req.user.picture || '',
        newUser: req.user.hasSetUsername ? 'false' : 'true'
      });
      
      res.redirect(`/login-success.html?${userParams.toString()}`);
    }
  }
);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication check middleware for protected routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login.html');
}

// Protected route example
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Catch-all route to handle client-side routing
app.get('*', (req, res) => {
  // Exclude API routes
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
}); 