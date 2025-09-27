# 🧠 Aptitude Challenge System - KeyRacer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)

A comprehensive aptitude testing platform integrated with KeyRacer, featuring quantitative reasoning, logical puzzles, verbal ability tests, and brain teasers with real-time scoring and competitive leaderboards.

## 🌟 Overview

The Aptitude Challenge System is designed to help users improve their analytical thinking, problem-solving skills, and competitive exam preparation. It offers structured learning content, timed challenges, and performance analytics across multiple aptitude domains.

## ✨ Features

### 🎯 Four Core Domains
- **Quantitative Aptitude**: Mathematical reasoning, arithmetic, algebra, geometry
- **Logical Reasoning**: Pattern recognition, coding-decoding, syllogisms, blood relations
- **Verbal Ability**: Vocabulary, grammar, reading comprehension, sentence correction
- **Puzzles & Brain Teasers**: Mathematical puzzles, logical problems, visual challenges

### 📚 Learning System
- **Interactive Content**: Structured learning materials with examples
- **Formula References**: Quick access to important formulas and concepts
- **Example Problems**: Step-by-step solutions with explanations
- **Quick Tips**: Strategic advice for each topic

### ⏱️ Challenge Modes
- **Timed Tests**: 5, 10, or 20-minute challenge sessions
- **Practice Mode**: Unlimited time for learning and exploration
- **Adaptive Difficulty**: Questions ranging from easy to hard
- **Real-time Timer**: Visual countdown with warning indicators

### 🏆 Scoring & Achievements
- **Dynamic Scoring**: Points based on difficulty and accuracy
- **Badge System**: Earn achievements for exceptional performance
- **Leaderboards**: Daily, weekly, and all-time rankings
- **Performance Analytics**: Detailed statistics and progress tracking

## 🚀 Quick Access

### 🌐 Aptitude Pages
- **📖 Learn**: http://localhost:3000/aptitude-learn.html
- **🧠 Challenges**: http://localhost:3000/aptitude-challenges.html  
- **🏆 Leaderboard**: http://localhost:3000/aptitude-leaderboard.html

## 🎯 Scoring System

### Base Points by Difficulty
| Difficulty | Points | Description |
|------------|--------|-------------|
| Easy       | 2 pts  | Basic concepts and simple calculations |
| Medium     | 4 pts  | Intermediate problems requiring analysis |
| Hard       | 6 pts  | Complex problems with multiple steps |

### 🏅 Badge System
- **🧮 Math Whiz**: Achieve 90%+ accuracy in quantitative tests
- **⚡ Fast Thinker**: Complete test in under 5 minutes
- **🧩 Puzzle Master**: Score 100% on any challenge

### 📊 Scoring Formula
```
Final Score = Base Points - Negative Marking
Negative Marking = -1 point per wrong answer
Accuracy = (Correct Answers / Total Questions) × 100
```

## 🛠️ Technical Architecture

### Frontend Components
```
aptitude-learn.html      # Learning content and tutorials
aptitude-challenges.html # Timed challenges and practice
aptitude-leaderboard.html # Rankings and statistics
```

### Backend Models
```javascript
// AptitudeQuestion Schema
{
  topic: String,           // quant, logical-reasoning, verbal, puzzles
  question: String,        // Question text
  type: String,           // mcq, text
  options: [String],      // Multiple choice options
  correctAnswer: String,  // Correct answer
  explanation: String,    // Solution explanation
  difficulty: String,     // easy, medium, hard
  points: Number,         // Points for correct answer
  isActive: Boolean       // Question status
}

// AptitudeAttempt Schema
{
  userId: ObjectId,       // User reference
  testType: String,       // practice, timed
  duration: Number,       // Test duration in minutes
  questions: [{           // Question attempts
    questionId: ObjectId,
    userAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  score: Number,          // Final score
  accuracy: Number,       // Percentage accuracy
  timeTaken: Number,      // Total time in seconds
  badges: [String]        // Earned badges
}
```

### API Endpoints
```
GET  /api/aptitude/questions/:topic  # Get questions by topic
POST /api/aptitude/submit           # Submit test attempt
GET  /api/aptitude/leaderboard      # Get rankings
GET  /api/aptitude/stats           # Get user statistics
```

## 📚 Content Structure

### Quantitative Aptitude
- **Arithmetic**: Percentages, profit & loss, simple/compound interest
- **Number Systems**: Prime numbers, LCM/HCF, divisibility rules
- **Algebra**: Linear equations, quadratic equations, inequalities
- **Geometry**: Basic shapes, area, perimeter, volume calculations

