# Key Racer - Typing Test Application

A comprehensive web application for practicing typing speed and solving coding challenges with user authentication and competitive leaderboards.

## 🚀 Features

### Typing Practice
- Multiple typing test modes and difficulties
- Real-time WPM and accuracy tracking
- User progress monitoring
- Custom text challenges

### CodeRacer Challenge System
- **Programming Challenges**: Solve coding problems in multiple languages
- **Real-time Leaderboard**: Compete with other developers
- **Comprehensive Scoring**: Points based on difficulty, time, accuracy, and streaks
- **Achievement System**: Earn badges for various accomplishments
- **Multi-language Support**: Python, JavaScript, Java, C++, C#, Go, Rust

## 🏁 Quick Start - CodeRacer

### One-Command Setup
```bash
./setup-coderacer.sh
```

### Manual Setup
```bash
# Install dependencies
npm install

# Seed database with challenges
npm run seed

# Start the server
npm start
```

### Access Points
- **Main App**: http://localhost:3000/code-racer.html
- **Code Challenges**: http://localhost:3000/coderacer-challenges.html  
- **Leaderboard**: http://localhost:3000/coderacer-leaderboard.html
- **API**: http://localhost:3000/api/leaderboard

### System Status Check
```bash
./check-coderacer.sh
```

## 📊 CodeRacer Scoring System

- **Base Points**: Easy (10pts), Medium (30pts), Hard (50pts), Expert (100pts)
- **Time Bonuses**: Top 10% (+50%), Top 25% (+25%), Top 50% (+10%)
- **Attempt Multipliers**: 1st (+100%), 2nd (-10%), 3rd (-20%), 4+ (-30%)
- **Streak Bonuses**: 3-day (+10pts), 7-day (+30pts), 30-day (+100pts)

For detailed CodeRacer documentation, see [CODERACER-README.md](CODERACER-README.md)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/key-racer.git
cd key-racer
```

2. Install dependencies:
```
cd server
npm install
```

3. Create a `.env` file in the server directory with the following content:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/keyracer

# Session Secret
SESSION_SECRET=keyracer_secret_session_key

# JWT Secret for authentication tokens
JWT_SECRET=keyracer_jwt_secret_key

# Email Configuration (Brevo SMTP)
EMAIL_FROM=noreply@keyracer.in
EMAIL_FROM_NAME=Key Racer

# Google OAuth Credentials (if using Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the server:
```
node server.js
```

Or on Windows, you can use the provided batch file:
```
start-server.bat
```

5. Open the application in your browser:
```
http://localhost:3000
```

## Features

- User authentication (local and Google Sign-In)
- Email verification
- Password reset functionality
- Typing tests with various difficulty levels
- Performance tracking and statistics
- Leaderboards
- Customizable settings

## Development

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Database: MongoDB

## Troubleshooting

If you encounter issues with email verification:

1. Make sure your email configuration (EMAIL_FROM and EMAIL_FROM_NAME) is valid
2. Verify MongoDB connection string is correct and accessible
3. For local development without email service, use the local registration option
