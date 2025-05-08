# Email Authentication System with Resend API

A complete solution for implementing secure email verification and password reset in web applications using the [Resend](https://resend.com) API.

## Features

- **Email Verification**: Securely verify user email addresses with time-limited verification codes
- **Password Reset**: Allow users to reset their passwords via email links
- **Security**: Built with modern security practices including rate limiting, brute force protection
- **Cross-Platform**: Works with any frontend (React, Vue, Angular, or vanilla JavaScript)
- **Well-Documented**: Comprehensive documentation and examples

## Project Structure

- `/server` - Node.js backend with Resend integration
  - `/utils` - Helper utilities (token management, email sending)
  - `/routes` - API endpoints
- `/client` - Frontend examples and components
  - `/components` - React components
  - `/examples` - Vanilla JavaScript examples
  - `/styles` - CSS styles for the components

## Backend Setup

### Prerequisites

- Node.js v14+
- [Resend API key](https://resend.com/api-keys)

### Installation

1. Set up environment variables:

```
cd server
```

Create a `.env` file with the following:

```
# Resend API Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name

# Server Configuration
PORT=3000
NODE_ENV=development
```

2. Install dependencies and start the server:

```bash
npm install
npm start
```

## API Endpoints

### Email Verification

- `POST /api/send-verification-code` - Send a verification code to email
- `POST /api/verify-code` - Verify a code

### Password Reset

- `POST /api/send-forgot-password-email` - Request a password reset link
- `POST /api/reset-password` - Reset password with token

## Frontend Integration

### React Components

The `/client/components` directory contains reusable React components:

- `EmailVerificationForm` - For verifying email addresses
- `ForgotPasswordForm` - For requesting password resets
- `ResetPasswordForm` - For setting a new password
- `SignupForm` - Complete signup flow with email verification

### Vanilla JavaScript

See the `/client/examples` directory for vanilla JavaScript implementations:

- `email-verification.html` - Example of email verification
- `forgot-password.html` - Example of requesting a password reset
- `reset-password.html` - Example of resetting a password
- `vanilla-js-example.js` - JavaScript code for all examples

## Security Considerations

- All tokens and codes expire after a short period (10-15 minutes)
- Rate limiting prevents abuse
- Brute force protection with attempt limits
- Securely generated tokens using cryptographic functions
- Timing-safe code comparisons to prevent timing attacks

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a proper domain for your emails
3. Store credentials securely
4. Set up proper CORS configuration
5. Use HTTPS

## License

This project is licensed under the MIT License - see the LICENSE file for details.