### Logical Reasoning
- **Pattern Recognition**: Number series, letter series, figure series
- **Coding-Decoding**: Letter coding, number coding, symbol coding
- **Blood Relations**: Family trees, generation mapping
- **Direction Sense**: Cardinal directions, relative positioning
- **Syllogisms**: Logical statements, conclusion drawing

### Verbal Ability
- **Vocabulary**: Synonyms, antonyms, analogies, word substitution
- **Grammar**: Parts of speech, tenses, subject-verb agreement
- **Reading Comprehension**: Main ideas, inferences, tone analysis
- **Sentence Correction**: Error identification, improvement

### Puzzles & Brain Teasers
- **Mathematical Puzzles**: Number grids, age problems, calendar problems
- **Logical Puzzles**: Seating arrangements, ranking, scheduling
- **Visual Puzzles**: Cube problems, mirror images, counting figures
- **Word Puzzles**: Anagrams, crosswords, palindromes

## 🔧 Setup & Configuration

### Database Seeding
```bash
# Seed aptitude questions
npm run seed:aptitude

# Or use the seed script directly
node server/seeds/seedAptitudeQuestions.js
```

### Environment Variables
```env
# Add to your .env file
APTITUDE_QUESTIONS_LIMIT=20
APTITUDE_TIME_LIMITS=5,10,20
APTITUDE_NEGATIVE_MARKING=true
```

## 📊 Performance Analytics

### User Statistics
- **Total Attempts**: Number of tests taken
- **Best Score**: Highest score achieved
- **Average Accuracy**: Mean accuracy across all attempts
- **Badge Collection**: All earned achievements
- **Topic Performance**: Breakdown by subject area

### Leaderboard Metrics
- **Score Ranking**: Sorted by highest scores
- **Accuracy Ranking**: Best accuracy percentages  
- **Speed Ranking**: Fastest completion times
- **Badge Count**: Most achievements earned

## 🎮 User Experience

### Learning Flow
1. **Select Topic**: Choose from four main domains
2. **Study Content**: Review concepts, formulas, and examples
3. **Practice**: Take unlimited practice questions
4. **Challenge**: Attempt timed tests for scoring
5. **Review**: Analyze results and identify improvement areas

### Challenge Flow
1. **Choose Duration**: Select 5, 10, or 20-minute timer
2. **Answer Questions**: Navigate through randomized questions
3. **Submit Test**: Complete within time limit
4. **View Results**: See score, accuracy, and earned badges
5. **Check Leaderboard**: Compare with other users

## 🔍 Question Management

### Question Types
- **Multiple Choice (MCQ)**: 4 options with single correct answer
- **Text Input**: Free-form text answers for calculations

### Difficulty Levels
- **Easy**: Basic concepts, straightforward problems
- **Medium**: Intermediate complexity, multi-step solutions
- **Hard**: Advanced problems requiring deep analysis

### Quality Assurance
- **Explanation Required**: Every question includes detailed solution
- **Peer Review**: Questions validated before activation
- **Performance Tracking**: Monitor question difficulty and success rates

## 🚀 Future Enhancements

### Planned Features
- **Adaptive Testing**: AI-powered difficulty adjustment
- **Custom Tests**: User-created question sets
- **Study Groups**: Collaborative learning features
- **Progress Tracking**: Detailed analytics dashboard
- **Mobile App**: Native mobile application
- **Offline Mode**: Download questions for offline practice

### Integration Opportunities
- **Typing Speed**: Combine with typing challenges
- **Code Challenges**: Link to programming problems
- **Certification**: Issue completion certificates
- **Corporate Training**: Enterprise learning modules

## 🤝 Contributing

### Adding Questions
1. Follow the question schema format
2. Include detailed explanations
3. Test for accuracy and clarity
4. Submit via pull request

### Content Guidelines
- **Clear Language**: Use simple, unambiguous wording
- **Accurate Solutions**: Verify all answers and explanations
- **Appropriate Difficulty**: Match complexity to difficulty level
- **Educational Value**: Focus on learning outcomes

## 📄 License

This aptitude system is part of the KeyRacer project and is licensed under the MIT License.

---

<p align="center">
  🧠 Sharpen Your Mind with KeyRacer Aptitude Challenges
  <br>
  <a href="http://localhost:3000/aptitude-learn.html">📖 Start Learning</a> •
  <a href="http://localhost:3000/aptitude-challenges.html">🧠 Take Challenge</a> •
  <a href="http://localhost:3000/aptitude-leaderboard.html">🏆 View Rankings</a>
</p>