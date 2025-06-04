#!/bin/bash

# CodeRacer Setup Script
# This script helps set up the CodeRacer leaderboard system

echo "🏁 CodeRacer Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Navigate to the project directory
cd "$(dirname "$0")"

echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo ""
    echo "🔧 Creating environment configuration..."
    cp server/sample.env server/.env
    echo "✅ Created server/.env from sample.env"
    echo "💡 You can edit server/.env to customize your MongoDB connection"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🌱 Seeding database with sample data..."
node server/seeds/index.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "🚀 To start the server:"
    echo "   npm start"
    echo ""
    echo "📱 Then visit:"
    echo "   🏠 Main App: http://localhost:3000/code-racer.html"
    echo "   🏆 Leaderboard: http://localhost:3000/coderacer-leaderboard.html"
    echo "   💻 Challenges: http://localhost:3000/coderacer-challenges.html"
    echo "   🔧 API: http://localhost:3000/api/leaderboard"
    echo ""
    echo "📚 For more information, see CODERACER-README.md"
else
    echo ""
    echo "⚠️  Database seeding failed. You may need to:"
    echo "   1. Check your MongoDB connection in server/.env"
    echo "   2. Ensure MongoDB is running"
    echo "   3. Run the seeding manually: node server/seeds/index.js"
    echo ""
    echo "🚀 You can still start the server:"
    echo "   npm start"
fi
