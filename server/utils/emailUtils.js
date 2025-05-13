const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer with Brevo SMTP
 * 
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise<Object>} - Response from email service
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields');
    }

    // Create transporter with Brevo SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      }
    });

    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Key Racer'}" <${process.env.EMAIL_FROM || 'noreply@keyracer.in'}>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim() // Strip HTML for plain text version
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a password reset email
 * 
 * @param {string} email - Recipient email
 * @param {string} token - Password reset token
 * @returns {Promise<Object>} - Response from email service
 */
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `https://keyracer.in/reset-password/${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Key Racer',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00FFDD; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
        </div>
        
        <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Key Racer. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

/**
 * Send an email verification link
 * 
 * @param {string} email - Recipient email
 * @param {string} token - Verification token
 * @returns {Promise<Object>} - Response from email service
 */
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `https://keyracer.in/verify-email.html?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Key Racer',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Email Verification</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Verify Your Email</h2>
          <p>Thank you for registering with Key Racer! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #00FFDD; color: #111827; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p>If you did not create an account, please ignore this email.</p>
          <p><strong>This link will expire in 24 hours for security reasons.</strong></p>
        </div>
        
        <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Key Racer. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail
}; 