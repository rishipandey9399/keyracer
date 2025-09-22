const express = require('express');
const router = express.Router();
const AptitudeQuestion = require('../models/AptitudeQuestion');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const { authenticate } = require('../middleware/authMiddleware');

// Get questions by topic
router.get('/aptitude/questions/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const { limit = 20 } = req.query;
    
    const questions = await AptitudeQuestion.find({ 
      topic, 
      isActive: true 
    })
    .select('-correctAnswer -explanation')
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });
    
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit test attempt
router.post('/aptitude/submit', authenticate, async (req, res) => {
  try {
    const { testType, duration, questions, timeTaken } = req.body;
    
    let correctAnswers = 0;
    let score = 0;
    const processedQuestions = [];
    
    for (const q of questions) {
      const question = await AptitudeQuestion.findById(q.questionId);
      const isCorrect = question.correctAnswer.toLowerCase() === q.userAnswer.toLowerCase();
      
      if (isCorrect) {
        correctAnswers++;
        score += question.points;
      } else {
        score = Math.max(0, score - 1); // Negative marking
      }
      
      processedQuestions.push({
        questionId: q.questionId,
        userAnswer: q.userAnswer,
        isCorrect,
        timeSpent: q.timeSpent || 0
      });
    }
    
    const totalQuestions = questions.length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    // Calculate badges
    const badges = [];
    if (accuracy >= 90) badges.push('math-whiz');
    if (timeTaken < 300) badges.push('fast-thinker'); // Under 5 minutes
    if (correctAnswers === totalQuestions) badges.push('puzzle-master');
    
    const attempt = new AptitudeAttempt({
      userId: req.user._id,
      testType,
      duration,
      questions: processedQuestions,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      accuracy,
      timeTaken,
      badges
    });
    
    await attempt.save();
    
    res.json({ 
      success: true, 
      result: {
        score,
        accuracy,
        correctAnswers,
        wrongAnswers,
        timeTaken,
        badges
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get leaderboard
router.get('/aptitude/leaderboard', async (req, res) => {
  try {
    const { period = 'all-time' } = req.query;
    
    let dateFilter = {};
    if (period === 'daily') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    } else if (period === 'weekly') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    }
    
    const leaderboard = await AptitudeAttempt.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          bestAccuracy: { $max: '$accuracy' },
          fastestTime: { $min: '$timeTaken' },
          totalAttempts: { $sum: 1 },
          badges: { $addToSet: '$badges' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.displayName',
          username: '$user.username',
          score: '$bestScore',
          accuracy: '$bestAccuracy',
          timeTaken: '$fastestTime',
          totalAttempts: 1,
          badges: { $reduce: { input: '$badges', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }
        }
      },
      { $sort: { score: -1, accuracy: -1, timeTaken: 1 } },
      { $limit: 50 }
    ]);
    
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user stats
router.get('/aptitude/stats', authenticate, async (req, res) => {
  try {
    const stats = await AptitudeAttempt.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          bestScore: { $max: '$score' },
          avgAccuracy: { $avg: '$accuracy' },
          totalBadges: { $addToSet: '$badges' }
        }
      }
    ]);
    
    res.json({ 
      success: true, 
      stats: stats[0] || { totalAttempts: 0, bestScore: 0, avgAccuracy: 0, totalBadges: [] }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;