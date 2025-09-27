#!/bin/bash

# Production Deployment Script for KeyRacer with AI Career Chatbot
# This script prepares and deploys the application for production

echo "🚀 Deploying KeyRacer AI Career Chatbot to Production"
echo "=================================================="

# Check if running as root (not recommended for production)
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Warning: Running as root is not recommended for production"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="14.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $REQUIRED_VERSION or higher is required. Current: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version check passed: $NODE_VERSION"

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found"
    echo "Please create .env.production with production configuration"
    exit 1
fi

# Validate required environment variables
echo "🔍 Validating environment configuration..."

required_vars=("GEMINI_API_KEY" "MONGODB_URI" "SESSION_SECRET" "JWT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.production; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables in .env.production:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo "✅ Environment validation passed"

# Create production environment
echo "🔧 Setting up production environment..."
cp .env.production .env

# Test database connection
echo "🗄️  Testing database connection..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Database connection failed:', error.message);
    process.exit(1);
  });
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Database connection test failed"
    echo "Please check your MONGODB_URI in .env.production"
    exit 1
fi

# Test Gemini API
echo "🤖 Testing Gemini API connection..."
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found');
    process.exit(1);
}

try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('✅ Gemini API configuration valid');
    process.exit(0);
} catch (error) {
    console.log('❌ Gemini API test failed:', error.message);
    process.exit(1);
}
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Gemini API test failed"
    echo "Please check your GEMINI_API_KEY in .env.production"
    exit 1
fi

# Create systemd service file (optional)
if command -v systemctl &> /dev/null; then
    echo "🔧 Creating systemd service..."
    
    cat > keyracer.service << EOF
[Unit]
Description=KeyRacer AI Career Guidance Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node server/server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    echo "📝 Systemd service file created: keyracer.service"
    echo "To install: sudo cp keyracer.service /etc/systemd/system/"
    echo "To enable: sudo systemctl enable keyracer"
    echo "To start: sudo systemctl start keyracer"
fi

# Security recommendations
echo ""
echo "🔒 Security Recommendations:"
echo "1. Use a reverse proxy (nginx/apache) with SSL"
echo "2. Configure firewall to allow only necessary ports"
echo "3. Regularly update dependencies: npm audit"
echo "4. Monitor logs for suspicious activity"
echo "5. Use environment-specific secrets"
echo "6. Enable MongoDB authentication"
echo "7. Set up log rotation"

# Performance recommendations
echo ""
echo "⚡ Performance Recommendations:"
echo "1. Use PM2 for process management: npm install -g pm2"
echo "2. Enable gzip compression in reverse proxy"
echo "3. Set up CDN for static assets"
echo "4. Monitor memory usage and CPU"
echo "5. Use MongoDB Atlas for managed database"
echo "6. Implement caching for API responses"

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem file..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'keyracer',
    script: 'server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

echo ""
echo "🎉 Production deployment preparation complete!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo "1. Review and test the configuration"
echo "2. Set up reverse proxy (nginx recommended)"
echo "3. Configure SSL certificates"
echo "4. Start the application:"
echo "   Option A: Direct: NODE_ENV=production node server/server.js"
echo "   Option B: PM2: pm2 start ecosystem.config.js"
echo "   Option C: Systemd: sudo systemctl start keyracer"
echo ""
echo "🌐 Application will be available at: http://your-domain.com"
echo "🤖 AI Career Chat: http://your-domain.com/career-guidance-demo.html"
echo ""
echo "📊 Monitoring:"
echo "- Check logs: tail -f logs/combined.log"
echo "- PM2 status: pm2 status"
echo "- Health check: curl http://localhost:3000/api/chat/health"
echo ""
echo "🚀 Happy deploying!"