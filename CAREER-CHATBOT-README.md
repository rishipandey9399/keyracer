# 🤖 AI Career Guidance Chatbot - KeyRacer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue.svg)](https://ai.google.dev/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

An intelligent AI-powered career guidance chatbot integrated with KeyRacer, providing personalized career roadmaps using Google Gemini AI.

## 🌟 Overview

The AI Career Guidance Chatbot helps users create personalized career roadmaps by collecting their profile information and generating tailored advice using Google's Gemini AI. The system features a conversational interface that guides users through a structured Q&A process and provides actionable career guidance.

## ✨ Features

### 🎯 Core Functionality
- **Conversational Interface**: Natural chat-based interaction
- **Profile Collection**: Gathers name, academic year, college tier, skills, and career goals
- **AI-Powered Roadmaps**: Uses Google Gemini to generate personalized career advice
- **Follow-up Support**: Handles additional questions after roadmap generation
- **Progress Tracking**: Visual progress indicators during conversation

### 🛡️ Security & Performance
- **Rate Limiting**: Prevents API abuse with configurable limits
- **Input Validation**: Sanitizes and validates all user inputs
- **Session Management**: Secure in-memory session storage (expandable to database)
- **Error Handling**: Graceful error handling with user-friendly messages

### 📱 User Experience
- **Mobile-Friendly**: Responsive design for all devices
- **Floating Widget**: Non-intrusive chat widget that can be embedded anywhere
- **Dark Mode Support**: Automatic dark mode detection
- **Typing Indicators**: Real-time feedback during AI processing
- **Easy Integration**: Single script tag integration for any KeyRacer page

## 🚀 Quick Start

### Prerequisites
- Node.js v14.0.0 or higher
- Google Gemini API key
- Existing KeyRacer installation

### Installation

1. **Install Dependencies**
   ```bash
   npm install @google/generative-ai express-rate-limit
   ```

2. **Configure Environment Variables**
   Add to your `.env` file:
   ```env
   GEMINI_API_KEY=AIzaSyDCNHM3GR3F0t84VJq_JXj6uZmplc8ToC0
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```

4. **Access the Demo**
   Visit: http://localhost:3000/career-guidance-demo.html

### Integration

To add the chat widget to any KeyRacer page, simply include:

```html
<!-- Add this single line to any page -->
<script src="/scripts/career-chat-embed.js"></script>
```

## 🏗️ Architecture

### Backend Components

```
server/
├── services/
│   ├── geminiService.js      # Google Gemini AI integration
│   └── conversationService.js # Conversation flow management
└── routes/
    └── chatRoutes.js         # API endpoints for chat functionality
```

### Frontend Components

```
scripts/
├── career-chat.js           # Main chat widget functionality
└── career-chat-embed.js     # Embeddable widget script

styles/
└── career-chat.css          # Chat widget styles

career-chat-widget.html      # Standalone chat page
career-guidance-demo.html    # Integration demonstration
```

## 📚 API Documentation

### Chat Endpoints

#### Start Chat Session
```http
GET /api/chat/start
```

**Response:**
```json
{
  "success": true,
  "message": "Hi! I'm your AI Career Guidance Assistant...",
  "isComplete": false,
  "progress": {
    "current": 1,
    "total": 5
  }
}
```

#### Send Message
```http
POST /api/chat
Content-Type: application/json

{
  "message": "John Doe",
  "sessionId": "chat_1234567890_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Nice to meet you, John! What year are you currently in?",
  "isComplete": false,
  "progress": {
    "current": 2,
    "total": 5
  }
}
```

#### Reset Chat Session
```http
POST /api/chat/reset
Content-Type: application/json

{
  "sessionId": "chat_1234567890_abc123"
}
```

#### Health Check
```http
GET /api/chat/health
```

