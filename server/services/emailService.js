/**
 * Email Service
 * Provides functionality for sending emails using Nodemailer with Brevo SMTP
 */

// In a production environment, you'd want to use a proper email sending library
// This is a simplified implementation for demonstration purposes
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');

class EmailService {
  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@keyracer.in';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Key Racer';
    
    // Will create transporter when needed to allow for test accounts in development
    this.transporter = null;
    this.testAccount = null;
  }
  
  /**
   * Get or create a transporter
   * @returns {Promise<Object>} - Nodemailer transporter
   */
  async getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }
    
    // Check if we're in production with proper credentials
    if (process.env.NODE_ENV === 'production' && 
        process.env.BREVO_SMTP_USER && 
        process.env.BREVO_SMTP_PASSWORD) {
      
      // Create transporter with Brevo SMTP settings
      this.transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // TLS
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_PASSWORD
        }
      });
    } else {
      // For development/testing, use ethereal.email (fake SMTP service)
      this.testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass
        }
      });
      
      console.log('Using Ethereal test account for email delivery');
    }
    
    return this.transporter;
  }
  
  /**
   * Check if API is configured
   * @returns {boolean} - True if API key is set
   */
  async checkApiConfiguration() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      return false;
    }
  }
  
  /**
   * Generate verification token for a user
   * @param {string} userId - User ID
   * @returns {Promise<string>} - Generated token
   */
  async generateVerificationToken(userId) {
    try {
      // Delete any existing verification tokens for this user
      await Token.deleteMany({ userId, type: 'emailVerification' });
      
      // Generate a new token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Save the token
      await new Token({
        userId,
        token,
        type: 'emailVerification'
      }).save();
      
      return token;
    } catch (error) {
      console.error('Error generating verification token:', error);
      throw error;
    }
  }
  
  /**
   * Generate password reset token for a user
   * @param {string} userId - User ID
   * @returns {Promise<string>} - Generated token
   */
  async generatePasswordResetToken(userId) {
    try {
      // Delete any existing password reset tokens for this user
      await Token.deleteMany({ userId, type: 'passwordReset' });
      
      // Generate a new token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Save the token
      await new Token({
        userId,
        token,
        type: 'passwordReset'
      }).save();
      
      return token;
    } catch (error) {
      console.error('Error generating password reset token:', error);
      throw error;
    }
  }
  
  /**
   * Send verification email
   * @param {string} email - Recipient email
   * @param {string} verificationLink - Verification link
   * @returns {Promise<Object>} - Result of email send operation
   */
  async sendVerificationEmail(email, verificationLink) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV MODE] Verification link for ${email}: ${verificationLink}`);
        // Only return early if we're in development and the transporter verification fails
        if (!(await this.checkApiConfiguration())) {
          return { success: true, message: 'Verification email would be sent in production' };
        }
      }
      
      const html = this.generateVerificationEmailContent(email, verificationLink);
      
      const info = await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: email,
        subject: 'Verify your Key Racer account',
        html: html,
        text: html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
      });
      
      console.log('Verification email sent successfully, ID:', info.messageId);
      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, message: 'Failed to send verification email', error: error.message };
    }
  }
  
  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} resetLink - Password reset link
   * @returns {Promise<Object>} - Result of email send operation
   */
  async sendPasswordResetEmail(email, resetLink) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV MODE] Password reset link for ${email}: ${resetLink}`);
        // Only return early if we're in development and the transporter verification fails
        if (!(await this.checkApiConfiguration())) {
          return { success: true, message: 'Password reset email would be sent in production' };
        }
      }
      
      const html = this.generatePasswordResetEmailContent(email, resetLink);
      
      const info = await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: email,
        subject: 'Reset your Key Racer password',
        html: html,
        text: html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
      });
      
      console.log('Password reset email sent successfully, ID:', info.messageId);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, message: 'Failed to send password reset email', error: error.message };
    }
  }
  
  /**
   * Generate HTML content for verification email
   * @param {string} email - Recipient email
   * @param {string} verificationLink - Verification link
   * @returns {string} - HTML content
   */
  generateVerificationEmailContent(email, verificationLink) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1E2761; margin: 0;">Key Racer</h1>
          <p style="color: #666;">Improve your typing speed</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Email Verification</h2>
          <p>Thank you for creating an account! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #00FFDD; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
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
            <a href="${resetLink}" style="background-color: #00FFDD; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
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