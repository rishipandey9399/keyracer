# MongoDB Integration Setup

This guide explains how to set up and configure MongoDB for user authentication, email verification, and password reset functionality.

## Prerequisites

1. MongoDB installed on your system or a MongoDB Atlas account
2. Node.js and npm installed

## Installation

1. Install the required dependencies:

```bash
npm install mongodb mongoose bcrypt jsonwebtoken
```

## Configuration

1. Create a `.env` file in the server directory with the following content:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/keyracer

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_here

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Email Configuration (Resend API)
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@keyracer.com
EMAIL_FROM_NAME=Key Racer

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# CORS Configuration (for production)
CORS_ORIGIN=https://yourdomain.com
```

2. Replace the placeholders with your actual values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `SESSION_SECRET`: A secure random string for session encryption
   - `RESEND_API_KEY`: Your Resend API key for sending emails
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Your Google OAuth credentials

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   - Windows: MongoDB should run as a service after installation
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (create a user with password)
4. Set up network access (allow connections from your IP or from anywhere for development)
5. Get your connection string from the Atlas dashboard
6. Replace the `MONGODB_URI` in your `.env` file with the Atlas connection string

## Database Structure

The application uses the following MongoDB collections:

1. **Users**: Stores user account information
   - Email, password (hashed), username, profile details
   - Authentication method (local or Google)
   - Email verification status

2. **Tokens**: Stores verification and password reset tokens
   - User ID reference
   - Token value
   - Token type (email verification or password reset)
   - Expiration timestamp

3. **Sessions**: Stores user session data
   - User ID reference
   - Session token
   - User agent and IP information
   - Expiration timestamp

## Features Implemented

1. **User Registration**: Create new user accounts with email and password
2. **Email Verification**: Verify user emails via emailed links
3. **Password Reset**: Allow users to reset passwords via emailed links
4. **Session Management**: Track and manage user login sessions
5. **Google OAuth Integration**: Allow users to sign in with Google

## Testing

1. Start the server:
```bash
npm start
```

2. Access the application at http://localhost:3000
3. Test the registration, email verification, and password reset flows

## Troubleshooting

- **Connection Issues**: Ensure MongoDB is running and the connection string is correct
- **Email Not Sending**: Verify your Resend API key is valid
- **Authentication Errors**: Check JWT_SECRET and SESSION_SECRET are properly set 