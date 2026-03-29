import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Booking from '@/models/Booking';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  try {
    console.log('=== TEST BLOCK/UNBLOCK FLOW ===');
    
    await connectDB();
    console.log('Database connected');

    const { action, email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find or create test user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create test user
      const hashedPassword = await bcryptjs.hash('test123', 12);
      user = new User({
        name: 'Test Block User',
        email: email,
        password: hashedPassword,
        phone: '+919876543210',
        role: 'user',
        status: 'active',
        isEmailVerified: true
      });
      await user.save();
      console.log('Test user created:', email);
    }

    let message = '';
    
    switch (action) {
      case 'block':
        user.status = 'blocked';
        await user.save();
        message = 'User blocked successfully';
        console.log('User blocked:', email);
        break;
        
      case 'unblock':
        user.status = 'active';
        await user.save();
        message = 'User unblocked successfully';
        console.log('User unblocked:', email);
        break;
        
      case 'test-booking':
        if (user.status === 'blocked') {
          message = 'Booking blocked - user is blocked';
          console.log('Booking attempt blocked for user:', email);
        } else {
          message = 'Booking allowed - user is active';
          console.log('Booking attempt allowed for user:', email);
        }
        break;
        
      case 'status':
        message = `User status: ${user.status}`;
        console.log('User status checked:', email, user.status);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        });
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        email: user.email,
        name: user.name,
        status: user.status,
        isBlocked: user.status === 'blocked'
      }
    });

  } catch (error) {
    console.error('Test flow error:', error);
    return NextResponse.json(
      { success: false, message: 'Test flow failed' },
      { status: 500 }
    );
  }
}
