# Secure Email Verification and OAuth System

This is a secure implementation of an email verification system with additional OAuth authentication through Google.

## Features

### Email Verification
- Secure 6-digit verification codes with 10-minute expiration
- Password reset tokens with 15-minute expiration
- Rate limiting (5 requests per hour)
- Brute force protection (3 attempts max)
- Timing-safe comparisons for security

### Google OAuth Authentication
- Secure sign-in using Google's OAuth 2.0 protocol
- Session management with expiration
- User profile and email extraction
- Automatic session cleanup

## Setup

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server directory with the following variables:
   ```
   RESEND_API_KEY=your_resend_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set up the OAuth consent screen if prompted
6. For "Application type" select "Web application"
7. Add authorized JavaScript origins (e.g., `http://localhost:3000`)
8. Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/google/callback`)
9. Copy the Client ID and Client Secret to your `.env` file

## API Endpoints

### Email Verification

- `POST /api/send-verification-code` - Send a verification code
- `POST /api/verify-code` - Verify a code
- `POST /api/send-forgot-password-email` - Send a password reset email
- `POST /api/reset-password` - Reset password with token

### Google OAuth

- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Handle Google OAuth callback
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout user

## Security Features

### Email Verification
- Rate limiting to prevent abuse
- Secure token generation
- Automatic token expiration
- Brute force protection

### Google OAuth
- State parameter for CSRF protection
- Email verification check
- Secure cookie management
- Session expiration

## Development

Start the development server:
```
npm run dev
```

## Production

For production deployment:
1. Set `NODE_ENV=production` in your environment
2. Set proper values for `BASE_URL` and `CORS_ORIGIN` in your environment
3. Use secure cookies by ensuring all traffic is over HTTPS
