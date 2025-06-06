# 🏎️ Key Racer - Interactive Typing & Coding Challenge Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)

A comprehensive web application for practicing typing speed and solving coding challenges with user authentication, competitive leaderboards, and real-time performance tracking.

![Key Racer Screenshot](https://via.placeholder.com/800x400?text=Key+Racer+Screenshot)

## 🌟 Overview

Key Racer combines the best of typing practice and competitive programming challenges. Whether you're looking to improve your typing speed or sharpen your coding skills, our platform offers a gamified learning experience with real-time feedback and community competition.

## ✨ Features

### 🎯 Typing Practice
- **Multiple Test Modes**: Various difficulty levels and typing challenges
- **Real-time Analytics**: Live WPM, accuracy, and error tracking
- **Progress Monitoring**: Detailed statistics and improvement insights
- **Custom Challenges**: Create and share your own typing tests
- **Adaptive Difficulty**: AI-powered difficulty adjustment based on performance

### 💻 CodeRacer Challenge System
- **Multi-Language Support**: Python, JavaScript, Java, C++, C#, Go, Rust
- **Programming Challenges**: Solve coding problems with varying complexity
- **Real-time Leaderboard**: Compete with developers worldwide
- **Comprehensive Scoring**: Advanced point system with time bonuses and streaks
- **Achievement System**: Unlock badges and milestones
- **Code Editor**: Syntax highlighting and auto-completion

### 🔐 User Management
- **Secure Authentication**: Local accounts with email verification
- **Google OAuth Integration**: One-click sign-in with Google
- **Password Recovery**: Secure password reset via email
- **Profile Customization**: Personalized avatars and settings
- **Progress Tracking**: Detailed performance history and analytics

## 🚀 Quick Start

### One-Command Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/key-racer.git
cd key-racer

# Run automated setup
chmod +x setup-coderacer.sh
./setup-coderacer.sh
```

### Manual Setup
```bash
# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
# Edit .env with your settings

# Seed database with challenges
npm run seed

# Start the development server
npm run dev
```

### 🌐 Access Points
- **🏠 Main Application**: http://localhost:3000/
- **🏁 Code Challenges**: http://localhost:3000/code-racer.html
- **🏆 Leaderboard**: http://localhost:3000/coderacer-leaderboard.html
- **📊 API Documentation**: http://localhost:3000/api/docs

### System Health Check
```bash
# Verify all components are working
chmod +x check-coderacer.sh
./check-coderacer.sh
```

## 🎯 CodeRacer Scoring System

Our sophisticated scoring algorithm ensures fair competition and rewards consistent performance:

| Difficulty | Base Points | Time Bonus (Top 10%) | Time Bonus (Top 25%) | Time Bonus (Top 50%) |
|------------|-------------|---------------------|---------------------|---------------------|
| Easy       | 10 pts      | +50%                | +25%                | +10%                |
| Medium     | 30 pts      | +50%                | +25%                | +10%                |
| Hard       | 50 pts      | +50%                | +25%                | +10%                |
| Expert     | 100 pts     | +50%                | +25%                | +10%                |

### 📈 Additional Multipliers
- **🥇 First Attempt**: +100% bonus
- **🥈 Second Attempt**: -10% penalty
- **🥉 Third Attempt**: -20% penalty
- **4+ Attempts**: -30% penalty

### 🔥 Streak Bonuses
- **3-day streak**: +10 points
- **7-day streak**: +30 points
- **30-day streak**: +100 points

> 📖 For detailed CodeRacer documentation, see [CODERACER-README.md](CODERACER-README.md)

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v14.0.0 or higher ([Download](https://nodejs.org/))
- **MongoDB**: v4.4+ ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**: For cloning the repository

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/key-racer.git
   cd key-racer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration** 📝
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/keyracer

   # Security Keys (Generate strong random strings)
   SESSION_SECRET=your_super_secret_session_key_here
   JWT_SECRET=your_jwt_secret_key_here

   # Email Configuration (Optional - for email verification)
   EMAIL_FROM=noreply@keyracer.in
   EMAIL_FROM_NAME=Key Racer
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password

   # Google OAuth (Optional - for Google Sign-In)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```

4. **Database Setup**
   ```bash
   # Seed the database with initial data
   npm run seed
   
   # Or seed specific collections
   npm run seed:challenges
   npm run seed:users
   ```

5. **Start the Application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify Installation** ✅
   ```bash
   # Run system health check
   ./check-coderacer.sh
   ```

### 🚀 Production Deployment

For production deployment, consider:
- Setting `NODE_ENV=production`
- Using a process manager like PM2
- Setting up reverse proxy with Nginx
- Configuring SSL certificates
- Using MongoDB Atlas for cloud database

## 🏗️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Modern, responsive design
- **JavaScript (ES6+)**: Interactive user interface
- **Font Awesome**: Icon library
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Authentication & Security
- **Passport.js**: Authentication middleware
- **Google OAuth 2.0**: Social login integration
- **JWT**: JSON Web Tokens for session management
- **bcrypt**: Password hashing
- **Helmet.js**: Security headers

### Development Tools
- **Nodemon**: Development server with auto-restart
- **Morgan**: HTTP request logger
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register       # User registration
POST /api/auth/login          # User login
POST /api/auth/logout         # User logout
GET  /auth/google             # Google OAuth
POST /api/auth/forgot         # Password reset request
POST /api/auth/reset          # Password reset
```

### Challenge Endpoints
```
GET  /api/challenges          # Get all challenges
GET  /api/challenges/:id      # Get specific challenge
POST /api/challenges/solve    # Submit solution
GET  /api/leaderboard         # Get leaderboard data
```

### User Endpoints
```
GET  /api/user/profile        # Get user profile
PUT  /api/user/profile        # Update user profile
GET  /api/user/stats          # Get user statistics
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Types of Contributions
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements

## 🐛 Troubleshooting

### Common Issues

#### Email Verification Not Working
- ✅ Verify SMTP configuration in `.env` file
- ✅ Check spam/junk folder
- ✅ Ensure firewall allows SMTP traffic
- ✅ Test with a different email provider

#### MongoDB Connection Issues
- ✅ Ensure MongoDB service is running
- ✅ Check connection string in `.env`
- ✅ Verify network connectivity
- ✅ Check MongoDB logs for errors

#### Google OAuth Not Working
- ✅ Verify Google Client ID and Secret
- ✅ Check OAuth redirect URLs in Google Console
- ✅ Ensure domain is properly configured
- ✅ Clear browser cookies and cache

#### Application Won't Start
- ✅ Check Node.js version (`node --version`)
- ✅ Reinstall dependencies (`rm -rf node_modules && npm install`)
- ✅ Verify `.env` file exists and is properly configured
- ✅ Check for port conflicts

### Getting Help
- 📖 Check our [Wiki](https://github.com/yourusername/key-racer/wiki) for detailed guides
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/key-racer/issues)
- 💬 Join our [Discord Community](https://discord.gg/keyracer) for support
- 📧 Email us at support@keyracer.in

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Contributors**: Thank you to all our amazing contributors
- **Open Source Libraries**: Built with love using open source technologies
- **Community**: Special thanks to our user community for feedback and support
- **Inspiration**: Inspired by typing.com and competitive programming platforms

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/key-racer?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/key-racer?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/key-racer)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/key-racer)

---

<p align="center">
  Made with ❤️ by the Key Racer Team
  <br>
  <a href="https://keyracer.in">🌐 Visit Website</a> •
  <a href="https://github.com/yourusername/key-racer/issues">🐛 Report Bug</a> •
  <a href="https://github.com/yourusername/key-racer/issues">✨ Request Feature</a>
</p>