**Response:**
```json
{
  "success": true,
  "message": "Chat service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "geminiConfigured": true
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `NODE_ENV` | Environment mode | No | development |
| `PORT` | Server port | No | 3000 |

### Rate Limiting

The chat endpoints include rate limiting to prevent abuse:

- **Chat Messages**: 20 requests per minute per IP
- **Window**: 1 minute
- **Headers**: Standard rate limit headers included

### Conversation Flow

The chatbot follows a structured 5-step conversation:

1. **Name Collection**: User's name (minimum 2 characters)
2. **Academic Year**: Current year (1st, 2nd, 3rd, 4th, graduate)
3. **College Tier**: Institution tier (Tier 1, 2, 3, or Other)
4. **Skills**: Current skills and technologies
5. **Career Goal**: Desired career path or job role

## 🎨 Customization

### Styling

The chat widget supports extensive customization through CSS variables:

```css
:root {
  --chat-primary-color: #667eea;
  --chat-secondary-color: #764ba2;
  --chat-background: #ffffff;
  --chat-text-color: #2d3748;
  --chat-border-radius: 16px;
}
```

### Widget Configuration

```javascript
window.CareerChatConfig = {
  theme: 'default',           // Theme selection
  position: 'bottom-right',   // Widget position
  autoOpen: false            // Auto-open on load
};
```

## 🔍 Session Management

### In-Memory Storage

Currently uses in-memory storage for user sessions:

```javascript
// Session structure
{
  currentStep: 0,
  profile: {
    name: "John Doe",
    year: "3rd year",
    collegeTier: "Tier 1",
    skills: "Python, JavaScript",
    careerGoal: "Software Engineer"
  },
  isComplete: false,
  roadmapGenerated: false,
  createdAt: new Date()
}
```

### Database Integration (Future)

The system is designed to easily integrate with MongoDB:

```javascript
// Future UserSession model
const UserSession = new mongoose.Schema({
  sessionId: String,
  userId: ObjectId,  // Optional user linking
  profile: Object,
  messages: [Object],
  createdAt: Date,
  updatedAt: Date
});
```

## 🚀 Deployment

### Production Considerations

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   GEMINI_API_KEY=your_production_api_key
   ```

2. **Security Headers**
   ```javascript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"],
         styleSrc: ["'self'", "'unsafe-inline'"]
       }
     }
   }));
   ```

3. **Rate Limiting**
   ```javascript
   const chatLimiter = rateLimit({
     windowMs: 1 * 60 * 1000,
     max: 10, // Stricter limits for production
     message: 'Too many requests'
   });
   ```

### Monitoring

Monitor the following metrics:

- API response times
- Gemini API usage and costs
- Error rates and types
- User session durations
- Chat completion rates

## 🧪 Testing

### Manual Testing

1. **Start Chat**: Verify initial greeting message
2. **Complete Flow**: Go through all 5 conversation steps
3. **Validation**: Test input validation for each step
4. **Roadmap Generation**: Confirm AI roadmap generation
5. **Follow-up Questions**: Test post-roadmap interactions
6. **Error Handling**: Test network failures and API errors

### API Testing

```bash
# Test chat health
curl http://localhost:3000/api/chat/health

# Test chat start
curl http://localhost:3000/api/chat/start

# Test message sending
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"John Doe","sessionId":"test_session"}'
```

## 🔮 Future Enhancements

### Planned Features

- **Database Integration**: Persistent session storage with MongoDB
- **User Authentication**: Link chats to user accounts
- **Chat History**: Save and retrieve previous conversations
- **Multi-language Support**: Internationalization
- **Voice Interface**: Speech-to-text and text-to-speech
- **Advanced Analytics**: User behavior and success metrics
- **Custom Prompts**: Configurable AI prompts for different scenarios

### Scalability Improvements

- **Redis Session Store**: For distributed deployments
- **Queue System**: Background processing for AI requests
- **Caching Layer**: Cache common responses
- **Load Balancing**: Multiple server instances
- **CDN Integration**: Static asset optimization

## 🤝 Contributing

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd keyracer
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

### Code Style

- Use ESLint configuration
- Follow existing naming conventions
- Add JSDoc comments for functions
- Include error handling for all async operations

### Testing Guidelines

- Test all conversation flows
- Verify input validation
- Check error scenarios
- Test mobile responsiveness
- Validate accessibility features

## 📄 License

This chatbot feature is part of the KeyRacer project and is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI**: Powering the intelligent responses
- **KeyRacer Team**: Integration and development
- **Open Source Community**: Dependencies and inspiration

---

<p align="center">
  🤖 Empowering Career Growth with AI
  <br>
  <a href="/career-guidance-demo.html">🌐 Try Demo</a> •
  <a href="https://github.com/yourusername/key-racer/issues">🐛 Report Bug</a> •
  <a href="https://ai.google.dev/">📚 Gemini AI Docs</a>
</p>