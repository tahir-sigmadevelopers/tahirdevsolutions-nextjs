import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - nodemailer types
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '@/config/database';

export async function POST(req: NextRequest) {
  try {
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

    // Configure email transporter using Gmail config
    const transporter = nodemailer.createTransporter({
      host: EMAIL_CONFIG.SERVER,
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: EMAIL_CONFIG.USERNAME,
        pass: EMAIL_CONFIG.PASSWORD,
      },
    });

    // Email content for you (website owner)
    const ownerMailOptions = {
      from: EMAIL_CONFIG.USERNAME,
      to: EMAIL_CONFIG.USERNAME,
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #00f0ff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #00f0ff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #00f0ff;">${email}</a>
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email for the contact person
    const autoReplyMailOptions = {
      from: EMAIL_CONFIG.USERNAME,
      to: email,
      subject: `Thank you for contacting us, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00f0ff, #1a1a1a); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to us! We've received your message and really appreciate you taking the time to contact us.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              We typically respond within 24-48 hours. In the meantime, feel free to explore our 
              <a href="https://tahirdev.com/projects" style="color: #00f0ff; text-decoration: none;">latest projects</a> 
              or <a href="https://tahirdev.com/services" style="color: #00f0ff; text-decoration: none;">services</a>.
            </p>
            
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #00f0ff10, #1a1a1a10); border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666;">
                Best regards,<br>
                <strong style="color: #00f0ff;">Muhammad Tahir</strong><br>
                <span style="font-size: 14px;">Full Stack Developer</span>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(autoReplyMailOptions)
    ]);

    return NextResponse.json(
      { 
        message: 'Message sent successfully! We\'ll get back to you soon.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to send message. Please try again later.',
        success: false 
      },
      { status: 500 }
    );
  }
}