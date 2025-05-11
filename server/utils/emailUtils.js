const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * 
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise<Object>} - Response from Resend API
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields');
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log('Email sent successfully:', data);
    return data;
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
 * @returns {Promise<Object>} - Response from Resend API
 */
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `https://keyracer.in/reset-password/${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Key Racer',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Key Racer account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="margin: 20px 0;">
        <a href="${resetUrl}" style="background-color: #00FFDD; color: #111827; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
    `
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail
}; 