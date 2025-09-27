#!/bin/bash

# AI Career Guidance Chatbot Setup Script
# This script sets up the career chatbot feature for KeyRacer

echo "🤖 Setting up AI Career Guidance Chatbot for KeyRacer..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install new dependencies
echo "📦 Installing required dependencies..."
npm install @google/generative-ai express-rate-limit

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Check if GEMINI_API_KEY is set in .env
if ! grep -q "GEMINI_API_KEY=" .env; then
    echo "🔑 Adding GEMINI_API_KEY to .env file..."
    echo "" >> .env
    echo "# AI Career Guidance Chatbot Configuration" >> .env
    echo "GEMINI_API_KEY=AIzaSyDCNHM3GR3F0t84VJq_JXj6uZmplc8ToC0" >> .env
    echo "✅ GEMINI_API_KEY added to .env"
else
    echo "✅ GEMINI_API_KEY already configured in .env"
fi

# Verify all required files exist
echo "🔍 Verifying chatbot files..."

required_files=(
    "server/services/geminiService.js"
    "server/services/conversationService.js"
    "server/routes/chatRoutes.js"
    "scripts/career-chat.js"
    "scripts/career-chat-embed.js"
    "styles/career-chat.css"
    "career-chat-widget.html"
    "career-guidance-demo.html"
)

all_files_exist=true

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = true ]; then
    echo "✅ All chatbot files are present"
else
    echo "❌ Some chatbot files are missing. Please check the installation."
    exit 1
fi

# Test API key configuration
echo "🧪 Testing Gemini API configuration..."
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment');
    process.exit(1);
}

try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('✅ Gemini API configuration is valid');
} catch (error) {
    console.log('❌ Gemini API configuration error:', error.message);
    process.exit(1);
}
"

if [ $? -eq 0 ]; then
    echo "✅ Gemini API is properly configured"
else
    echo "❌ Gemini API configuration failed"
    echo "Please check your GEMINI_API_KEY in the .env file"
fi

echo ""
echo "🎉 AI Career Guidance Chatbot setup complete!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo "1. Start the server: npm run dev"
echo "2. Visit: http://localhost:3000/career-guidance-demo.html"
echo "3. Click the chat widget in the bottom-right corner"
echo ""
echo "🔧 Integration:"
echo "Add this to any KeyRacer page to embed the chat widget:"
echo '<script src="/scripts/career-chat-embed.js"></script>'
echo ""
echo "📚 Documentation: See CAREER-CHATBOT-README.md for details"
echo ""
echo "🚀 Happy coding!"