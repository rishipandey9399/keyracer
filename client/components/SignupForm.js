import React, { useState } from 'react';
import { EmailVerificationForm } from './AuthForms';

/**
 * Signup Form with Email Verification
 * A complete signup flow with email verification step
 */
export default function SignupForm() {
  const [step, setStep] = useState(1); // 1: Signup, 2: Email Verification, 3: Success
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Step 1: In a real app, you would register the user first
      // await registerUser(formData.username, formData.email, formData.password);
      
      // For demo purposes, we're just moving to the verification step
      console.log('User registered successfully', formData);
      
      // Move to the email verification step
      setStep(2);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    // Move to success step
    setStep(3);
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1: // Signup form
        return (
          <div className="signup-form">
            <h2>Create Account</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
                {errors.username && <div className="error">{errors.username}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                {errors.password && <div className="error">{errors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <div className="error">{errors.confirmPassword}</div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              {errors.submit && <div className="error submit-error">{errors.submit}</div>}
            </form>
          </div>
        );
        
      case 2: // Email verification
        return (
          <EmailVerificationForm
            email={formData.email}
            onVerified={handleVerificationSuccess}
          />
        );
        
      case 3: // Success
        return (
          <div className="success-message">
            <h2>Registration Complete!</h2>
            <p>Your account has been created and your email has been verified.</p>
            <p>You can now <a href="/login">login</a> to your account.</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      {renderStep()}
    </div>
  );
} 