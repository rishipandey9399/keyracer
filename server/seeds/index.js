const { seedChallenges } = require('./seedChallenges');
const { seedUserData } = require('./seedUserData');

async function seedAll() {
  try {
    console.log('🚀 Starting complete database seeding...\n');
    
    // Step 1: Seed challenges first
    console.log('Step 1: Seeding challenges...');
    await seedChallenges();
    console.log('✅ Challenge seeding completed\n');
    
    // Step 2: Seed user data (depends on challenges)
    console.log('Step 2: Seeding user data...');
    await seedUserData();
    console.log('✅ User data seeding completed\n');
    
    console.log('🎉 Complete database seeding finished successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start your server: npm start');
    console.log('2. Visit the leaderboard: http://localhost:3000/coderacer-leaderboard.html');
    console.log('3. Test the API endpoints: http://localhost:3000/api/leaderboard');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };
