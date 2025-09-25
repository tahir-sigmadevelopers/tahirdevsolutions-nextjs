import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '@/config/database';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get client information
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Save contact form data to database
    const contactData = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: clientIP,
      userAgent: userAgent,
    });

    const savedContact = await contactData.save();
    console.log('Contact saved to database:', savedContact._id);

    // Configure email transporter using Gmail config
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

    // Test transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      // Continue anyway - we'll try to send and handle errors
    }

    // Email content for you (website owner) - notification email
    const ownerMailOptions = {
      from: EMAIL_CONFIG.USERNAME,
      to: 'tahirsultanofficial@gmail.com', // Your specific email
      subject: `🚨 New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #00f0ff, #1a1a1a); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          </div>
          
          <div style="background: white; padding: 30px;">
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1976d2; margin-top: 0;">Contact Information</h2>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00f0ff;">${email}</a></p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Database ID:</strong> ${savedContact._id}</p>
            </div>
            
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800;">
              <h3 style="color: #f57c00; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e8f5e8; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #2e7d32; font-weight: bold;">✅ Data saved to database successfully</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">IP: ${clientIP}</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="background: #00f0ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to ${name}</a>
            </div>
          </div>
        </div>
      `,
    };

    // Auto-reply email for the contact person
    const autoReplyMailOptions = {
      from: EMAIL_CONFIG.USERNAME,
      to: email,
      subject: `✅ Thank you for contacting Muhammad Tahir - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00f0ff, #1a1a1a); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You, ${name}! 🙏</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0;">Your message has been received</p>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #555; line-height: 1.6; font-size: 16px; margin-top: 0;">
              Thank you for reaching out! I've received your message and really appreciate you taking the time to contact me.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00f0ff;">
              <h3 style="color: #333; margin-top: 0;">📄 Your Message Summary:</h3>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px;">
                <p style="margin: 0; color: #666; font-style: italic;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #e3f2fd, #f3e5f5); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">⏰ What happens next?</h3>
              <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li>I typically respond within <strong>24-48 hours</strong></li>
                <li>I'll review your requirements carefully</li>
                <li>You'll receive a detailed response to your email</li>
                <li>We can schedule a call if needed</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              In the meantime, feel free to explore my work and services:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://tahirdev.com/projects" style="background: #00f0ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">View My Projects</a>
              <a href="https://tahirdev.com/services" style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">My Services</a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #00f0ff10, #1a1a1a10); border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666;">
                Best regards,<br>
                <strong style="color: #00f0ff; font-size: 18px;">Muhammad Tahir</strong><br>
                <span style="font-size: 14px; color: #888;">Full Stack Developer & Web Solutions Expert</span><br>
                <a href="mailto:tahirsultanofficial@gmail.com" style="color: #00f0ff; text-decoration: none;">tahirsultanofficial@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px; padding: 20px;">
            <p style="margin: 0;">This is an automated confirmation email. Your message is securely stored and will be reviewed personally.</p>
            <p style="margin: 10px 0 0 0;">© 2024 Muhammad Tahir - Professional Web Development Services</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    let emailStatus: { sent: boolean; error: any } = { sent: false, error: null };
    
    try {
      console.log('Attempting to send emails...');
      console.log('From:', EMAIL_CONFIG.USERNAME);
      console.log('To:', 'tahirsultanofficial@gmail.com');
      
      await Promise.all([
        transporter.sendMail(ownerMailOptions),
        transporter.sendMail(autoReplyMailOptions)
      ]);
      
      emailStatus.sent = true;
      console.log('✅ Both emails sent successfully');
    } catch (emailError: unknown) {
      emailStatus.error = emailError as any;
      console.error('❌ Email sending failed:', emailError);
      
      const error = emailError as any;
      console.error('Error details:', {
        code: error?.code || 'unknown',
        command: error?.command || 'unknown',
        response: error?.response || 'unknown',
        responseCode: error?.responseCode || 'unknown'
      });
      
      // Log specific Gmail errors
      if (error?.code === 'EAUTH') {
        console.error('Authentication failed - check Gmail app password');
      } else if (error?.code === 'ECONNECTION') {
        console.error('Connection failed - check network/firewall');
      }
      
      // Don't fail the request if emails fail - data is already saved
    }

    const responseData: any = {
      message: emailStatus.sent 
        ? 'Message sent successfully! I\'ll get back to you within 24-48 hours.'
        : 'Message saved successfully! I\'ll get back to you within 24-48 hours. (Email notification pending)',
      success: true,
      contactId: savedContact._id,
      emailSent: emailStatus.sent
    };
    
    if (emailStatus.error) {
      responseData.emailError = 'Email notification failed - will be retried';
    }
    
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { 
            message: 'Please check your input and try again.',
            success: false 
          },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        message: 'Sorry, there was a server error. Please try again or contact me directly at tahirsultanofficial@gmail.com',
        success: false 
      },
      { status: 500 }
    );
  }
}