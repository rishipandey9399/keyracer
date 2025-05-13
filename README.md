# Key Racer - Typing Test Application

A web application for practicing and improving typing speed with user authentication.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/key-racer.git
cd key-racer
```

2. Install dependencies:
```
cd server
npm install
```

3. Create a `.env` file in the server directory with the following content:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/keyracer

# Session Secret
SESSION_SECRET=keyracer_secret_session_key

# JWT Secret for authentication tokens
JWT_SECRET=keyracer_jwt_secret_key

# Email Configuration (Brevo SMTP)
EMAIL_FROM=noreply@keyracer.in
EMAIL_FROM_NAME=Key Racer

# Google OAuth Credentials (if using Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start the server:
```
node server.js
```

Or on Windows, you can use the provided batch file:
```
start-server.bat
```

5. Open the application in your browser:
```
http://localhost:3000
```

## Features

- User authentication (local and Google Sign-In)
- Email verification
- Password reset functionality
- Typing tests with various difficulty levels
- Performance tracking and statistics
- Leaderboards
- Customizable settings

## Development

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Database: MongoDB

## Troubleshooting

If you encounter issues with email verification:

1. Make sure your email configuration (EMAIL_FROM and EMAIL_FROM_NAME) is valid
2. Verify MongoDB connection string is correct and accessible
3. For local development without email service, use the local registration option
