#!/usr/bin/env node

/**
 * Migration script to add missing fields to existing UserStats records
 */

const mongoose = require('mongoose');
const UserStats = require('../server/models/UserStats');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/keyracer';

async function migrateUserStats() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all UserStats records that don't have the new fields
        const stats = await UserStats.find({
            $or: [
                { lastWpm: { $exists: false } },
                { lastAccuracy: { $exists: false } },
                { lastDifficulty: { $exists: false } },
                { lastTimestamp: { $exists: false } }
            ]
        });

        console.log(`Found ${stats.length} records to migrate`);

        for (const stat of stats) {
            // Set default values for missing fields
            if (stat.lastWpm === undefined) stat.lastWpm = 0;
            if (stat.lastAccuracy === undefined) stat.lastAccuracy = 0;
            if (stat.lastDifficulty === undefined) stat.lastDifficulty = 'beginner';
            if (stat.lastTimestamp === undefined) stat.lastTimestamp = new Date();

            await stat.save();
            console.log(`Migrated record for user: ${stat.userId}`);
        }

        console.log('Migration completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if called directly
if (require.main === module) {
    migrateUserStats();
}

module.exports = migrateUserStats;