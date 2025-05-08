# Email Verification Frontend Components

This directory contains React components for handling email verification and password reset in a modern web application.

## Features

- **Email Verification**: User-friendly interface for entering and verifying email verification codes
- **Password Reset**: Forms for requesting and completing password resets
- **Countdown Timer**: Visual countdown showing verification code expiration
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: User-friendly error messages and loading states

## Components

### API Client (`api.js`)

A collection of functions for interacting with the backend API:

- `sendVerificationCode(email)`: Request a verification code
- `verifyCode(email, code)`: Verify an email with a code
- `sendForgotPasswordEmail(email)`: Request a password reset email
- `resetPassword(token, newPassword)`: Reset password with a token
- `createExpiryTimer(expiryMinutes, onTick, onExpire)`: Create a countdown timer

### Verification Forms (`AuthForms.js`)

- `EmailVerificationForm`: Component for entering and verifying codes
- `ForgotPasswordForm`: Request a password reset link
- `ResetPasswordForm`: Set a new password with a reset token

### Signup Flow (`SignupForm.js`)

A complete signup flow with:

1. Account creation form
2. Email verification step
3. Success confirmation

## Usage Examples

### Email Verification

```jsx
import { EmailVerificationForm } from './components/AuthForms';

function VerificationPage() {
  return (
    <div className="container">
      <EmailVerificationForm 
        email="user@example.com"
        onVerified={() => {
          // Handle successful verification
          console.log('Email verified!');
        }}
      />
    </div>
  );
}
```

### Password Reset Request

```jsx
import { ForgotPasswordForm } from './components/AuthForms';

function ForgotPasswordPage() {
  return (
    <div className="container">
      <ForgotPasswordForm 
        onEmailSent={(email) => {
          // Handle successful email sending
          console.log(`Reset link sent to ${email}`);
        }}
      />
    </div>
  );
}
```

### Password Reset Form

```jsx
import { ResetPasswordForm } from './components/AuthForms';
import { useSearchParams } from 'react-router-dom';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  return (
    <div className="container">
      <ResetPasswordForm 
        token={token}
        onPasswordReset={() => {
          // Handle successful password reset
          console.log('Password reset successfully');
        }}
      />
    </div>
  );
}
```

## Integration with Backend

These components are designed to work with the backend API endpoints:

- `POST /api/send-verification-code`
- `POST /api/verify-code`
- `POST /api/send-forgot-password-email`
- `POST /api/reset-password`

See the server README for complete API documentation.

## Styling

The components use class names that can be styled with your preferred CSS framework. The following classes are used:

- `.verification-form`, `.forgot-password-form`, `.reset-password-form`
- `.form-group`, `.message`, `.error`
- `.countdown`, `.timer`
- `.submit-btn`, `.resend-btn`, `.verify-btn`

Add your own CSS to customize the appearance of these components. 