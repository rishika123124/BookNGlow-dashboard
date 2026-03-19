import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();

    const { email, phone, password } = await request.json();

    // Find user by email or phone
    const user = await User.findOne({ 
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check password (in production, use bcrypt to compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Get salon data if user is salon owner
    let salonData = null;
    if (user.userType === 'salon') {
      const Salon = require('@/models/Salon').default;
      salonData = await Salon.findOne({ userId: user._id });
      
      // Check if salon is approved and active
      if (salonData) {
        if (salonData.status !== 'approved') {
          return NextResponse.json({
            success: false,
            message: 'Your salon is pending approval. Please wait for admin approval.',
            requiresApproval: true
          }, { status: 403 });
        }
        
        if (!salonData.isActive) {
          return NextResponse.json({
            success: false,
            message: 'Your salon account is not active. Please contact support.',
            accountInactive: true
          }, { status: 403 });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        userType: user.userType,
        location: user.location,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        salon: salonData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed',
      error: error.message
    }, { status: 500 });
  }
}
