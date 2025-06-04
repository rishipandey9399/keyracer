#!/bin/bash

# CodeRacer System Status Check
# This script checks if all components are working correctly

echo "🔍 CodeRacer System Status Check"
echo "================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Navigate to project directory
cd "$(dirname "$0")"

echo ""
echo "1. Checking Dependencies"
echo "------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    print_status 0 "Node.js installed: $(node --version)"
else
    print_status 1 "Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    print_status 0 "npm installed: $(npm --version)"
else
    print_status 1 "npm not found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies installed"
else
    print_status 1 "Dependencies not installed (run: npm install)"
fi

echo ""
echo "2. Checking Configuration"
echo "-------------------------"

# Check .env file
if [ -f "server/.env" ]; then
    print_status 0 "Environment file exists"
else
    print_status 1 "Environment file missing (run setup script)"
fi

# Check package.json
if [ -f "package.json" ]; then
    print_status 0 "Package.json found"
else
    print_status 1 "Package.json missing"
fi

echo ""
echo "3. Checking Server Components"
echo "-----------------------------"

# Check server files
FILES=(
    "server/server.js"
    "server/models/Challenge.js"
    "server/models/UserChallenge.js"
    "server/models/UserStats.js"
    "server/routes/challengeRoutes.js"
    "server/routes/leaderboardRoutes.js"
    "server/seeds/index.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename "$file") exists"
    else
        print_status 1 "$(basename "$file") missing"
    fi
done

echo ""
echo "4. Checking Frontend Files"
echo "--------------------------"

# Check HTML files
HTML_FILES=(
    "code-racer.html"
    "coderacer-leaderboard.html"
    "coderacer-challenges.html"
)

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename "$file") exists"
    else
        print_status 1 "$(basename "$file") missing"
    fi
done

echo ""
echo "5. Testing Server Connection"
echo "----------------------------"

# Check if server is running
if curl -f http://localhost:3000 &> /dev/null; then
    print_status 0 "Server is running on port 3000"
    
    # Test API endpoints
    echo ""
    print_info "Testing API endpoints..."
    
    if curl -f http://localhost:3000/api/leaderboard &> /dev/null; then
        print_status 0 "Leaderboard API working"
    else
        print_status 1 "Leaderboard API not responding"
    fi
    
    if curl -f http://localhost:3000/api/challenges &> /dev/null; then
        print_status 0 "Challenges API working"
    else
        print_status 1 "Challenges API not responding"
    fi
    
else
    print_warning "Server not running on port 3000"
    print_info "To start the server: npm start"
fi

echo ""
echo "6. Database Status"
echo "-----------------"

# Try to check if database has data
if command -v node &> /dev/null; then
    node -e "
    const mongoose = require('mongoose');
    const path = require('path');
    require('dotenv').config({ path: path.resolve(__dirname, 'server/.env') });
    
    const Challenge = require('./server/models/Challenge');
    const connectDB = require('./server/utils/dbConnect');
    
    (async () => {
        try {
            const connected = await connectDB();
            if (connected) {
                const challengeCount = await Challenge.countDocuments();
                console.log('✅ Database connected');
                console.log('📊 Challenges in database:', challengeCount);
                if (challengeCount === 0) {
                    console.log('⚠️  No challenges found. Run: npm run seed');
                }
            } else {
                console.log('❌ Database connection failed');
            }
        } catch (error) {
            console.log('❌ Database error:', error.message);
        } finally {
            process.exit(0);
        }
    })();
    " 2>/dev/null
else
    print_warning "Cannot check database (Node.js not available)"
fi

echo ""
echo "7. Quick Actions"
echo "---------------"

echo "🚀 To start the system:"
echo "   npm start"
echo ""
echo "🌱 To seed the database:"
echo "   npm run seed"
echo ""
echo "🔧 To run setup:"
echo "   ./setup-coderacer.sh"
echo ""
echo "📱 Access points (when server is running):"
echo "   🏠 Main: http://localhost:3000/code-racer.html"
echo "   🏆 Leaderboard: http://localhost:3000/coderacer-leaderboard.html"
echo "   💻 Challenges: http://localhost:3000/coderacer-challenges.html"
echo "   🔧 API: http://localhost:3000/api/leaderboard"

echo ""
echo "📋 Status Check Complete"
echo "========================"
