import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    console.log('=== CREATE TEST USER ===');
    
    await connectDB();
    console.log('Database connected');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testuser@booknglow.com' });
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Test user already exists',
        data: {
          email: existingUser.email,
          name: existingUser.name,
          status: existingUser.status
        }
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@booknglow.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: 'user',
      status: 'active',
      isEmailVerified: true
    });

    await testUser.save();
    console.log('Test user created successfully');

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      data: {
        email: testUser.email,
        name: testUser.name,
        status: testUser.status,
        role: testUser.role
      }
    });

  } catch (error) {
    console.error('Create test user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create test user' },
      { status: 500 }
    );
  }
}
