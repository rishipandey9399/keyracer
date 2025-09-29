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

    // Log for production monitoring with agent context
    if (process.env.NODE_ENV === 'production') {
      const logContext = response.isAgentCommand ? `Agent-${response.commandType}` : 'Chat';
      console.log(`${logContext}: ${sessionId.substring(0, 8)}... - ${response.success ? 'Success' : 'Error'}`);
    }

    res.json(response);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'AI agent encountered an error. Please try again.'
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
    message: 'AI Career Agent is running',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    environment: isProduction ? 'production' : 'development',
    version: '2.0.0',
    agentType: 'Career Guidance AI Agent'
  });
});

/**
 * GET /api/chat/capabilities
 * Get AI agent capabilities and commands
 */
router.get('/chat/capabilities', (req, res) => {
  try {
    const capabilities = conversationService.getAgentCapabilities();
    res.json({
      success: true,
      ...capabilities
    });
  } catch (error) {
    console.error('Error getting capabilities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get agent capabilities.'
    });
  }
});

/**
 * POST /api/chat/command
 * Execute specific AI agent command
 */
router.post('/chat/command', chatLimiter, sanitizeInput, async (req, res) => {
  try {
    const { command, sessionId, parameters } = req.body;
    
    if (!command || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Command and session ID are required.'
      });
    }
    
    const session = await conversationService.getUserSession(sessionId);
    
    if (!session.isComplete) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile first before using agent commands.'
      });
    }
    
    const response = await conversationService.handleAgentCommand(command, session, parameters || '');
    res.json(response);
  } catch (error) {
    console.error('Error executing agent command:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute agent command.'
    });
  }
});

module.exports = router;