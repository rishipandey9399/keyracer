const geminiService = require('./geminiService');
const ChatSession = require('../models/ChatSession');

class ConversationService {
  constructor() {
    // Fallback in-memory storage for development
    this.userSessions = new Map();
    this.useDatabase = process.env.NODE_ENV === 'production';
    
    // Conversation flow configuration
    this.conversationFlow = [
      {
        key: 'name',
        question: 'Hi! I\'m your AI Career Guidance Assistant. 🚀 What\'s your name?',
        validation: (input) => input.trim().length >= 2,
        errorMessage: 'Please enter a valid name (at least 2 characters).'
      },
      {
        key: 'year',
        question: 'Nice to meet you, {name}! 👋 What year are you currently in? (e.g., 1st year, 2nd year, 3rd year, 4th year, graduate)',
        validation: (input) => /^(1st|2nd|3rd|4th|graduate|final)/i.test(input.trim()),
        errorMessage: 'Please specify your academic year (1st, 2nd, 3rd, 4th, or graduate).'
      },
      {
        key: 'collegeTier',
        question: 'What tier is your college/university? 🎓 (Tier 1, Tier 2, Tier 3, or Other)',
        validation: (input) => /^(tier\s*[123]|other)/i.test(input.trim()),
        errorMessage: 'Please specify your college tier (Tier 1, Tier 2, Tier 3, or Other).'
      },
      {
        key: 'skills',
        question: 'What are your current skills and technologies you know? 💻 (e.g., Python, JavaScript, Data Analysis, etc.)',
        validation: (input) => input.trim().length >= 3,
        errorMessage: 'Please list at least some of your skills or technologies.'
      },
      {
        key: 'careerGoal',
        question: 'What\'s your career goal or dream job? 🎯 (e.g., Software Engineer, Data Scientist, Product Manager, etc.)',
        validation: (input) => input.trim().length >= 5,
        errorMessage: 'Please describe your career goal in more detail.'
      }
    ];
  }

  /**
   * Get or create user session
   * @param {string} sessionId - Unique session identifier
   * @param {string} ipAddress - Client IP address
   * @param {string} userAgent - Client user agent
   * @returns {Promise<Object>} User session data
   */
  async getUserSession(sessionId, ipAddress = '', userAgent = '') {
    if (this.useDatabase) {
      try {
        let session = await ChatSession.findOne({ sessionId });
        if (!session) {
          session = new ChatSession({
            sessionId,
            ipAddress,
            userAgent,
            currentStep: 0,
            profile: {},
            isComplete: false,
            roadmapGenerated: false
          });
          await session.save();
        }
        return session;
      } catch (error) {
        console.error('Database error, falling back to memory:', error);
        // Fallback to memory storage
      }
    }
    
    // Memory storage fallback
    if (!this.userSessions.has(sessionId)) {
      this.userSessions.set(sessionId, {
        currentStep: 0,
        profile: {},
        isComplete: false,
        roadmapGenerated: false,
        createdAt: new Date()
      });
    }
    return this.userSessions.get(sessionId);
  }

