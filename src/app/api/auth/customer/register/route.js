import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || ''
    });

    await user.save();

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      type: 'customer' 
    });

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

    setAuthCookie(response, token);
    return response;

  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
