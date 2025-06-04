# CodeRacer Leaderboard System

A production-ready leaderboard system for coding challenges with comprehensive ranking, real-time updates, and detailed user statistics.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Environment variables configured

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/keyracer
# or your MongoDB Atlas connection string
```

### 3. Seed the Database
```bash
# Seed both challenges and user data
npm run seed

# Or seed individually
npm run seed:challenges  # Seed coding challenges
npm run seed:users      # Seed user data and statistics
```

### 4. Start the Server
```bash
npm start
# or for development
npm run dev
```

### 5. Access the Leaderboard
Open your browser and navigate to:
- **Leaderboard UI**: http://localhost:3000/coderacer-leaderboard.html
- **API Endpoint**: http://localhost:3000/api/leaderboard

## 📊 Features

### Comprehensive Scoring System
- **Base Points**: Easy (10pts), Medium (30pts), Hard (50pts), Expert (100pts)
- **Time Bonuses**: Top 10% (+50%), Top 25% (+25%), Top 50% (+10%)
- **Attempt Multipliers**: 1st attempt (+100%), 2nd (-10%), 3rd (-20%), 4+ (-30%)
- **Streak Bonuses**: 3-day (+10pts), 7-day (+30pts), 30-day (+100pts)
- **Accuracy Impact**: Points scaled by solution accuracy

### Real-time Leaderboard
- Live rankings with automatic updates every 30 seconds
- Filter by time period (day, week, month, all-time)
- Filter by programming language
- Filter by difficulty level
- Filter by challenge category

### User Statistics
- Total points and rank
- Challenges completed/attempted
- Average accuracy percentage
- Current and best streaks
- Language proficiency breakdown
- Difficulty level progress
- Achievement badges

### API Endpoints

#### Leaderboard
- `GET /api/leaderboard` - Get leaderboard with optional filters
- `GET /api/leaderboard/user/:username/position` - Get user's rank and nearby users

#### Challenges
- `GET /api/challenges` - List all challenges with filters
- `GET /api/challenges/:id` - Get specific challenge details
- `POST /api/challenges/:id/submit` - Submit solution for a challenge
- `GET /api/challenges/user/:userId/progress` - Get user's challenge progress

## 🏗️ Database Schema

### Models

#### Challenge
```javascript
{
  title: String,
  description: String,
  difficulty: ['easy', 'medium', 'hard', 'expert'],
  language: ['python', 'java', 'javascript', 'cpp', 'csharp', 'go', 'rust'],
  category: ['algorithms', 'data-structures', 'dynamic-programming', ...],
  points: Number,
  starterCode: String,
  solution: String,
  testCases: [{ input: Mixed, expectedOutput: Mixed }],
  timeLimit: Number, // milliseconds
  memoryLimit: Number // MB
}
```

#### UserChallenge
```javascript
{
  userId: ObjectId,
  challengeId: ObjectId,
  completed: Boolean,
  timeTaken: Number, // seconds
  accuracy: Number, // 0-1
  attemptNumber: Number,
  pointsEarned: Number,
  submittedAt: Date,
  codeSubmitted: String,
  testsPassed: Number,
  testsTotal: Number
}
```

#### UserStats
```javascript
{
  userId: ObjectId,
  totalPoints: Number,
  challengesCompleted: Number,
  challengesAttempted: Number,
  averageAccuracy: Number,
  bestStreak: Number,
  currentStreak: Number,
  rank: Number,
  badges: [String],
  languageStats: Object,
  difficultyStats: Object,
  categoryStats: Object,
  lastActive: Date
}
```

## 🧪 Testing

### Automatic Testing
```bash
# Test API endpoints (requires server to be running)
node test-api.js
```

### Manual Testing
1. **Start the server**: `npm start`
2. **Seed the database**: `npm run seed`
3. **Open the leaderboard**: http://localhost:3000/coderacer-leaderboard.html
4. **Test API calls**:
   ```bash
   curl http://localhost:3000/api/leaderboard
   curl http://localhost:3000/api/challenges
   curl "http://localhost:3000/api/leaderboard?period=week&language=python"
   ```

### Sample Data
The seeding script creates:
- **8 coding challenges** across different difficulties and languages
- **5 sample users** with varying skill levels
- **Realistic challenge attempts** with proper scoring
- **Complete user statistics** with rankings and badges

## 📁 Project Structure

```
keyracer/
├── server/
│   ├── models/
│   │   ├── Challenge.js          # Challenge data schema
│   │   ├── UserChallenge.js      # User attempt tracking
│   │   └── UserStats.js          # User statistics & rankings
│   ├── routes/
│   │   ├── challengeRoutes.js    # Challenge API endpoints
│   │   └── leaderboardRoutes.js  # Leaderboard API endpoints
│   ├── seeds/
│   │   ├── index.js              # Main seeding script
│   │   ├── seedChallenges.js     # Challenge data seeder
│   │   └── seedUserData.js       # User data seeder
│   └── server.js                 # Main server file
├── coderacer-leaderboard.html    # Leaderboard frontend
├── test-api.js                   # API testing script
└── package.json
```

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/keyracer

# Server
PORT=3000

# Optional: Authentication (if integrating with existing auth)
JWT_SECRET=your-jwt-secret
```

### Customization
- **Scoring weights**: Modify in `server/routes/leaderboardRoutes.js`
- **Challenge categories**: Update in `server/models/Challenge.js`
- **Time limits**: Adjust in challenge seed data
- **Badge criteria**: Customize in user stats calculation

## 🔄 Next Steps

1. **Authentication Integration**: Connect with existing user authentication
2. **Real-time Updates**: Implement WebSocket for live leaderboard updates
3. **Challenge Submission UI**: Create frontend for submitting challenge solutions
4. **Code Execution**: Integrate with code execution service for testing
5. **Analytics Dashboard**: Add detailed analytics and insights
6. **Mobile Optimization**: Enhance responsive design for mobile devices

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI in .env file
- Ensure network connectivity for cloud databases

### API Errors
- Check server logs for detailed error messages
- Verify all required dependencies are installed
- Ensure database is properly seeded

### Frontend Issues
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Ensure CORS is properly configured

## 📝 API Examples

### Get Leaderboard
```bash
curl "http://localhost:3000/api/leaderboard?limit=10&period=week"
```

### Submit Challenge Solution
```bash
curl -X POST "http://localhost:3000/api/challenges/CHALLENGE_ID/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def solution(nums): return nums",
    "language": "python"
  }'
```

### Get User Position
```bash
curl "http://localhost:3000/api/leaderboard/user/alice_dev/position"
```

## 🏆 Achievement System

The system includes an automatic badge/achievement system:
- **Dedicated Solver**: Complete 10+ challenges
- **Point Master**: Earn 500+ total points
- **Accuracy Expert**: Maintain 80%+ average accuracy
- **Polyglot**: Solve challenges in 3+ languages
- **Speed Demon**: Achieve multiple top-10% time bonuses
- **Streak Master**: Maintain 7+ day solving streak

---

For questions or issues, please check the troubleshooting section or review the API testing script for validation.
