#!/usr/bin/env node

/**
 * Google OAuth Users Viewer
 * Script to view and access Google OAuth user data from MongoDB
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const mongoose = require('mongoose');
const User = require('../server/models/User');

// MongoDB connection
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/keyracer';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

// Display user data in a formatted way
function displayUser(user, index) {
  console.log(`\n📋 User ${index + 1}:`);
  console.log(`   ID: ${user._id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Display Name: ${user.displayName}`);
  console.log(`   Google ID: ${user.googleId}`);
  console.log(`   Username: ${user.username || 'Not set'}`);
  console.log(`   Picture: ${user.picture || 'No picture'}`);
  console.log(`   Verified: ${user.isVerified ? '✅' : '❌'}`);
  console.log(`   Has Username: ${user.hasSetUsername ? '✅' : '❌'}`);
  console.log(`   Created: ${user.createdAt}`);
  console.log(`   Last Login: ${user.lastLogin}`);
  console.log(`   Auth Method: ${user.authMethod}`);
}

// Main function to view Google users
async function viewGoogleUsers() {
  console.log('🔍 Fetching Google OAuth users from database...\n');
  
  try {
    // Find all users who signed up with Google
    const googleUsers = await User.find({ 
      authMethod: 'google' 
    }).sort({ createdAt: -1 });
    
    if (googleUsers.length === 0) {
      console.log('📭 No Google OAuth users found in the database.');
      return;
    }
    
    console.log(`📊 Found ${googleUsers.length} Google OAuth user(s):`);
    console.log('=' .repeat(60));
    
    googleUsers.forEach((user, index) => {
      displayUser(user, index);
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log(`📈 Total Google Users: ${googleUsers.length}`);
    
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
  }
}

// Function to get user by email
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      authMethod: 'google' 
    });
    
    if (!user) {
      console.log(`❌ No Google OAuth user found with email: ${email}`);
      return null;
    }
    
    console.log(`✅ Found Google OAuth user:`);
    displayUser(user, 0);
    return user;
    
  } catch (error) {
    console.error('❌ Error fetching user:', error.message);
    return null;
  }
}

// Function to get user statistics
async function getUserStats() {
  try {
    const totalUsers = await User.countDocuments();
    const googleUsers = await User.countDocuments({ authMethod: 'google' });
    const localUsers = await User.countDocuments({ authMethod: 'local' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const usersWithUsername = await User.countDocuments({ hasSetUsername: true });
    
    console.log('\n📊 User Statistics:');
    console.log('=' .repeat(40));
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Google OAuth Users: ${googleUsers}`);
    console.log(`Local Users: ${localUsers}`);
    console.log(`Verified Users: ${verifiedUsers}`);
    console.log(`Users with Username: ${usersWithUsername}`);
    console.log('=' .repeat(40));
    
  } catch (error) {
    console.error('❌ Error fetching statistics:', error.message);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🏎️  KeyRacer - Google OAuth Users Viewer');
  console.log('=' .repeat(50));
  
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }
  
  try {
    switch (command) {
      case 'list':
      case 'all':
        await viewGoogleUsers();
        break;
        
      case 'email':
        const email = args[1];
        if (!email) {
          console.log('❌ Please provide an email address');
          console.log('Usage: node view-google-users.js email user@example.com');
          break;
        }
        await getUserByEmail(email);
        break;
        
      case 'stats':
        await getUserStats();
        break;
        
      default:
        console.log('\n📖 Usage:');
        console.log('  node view-google-users.js list     - View all Google OAuth users');
        console.log('  node view-google-users.js email <email> - Find user by email');
        console.log('  node view-google-users.js stats    - Show user statistics');
        console.log('\nExamples:');
        console.log('  node view-google-users.js list');
        console.log('  node view-google-users.js email john@gmail.com');
        console.log('  node view-google-users.js stats');
        break;
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  viewGoogleUsers,
  getUserByEmail,
  getUserStats
};