#!/bin/bash

echo "🏎️  Setting up KeyRacer Production Authentication System..."

# Install Node.js dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure your email settings."
else
    echo "⚠️  .env file already exists. Please verify your configuration."
fi

# Generate JWT secret if not set
if ! grep -q "JWT_SECRET=your_super_secret" .env; then
    echo "🔐 JWT secret already configured"
else
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random/JWT_SECRET=$JWT_SECRET/" .env
    echo "🔐 Generated JWT secret"
fi

echo ""
echo "🎯 Production Setup Complete!"
echo ""
echo "📧 Email Configuration Required:"
echo "   1. Edit .env file"
echo "   2. Set SMTP_USER=info@keyracer.in"
echo "   3. Set SMTP_PASS=your_app_password"
echo "   4. Configure SMTP_HOST for your email provider"
echo ""
echo "🚀 To start the server:"
echo "   npm start (production)"
echo "   npm run dev (development)"
echo ""
echo "🔗 Access your app at: http://localhost:3000"

chmod +x setup-production.sh