import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG, AUTH_CONFIG } from '@/config/database';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Please provide an email address' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found with this email' },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = await user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${AUTH_CONFIG.NEXTAUTH_URL}/password/reset/${resetToken}`;

    // Configure email
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.SERVER,
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_CONFIG.USERNAME,
        pass: EMAIL_CONFIG.PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_CONFIG.USERNAME,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
