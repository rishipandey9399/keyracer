const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service using Nodemailer with Brevo SMTP
 */
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
    return nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD,
      },
    });
  }

  /**
   * Send an email using Nodemailer
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.html - Email HTML content
   * @param {string} [options.text] - Plain text version of the email
   * @returns {Promise<Object>} - Response from email service
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      // Log information in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
      }

      // Get or create transporter
      const transporter = await this.getTransporter();

      // Send email through Nodemailer
      const info = await transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: [to],
        subject,
        html,
        text: text || this.stripHtml(html),
      });

      // For development, log the test URL where the email can be viewed
      if (this.testAccount) {
        console.log('Email preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('Message sent: %s', info.messageId);
        return { 
          success: true, 
          data: info.messageId,
          previewUrl: nodemailer.getTestMessageUrl(info)
        };
      } else {
        console.log('Email sent successfully, ID:', info.messageId);
        return { success: true, data: info.messageId };
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      // In development, simulate success to continue the flow
      if (process.env.NODE_ENV !== 'production') {
        console.log('Simulating email success in development mode');
        return { 
          success: true, 
          simulated: true,
          data: 'dev-' + Date.now(),
          error: error.message
        };
      }
      
      return { success: false, error };
    }
  }

  /**
   * Send a password reset email
   * @param {string} to - Recipient email address
   * @param {string} resetToken - Password reset token
   * @param {string} resetLink - Complete password reset link
   * @returns {Promise<Object>} - Response from email service
   */
  async sendPasswordResetEmail(to, resetToken, resetLink) {
    const subject = 'Reset Your Password';
    const html = this.generatePasswordResetEmailContent(resetLink);
    
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send a verification email with code
   * @param {string} to - Recipient email address
   * @param {string} verificationCode - Verification code
   * @param {number} expiryMinutes - Minutes until expiration
   * @returns {Promise<Object>} - Response from email service
   */
  async sendVerificationEmail(to, verificationCode, expiryMinutes = 10) {
    const subject = 'Verify Your Email Address';
    const html = this.generateVerificationEmailContent(verificationCode, expiryMinutes);
    
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Generate password reset email content
   * @param {string} resetLink - Password reset link
   * @returns {string} - HTML content for the email
   */
  generatePasswordResetEmailContent(resetLink) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #333; margin: 0;">Password Reset</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #333;">Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to set a new password:</p>
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background-color: #00FFDD; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p><strong>This link will expire in 15 minutes.</strong></p>
          </div>
          
          <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Key Racer. All rights reserved.</p>
          </div>
      </div>
    `;
  }

  /**
   * Generate verification email content
   * @param {string} code - Verification code
   * @param {number} expiryMinutes - Minutes until expiration
   * @returns {string} - HTML content for the email
   */
  generateVerificationEmailContent(code, expiryMinutes) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #333; margin: 0;">Email Verification</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #333;">Verify Your Email</h2>
              <p>Thank you for registering! Please use the following verification code to complete your registration:</p>
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; color: #333; font-weight: bold; border: 1px solid #ddd;">${code}</div>
              <p><strong>This code will expire in ${expiryMinutes} minutes.</strong></p>
              <p>If you did not request this code, please ignore this email.</p>
          </div>
          
          <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Key Racer. All rights reserved.</p>
          </div>
      </div>
    `;
  }

  /**
   * Strip HTML tags for plain text version
   * @param {string} html - HTML content
   * @returns {string} - Plain text content
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = new EmailService(); 