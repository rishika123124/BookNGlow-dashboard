import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    await connectDB();
    const { email, phone, type } = await request.json();

    if (!email && !phone) {
      return NextResponse.json({
        success: false,
        message: 'Email or phone number is required'
      }, { status: 400 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (email) {
      await User.findOneAndUpdate(
        { email },
        { 
          emailOTP: otp,
          emailOTPExpires: expiresAt
        },
        { upsert: true, new: true }
      );

      // In production, send email via SMTP service
      console.log(`Email OTP for ${email}: ${otp}`);
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent to email',
        // For development only
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }

    if (phone) {
      await User.findOneAndUpdate(
        { phone },
        { 
          phoneOTP: otp,
          phoneOTPExpires: expiresAt
        },
        { upsert: true, new: true }
      );

      // In production, send SMS via Twilio or similar service
      console.log(`Phone OTP for ${phone}: ${otp}`);
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent to phone',
        // For development only
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    }, { status: 500 });
  }
}
