// Test script to debug email configuration
// Run this script to test if Gmail SMTP is working
// Usage: npm run test-email

const nodemailer = require('nodemailer');

// Email config (same as in database.ts)
const EMAIL_CONFIG = {
  USERNAME: process.env.EMAIL_USERNAME || 'tahirsultanofficial@gmail.com',
  PASSWORD: process.env.EMAIL_PASSWORD || 'zwnajhzdgfcrfdct',
};

async function testEmailConfiguration() {
  console.log('🔧 Testing Email Configuration...\n');
  
  // Show current config (hide password)
  console.log('Current Email Config:');
  console.log('- Service:', 'gmail');
  console.log('- Username:', EMAIL_CONFIG.USERNAME);
  console.log('- Password:', EMAIL_CONFIG.PASSWORD ? '***hidden***' : 'NOT SET');
  console.log('- Server:', 'smtp.gmail.com');
  console.log('');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: EMAIL_CONFIG.USERNAME,
      pass: EMAIL_CONFIG.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('📡 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Test sending email
    console.log('📧 Sending test email...');
    const testEmail = {
      from: EMAIL_CONFIG.USERNAME,
      to: 'tahirsultanofficial@gmail.com',
      subject: '🧪 Email Test - Configuration Working',
      html: `
        <h2>🎉 Email Configuration Test Successful!</h2>
        <p>This email confirms that your Gmail SMTP configuration is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> ${EMAIL_CONFIG.USERNAME}</p>
        <hr>
        <p><em>This is an automated test email from your portfolio contact form.</em></p>
      `
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('');
    console.log('🎯 Check your Gmail inbox for the test email.');
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('1. Enable 2-Factor Authentication on your Gmail account');
      console.log('2. Generate an App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use the App Password instead of your regular password');
      console.log('4. Update the EMAIL_PASSWORD in your .env file');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection Error Solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Check if firewall is blocking SMTP (port 587)');
      console.log('3. Try using port 465 with secure: true');
    } else {
      console.log('\n💡 General Solutions:');
      console.log('1. Verify your Gmail credentials');
      console.log('2. Check Gmail security settings');
      console.log('3. Enable "Less secure app access" (not recommended)');
    }
    
    console.log('\n📋 Error Details:');
    console.log(JSON.stringify(error, null, 2));
  }
}

// Run the test
testEmailConfiguration();