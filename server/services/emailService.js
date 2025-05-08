/**
 * Email Service
 * Provides functionality for sending emails using Resend API
 */

// In a production environment, you'd want to use a proper email sending library
// This is a simplified implementation for demonstration purposes
const { Resend } = require('resend');
require('dotenv').config();

class EmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = 'noreply@keyracer.com';
    this.fromName = 'Key Racer';
    
    if (this.apiKey) {
      this.resend = new Resend(this.apiKey);
    } else {
      console.error('RESEND_API_KEY not set in environment variables');
    }
  }
  
  /**
   * Check if API is configured
   * @returns {boolean} - True if API key is set
   */
  async checkApiConfiguration() {
    return !!this.apiKey;
  }
  
  /**
   * Send verification email
   * @param {string} email - Recipient email
   * @param {string} code - Verification code
   * @param {number} expiryMinutes - Expiry time in minutes
   * @returns {Promise<Object>} - Result of email send operation
   */
  async sendVerificationEmail(email, code, expiryMinutes = 10) {
    try {
      if (!this.apiKey) {
        console.log(`[DEV MODE] Verification code for ${email}: ${code} (expires in ${expiryMinutes} minutes)`);
        return { success: true, message: 'Verification email would be sent in production' };
      }
      
      const html = this.generateVerificationEmailContent(email, code, expiryMinutes);
      
      const data = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [email],
        subject: 'Verify your Key Racer account',
        html: html
      });
      
      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, message: 'Failed to send verification email', error: error.message };
    }
  }
  
  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} token - Reset token
   * @param {string} resetLink - Password reset link
   * @returns {Promise<Object>} - Result of email send operation
   */
  async sendPasswordResetEmail(email, token, resetLink) {
    try {
      if (!this.apiKey) {
        console.log(`[DEV MODE] Password reset link for ${email}: ${resetLink}`);
        return { success: true, message: 'Password reset email would be sent in production' };
      }
      
      const html = this.generatePasswordResetEmailContent(email, resetLink);
      
      const data = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [email],
        subject: 'Reset your Key Racer password',
        html: html
      });
      
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, message: 'Failed to send password reset email', error: error.message };
    }
  }
  
  /**
   * Generate HTML content for verification email
   * @param {string} email - Recipient email
   * @param {string} code - Verification code
   * @param {number} expiryMinutes - Expiry time in minutes
   * @returns {string} - HTML content
   */
  generateVerificationEmailContent(email, code, expiryMinutes) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1E2761; margin: 0;">Key Racer</h1>
          <p style="color: #666;">Improve your typing speed</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Email Verification</h2>
          <p>Thank you for creating an account! Please enter the following verification code to complete your registration:</p>
          <div style="background-color: #1E2761; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; color: #fff; font-weight: bold;">${code}</div>
          <p>This code will expire in ${expiryMinutes} minutes.</p>
          <p>If you didn't request this verification, you can safely ignore this email.</p>
        </div>
        
        <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
          <p>This email was sent to ${email}</p>
          <p>© ${new Date().getFullYear()} Key Racer. All rights reserved.</p>
        </div>
      </div>
    `;
  }
  
  /**
   * Generate HTML content for password reset email
   * @param {string} email - Recipient email
   * @param {string} resetLink - Password reset link
   * @returns {string} - HTML content
   */
  generatePasswordResetEmailContent(email, resetLink) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1E2761; margin: 0;">Key Racer</h1>
          <p style="color: #666;">Improve your typing speed</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Password Reset</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #FF4A4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
        
        <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
          <p>This email was sent to ${email}</p>
          <p>© ${new Date().getFullYear()} Key Racer. All rights reserved.</p>
        </div>
      </div>
    `;
  }
}

module.exports = new EmailService(); 