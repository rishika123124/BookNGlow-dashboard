import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Salon from '@/models/Salon';
import { generateToken, setAuthCookie } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt for email:', email);
    console.log('Password provided:', !!password);

    // Check if it's a user
    let user = await User.findOne({ email });
    let userType = 'customer';
    
    // If not user, check if it's a salon
    if (!user) {
      user = await Salon.findOne({ email });
      userType = 'salon';
    }

    console.log('User found:', !!user);
    console.log('User type:', userType);
    if (user) {
      console.log('User ID:', user._id);
      console.log('User has password:', !!user.password);
      console.log('User password type:', typeof user.password);
    }

    // If no user found
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token with role information
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      type: userType,
      role: userType === 'salon' ? 'salon' : 'customer'
    });

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user._id,
        name: user.name || user.salonName,
        email: user.email,
        type: userType,
        role: userType === 'salon' ? 'salon' : 'customer',
        token: token, // Include token in response for frontend access
        ...(userType === 'salon' && { salonType: user.salonType })
      }
    });

    setAuthCookie(response, token);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
