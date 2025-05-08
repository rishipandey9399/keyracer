import React, { useState } from 'react';
import { 
  sendVerificationCode, 
  verifyCode, 
  sendForgotPasswordEmail, 
  resetPassword,
  createExpiryTimer
} from '../api';

/**
 * Email Verification Form Component
 * Used during signup to verify user's email address
 */
export function EmailVerificationForm({ email, onVerified }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState('10:00');
  const [isExpired, setIsExpired] = useState(false);
  const [timerRef, setTimerRef] = useState(null);

  // Request a verification code
  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      
      const result = await sendVerificationCode(email);
      
      setMessage(`Verification code sent to ${email}`);
      setIsExpired(false);
      
      // Stop any existing timer
      if (timerRef) {
        timerRef.stop();
      }
      
      // Start countdown timer
      const timer = createExpiryTimer(
        result.expiresInMinutes || 10,
        (min, sec, formatted) => {
          setTimeLeft(formatted);
        },
        () => {
          setIsExpired(true);
          setMessage('Verification code has expired. Please request a new one.');
        }
      );
      
      setTimerRef(timer);
    } catch (error) {
      setMessage(error.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify the code
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!code) {
      setMessage('Please enter the verification code');
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage('');
      
      await verifyCode(email, code);
      
      setMessage('Email verified successfully!');
      
      // Callback for successful verification
      if (onVerified) {
        onVerified();
      }
    } catch (error) {
      setMessage(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verification-form">
      <h2>Verify Your Email</h2>
      <p>A verification code has been sent to {email}</p>
      
      {!isExpired && (
        <div className="timer">
          Code expires in: <span className="countdown">{timeLeft}</span>
        </div>
      )}
      
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="verification-code">Enter Verification Code</label>
          <input
            id="verification-code"
            type="text"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            disabled={isLoading}
          />
        </div>
        
        <div className="buttons">
          <button 
            type="button" 
            onClick={handleSendCode} 
            disabled={isLoading}
            className="resend-btn"
          >
            {isExpired ? 'Request New Code' : 'Resend Code'}
          </button>
          
          <button 
            type="submit" 
            disabled={isLoading || isExpired || !code}
            className="verify-btn"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
        
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

/**
 * Forgot Password Form Component
 * Used to request a password reset email
 */
export function ForgotPasswordForm({ onEmailSent }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage('');
      
      await sendForgotPasswordEmail(email);
      
      setMessage(`Reset instructions sent to ${email}`);
      
      // Callback for successful sending
      if (onEmailSent) {
        onEmailSent(email);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Reset Your Password</h2>
      <p>Enter your email address and we'll send you instructions to reset your password.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !email}
          className="submit-btn"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
        
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

/**
 * Reset Password Form Component
 * Used to set a new password after clicking the reset link
 */
export function ResetPasswordForm({ token, onPasswordReset }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage('');
      
      await resetPassword(token, newPassword);
      
      setMessage('Password has been reset successfully!');
      
      // Callback for successful reset
      if (onPasswordReset) {
        onPasswordReset();
      }
    } catch (error) {
      setMessage(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-form">
      <h2>Set New Password</h2>
      <p>Please enter your new password below.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !newPassword || !confirmPassword}
          className="submit-btn"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
        
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
} 