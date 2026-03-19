import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { email, phone, otp, type } = await request.json();

    if (!otp) {
      return NextResponse.json({
        success: false,
        message: 'OTP is required'
      }, { status: 400 });
    }

    let user;
    let isVerified = false;

    if (email) {
      user = await User.findOne({ 
        email,
        emailOTP: otp,
        emailOTPExpires: { $gt: new Date() }
      });

      if (user) {
        user.isEmailVerified = true;
        user.emailOTP = undefined;
        user.emailOTPExpires = undefined;
        await user.save();
        isVerified = true;
      }
    }

    if (phone) {
      user = await User.findOne({ 
        phone,
        phoneOTP: otp,
        phoneOTPExpires: { $gt: new Date() }
      });

      if (user) {
        user.isPhoneVerified = true;
        user.phoneOTP = undefined;
        user.phoneOTPExpires = undefined;
        await user.save();
        isVerified = true;
      }
    }

    if (!isVerified || !user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired OTP'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    }, { status: 500 });
  }
}
