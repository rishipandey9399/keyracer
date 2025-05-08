const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const verificationService = require('./services/verificationService');
const tokenManager = require('./utils/tokenManager');
const { authenticate } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://keyracer.in', process.env.CORS_ORIGIN].filter(Boolean) : true,
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: false // Disable for development, enable in production
}));
app.use(morgan('dev')); // Logging
app.use(cookieParser()); // Parse cookies for auth
app.use(authenticate); // Apply authentication middleware to all routes

// Check if Resend API key is configured
if (!process.env.RESEND_API_KEY) {
  console.error('WARNING: RESEND_API_KEY is not set in environment variables');
  console.error('Email functionality will not work properly');
}

// Check if Google OAuth credentials are configured
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('WARNING: Google OAuth credentials are not properly set in environment variables');
  console.error('Google sign-in functionality will not work properly');
}

// Static files - Serve the client app
app.use(express.static(path.join(__dirname, '../')));

// API routes
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes); // For OAuth routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Background task: Clean up expired verification codes
setInterval(() => {
  try {
    verificationService.cleanupExpiredCodes();
    if (process.env.NODE_ENV !== 'production') {
      console.log('Cleaned up expired verification codes');
    }
  } catch (error) {
    console.error('Error cleaning up verification codes:', error);
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

module.exports = app; 