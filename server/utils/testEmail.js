const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Load emailUtils
const { sendEmail } = require('./emailUtils');

console.log("Testing email functionality");
console.log("BREVO_SMTP_HOST:", process.env.BREVO_SMTP_HOST ? "Set" : "Not Set");
console.log("BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER ? "Set" : "Not Set");
console.log("BREVO_SMTP_PASSWORD:", process.env.BREVO_SMTP_PASSWORD ? "Set (not displayed)" : "Not Set");

// Send a test email
async function testEmail() {
  try {
    const result = await sendEmail({
      to: "test@example.com", // Replace with your email for testing
      subject: "Test Email from Key Racer",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1>Test Email</h1>
          <p>This is a test email from Key Racer to verify that the email service is working correctly.</p>
          <p>If you received this email, the email service is configured properly.</p>
        </div>
      `
    });
    
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail(); 