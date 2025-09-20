
const express = require('express');
console.log('[DIAGNOSTIC] coderacerLeaderboardRoutes.js loaded');
const router = express.Router();
const CoderacerStats = require('../models/CoderacerStats');
const User = require('../models/User');

// Clear all CodeRacer leaderboard data
router.post('/coderacer-leaderboard/clear-demo-data', async (req, res) => {
	try {
		// Delete all CoderacerStats entries
		const result = await CoderacerStats.deleteMany({});
		
		res.json({ 
			success: true, 
			message: `Cleared ${result.deletedCount} CodeRacer entries. Leaderboard is now clean.` 
		});
	} catch (error) {
		console.error('Error clearing CodeRacer data:', error);
		res.status(500).json({ success: false, message: 'Server error.' });
	}
});

// Submit coding challenge result
router.post('/coderacer-leaderboard/submit', async (req, res) => {
	console.log('[DIAGNOSTIC] POST /coderacer-leaderboard/submit called');
	console.log('[DIAGNOSTIC] Request body:', req.body);
	let responseSent = false;
	try {
		let { userId, pointsEarned, attempts, completionTime, email, googleId, createGuestUser, displayName } = req.body;
		
		// Validate required fields
		if ((!userId && !email && !googleId) || pointsEarned === undefined || !attempts || !completionTime) {
			responseSent = true;
			return res.status(400).json({ success: false, message: 'Missing required fields' });
		}
		
		// Only award points if pointsEarned > 0 (successful completion)
		if (pointsEarned <= 0) {
			responseSent = true;
			return res.json({ success: true, message: 'No points awarded for incomplete challenge.' });
		}
		
		// If userId is a string like 'google_...' treat it as googleId
		if (userId && typeof userId === 'string' && userId.startsWith('google_')) {
			googleId = userId;
		}
		let userObjectId = userId;
		// If userId is not a valid ObjectId, try to look up by googleId or email
		if (!userObjectId || !userObjectId.match(/^[0-9a-fA-F]{24}$/)) {
			let user = null;
			if (googleId) {
				user = await User.findOne({ googleId });
			} else if (email) {
				user = await User.findOne({ email });
			}
			if (!user) {
				// Auto-create user for Google sign-in or guest users
				if (googleId) {
					const newUserData = {
						googleId: googleId,
						email: email || `user_${Date.now()}@keyracer.in`,
						displayName: `User${Math.floor(Math.random() * 100000)}`,
						authMethod: 'google',
						isVerified: true
					};
					const newUser = new User(newUserData);
					await newUser.save();
					user = newUser;
				} else if (createGuestUser && email) {
					// Create guest user for challenge completion
					const userName = displayName || email.split('@')[0];
					const uniqueUsername = `${userName.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`;
					const newUserData = {
						email: email,
						displayName: userName,
						username: uniqueUsername,
						password: 'guest_user',
						authMethod: 'local',
						isVerified: true
					};
					const newUser = new User(newUserData);
					await newUser.save();
					user = newUser;
				} else {
					responseSent = true;
					return res.status(404).json({ success: false, message: 'User not found.' });
				}
			}
			userObjectId = user._id;
		}
		let stats = await CoderacerStats.findOne({ userId: userObjectId });
		if (!stats) {
			stats = new CoderacerStats({ userId: userObjectId });
		}
		// Update stats only for successful completions
		stats.challengesCompleted += 1;
		stats.totalAttempts += attempts;
		stats.totalPoints += pointsEarned;
		stats.averageCompletionTime =
			((stats.averageCompletionTime * (stats.challengesCompleted - 1)) + completionTime) / stats.challengesCompleted;
		stats.lastActivityDate = new Date();
		stats.level = stats.calculateLevel();
		stats.updateStreak();
		await stats.save();
		responseSent = true;
		res.json({ success: true, message: 'Challenge result saved.', pointsAwarded: pointsEarned });
	} catch (error) {
		console.error('[DIAGNOSTIC] Error in /coderacer-leaderboard/submit:', error);
		if (!responseSent) {
			res.status(500).json({ success: false, message: 'Server error.' });
		}
	}
});

// Get coderacer leaderboard
router.get('/coderacer-leaderboard', async (req, res) => {
	try {
		const { page = 1, limit = 50 } = req.query;
		
		// Get leaderboard data from CoderacerStats
		const leaderboardPipeline = [
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user'
				}
			},
			{ $unwind: '$user' },
			// Only show users who have completed challenges
			{ 
				$match: { 
					challengesCompleted: { $gt: 0 },
					totalPoints: { $gt: 0 }
				} 
			},
			// Sort by total points (descending)
			{ $sort: { totalPoints: -1 } },
			{ $skip: (page - 1) * limit },
			{ $limit: parseInt(limit) },
			{
				$project: {
					totalPoints: 1,
					challengesCompleted: 1,
					'user.displayName': 1,
					'user.username': 1
				}
			}
		];
		
		const stats = await CoderacerStats.aggregate(leaderboardPipeline);
		
		const leaderboard = stats.map((entry, idx) => ({
			rank: (page - 1) * limit + idx + 1,
			user: {
				name: entry.user.displayName || entry.user.username || 'Player'
			},
			stats: {
				totalPoints: entry.totalPoints || 0,
				challengesCompleted: entry.challengesCompleted || 0
			}
		}));
		res.json({ success: true, data: { leaderboard } });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server error.' });
	}
});

module.exports = router;