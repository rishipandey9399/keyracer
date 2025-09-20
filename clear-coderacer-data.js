#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

const CoderacerStats = require('./server/models/CoderacerStats');
const connectDB = require('./server/utils/dbConnect');

async function clearCoderacerData() {
    try {
        console.log('🧹 Clearing CodeRacer data...');
        
        const connected = await connectDB();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }

        const result = await CoderacerStats.deleteMany({});
        console.log(`✅ Cleared ${result.deletedCount} CodeRacer entries`);
        console.log('🎯 CodeRacer leaderboard is now clean!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

if (require.main === module) {
    clearCoderacerData().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { clearCoderacerData };