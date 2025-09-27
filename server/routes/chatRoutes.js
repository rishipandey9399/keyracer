const express = require('express');
const rateLimit = require('express-rate-limit');
const conversationService = require('../services/conversationService');

const router = express.Router();

// Production rate limiting
const chatLimiter = rateLimit({
  windowMs: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW) || 60000,
  max: parseInt(process.env.CHAT_RATE_LIMIT_MAX) || (process.env.NODE_ENV === 'production' ? 10 : 20),
  message: {
    success: false,
    message: 'Too many chat requests. Please wait before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1'
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body.message) {
    req.body.message = req.body.message.toString().trim().substring(0, 500);
  }
  if (req.body.sessionId) {
    req.body.sessionId = req.body.sessionId.toString().replace(/[^a-zA-Z0-9_-]/g, '');
  }
  next();
};

/**
 * POST /api/chat
 * Handle chat messages from users
 */
router.post('/chat', chatLimiter, sanitizeInput, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';

    // Validate input
    if (!message || message.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    if (!sessionId || sessionId.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID.'
      });
    }

    // Process the message with client info
    const response = await conversationService.processMessage(sessionId, message, ipAddress, userAgent);

    // Log for production monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log(`Chat: ${sessionId.substring(0, 8)}... - ${response.success ? 'Success' : 'Error'}`);
    }

    res.json(response);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.'
    });
  }
});

/**
 * GET /api/chat/start
 * Start a new chat session
 */
router.get('/chat/start', (req, res) => {
  try {
    const response = conversationService.getInitialMessage();
    res.json(response);
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start chat session.'
    });
  }
});

/**
 * POST /api/chat/reset
 * Reset a chat session
 */
router.post('/chat/reset', chatLimiter, sanitizeInput, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required.'
      });
    }

    await conversationService.resetSession(sessionId);
    const response = conversationService.getInitialMessage();

    res.json({
      success: true,
      message: 'Chat session reset successfully.',
      ...response
    });
  } catch (error) {
    console.error('Error resetting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset chat session.'
    });
  }
});

/**
 * GET /api/chat/health
 * Health check for chat service
 */
router.get('/chat/health', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.json({
    success: true,
    message: 'Chat service is running',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    environment: isProduction ? 'production' : 'development',
    version: '1.0.0'
  });
});

module.exports = router;