  /**
   * Process user message and return appropriate response
   * @param {string} sessionId - Unique session identifier
   * @param {string} message - User's message
   * @param {string} ipAddress - Client IP address
   * @param {string} userAgent - Client user agent
   * @returns {Promise<Object>} Response object
   */
  async processMessage(sessionId, message, ipAddress = '', userAgent = '') {
    try {
      const session = await this.getUserSession(sessionId, ipAddress, userAgent);
      
      // If roadmap is already generated, handle follow-up questions
      if (session.roadmapGenerated) {
        return await this.handleFollowUpQuestion(session, message);
      }

      // If conversation is complete but roadmap not generated yet
      if (session.isComplete && !session.roadmapGenerated) {
        return await this.generateRoadmap(session);
      }

      // Continue with conversation flow
      return await this.handleConversationStep(session, message);
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error. Please try again.',
        isComplete: false
      };
    }
  }

  /**
   * Handle current conversation step
   * @param {Object} session - User session
   * @param {string} message - User's message
   * @returns {Promise<Object>} Response object
   */
  async handleConversationStep(session, message) {
    const currentQuestion = this.conversationFlow[session.currentStep];
    
    // Validate user input
    if (!currentQuestion.validation(message)) {
      return {
        success: false,
        message: currentQuestion.errorMessage,
        isComplete: false
      };
    }

    // Store the answer
    session.profile[currentQuestion.key] = message.trim();
    session.currentStep++;
    
    // Save message to session
    await this.saveMessage(session, 'user', message);
    
    // Update session in database
    await this.updateSession(session);

    // Check if conversation is complete
    if (session.currentStep >= this.conversationFlow.length) {
      session.isComplete = true;
      return await this.generateRoadmap(session);
    }

    // Ask next question
    const nextQuestion = this.conversationFlow[session.currentStep];
    const questionText = this.interpolateMessage(nextQuestion.question, session.profile);

    return {
      success: true,
      message: questionText,
      isComplete: false,
      progress: {
        current: session.currentStep + 1,
        total: this.conversationFlow.length
      }
    };
  }

  /**
   * Generate career roadmap using AI
   * @param {Object} session - User session
   * @returns {Promise<Object>} Response with roadmap
   */
  async generateRoadmap(session) {
    try {
      const roadmap = await geminiService.generateCareerRoadmap(session.profile);
      session.roadmapGenerated = true;
      session.roadmap = roadmap;
      
      const responseMessage = `Perfect! Based on your profile, here's your personalized career roadmap:\n\n${roadmap}\n\n💡 Feel free to ask me any follow-up questions about your roadmap!`;
      
      // Save bot response
      await this.saveMessage(session, 'bot', responseMessage);
      await this.updateSession(session);
      
      return {
        success: true,
        message: responseMessage,
        isComplete: true,
        roadmap: roadmap,
        profile: session.profile
      };
    } catch (error) {
      return {
        success: false,
        message: 'I apologize, but I\'m having trouble generating your roadmap right now. Please try again in a moment.',
        isComplete: false
      };
    }
  }

  /**
   * Handle follow-up questions after roadmap generation
   * @param {Object} session - User session
   * @param {string} question - User's follow-up question
   * @returns {Promise<Object>} Response object
   */
  async handleFollowUpQuestion(session, question) {
    try {
      const response = await geminiService.generateFollowUpResponse(question, session.profile);
      
      return {
        success: true,
        message: response,
        isComplete: true,
        isFollowUp: true
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I couldn\'t process your question right now. Please try rephrasing it.',
        isComplete: true,
        isFollowUp: true
      };
    }
  }

  /**
   * Interpolate placeholders in message with user data
   * @param {string} message - Message template
   * @param {Object} profile - User profile data
   * @returns {string} Interpolated message
   */
  interpolateMessage(message, profile) {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return profile[key] || match;
    });
  }

  /**
   * Get initial greeting message
   * @returns {Object} Initial response
   */
  getInitialMessage() {
    return {
      success: true,
      message: this.conversationFlow[0].question,
      isComplete: false,
      progress: {
        current: 1,
        total: this.conversationFlow.length
      }
    };
  }

  /**
   * Save message to session
   * @param {Object} session - Session object
   * @param {string} sender - Message sender (user/bot)
   * @param {string} message - Message content
   */
  async saveMessage(session, sender, message) {
    if (this.useDatabase && session.save) {
      session.messages.push({ sender, message });
    }
  }

  /**
   * Update session in database
   * @param {Object} session - Session object
   */
  async updateSession(session) {
    if (this.useDatabase && session.save) {
      try {
        await session.save();
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
  }

  /**
   * Reset user session
   * @param {string} sessionId - Session to reset
   */
  async resetSession(sessionId) {
    if (this.useDatabase) {
      try {
        await ChatSession.deleteOne({ sessionId });
      } catch (error) {
        console.error('Failed to delete session from database:', error);
      }
    }
    this.userSessions.delete(sessionId);
  }

  /**
   * Clean up old sessions (call periodically)
   * @param {number} maxAgeHours - Maximum age in hours
   */
  cleanupOldSessions(maxAgeHours = 24) {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.userSessions.entries()) {
      if (session.createdAt < cutoffTime) {
        this.userSessions.delete(sessionId);
      }
    }
  }
}

module.exports = new ConversationService();