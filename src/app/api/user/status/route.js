import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    console.log('=== CHECK USER STATUS ===');
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`User status check: ${email} -> ${user.status}`);

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        isBlocked: user.status === 'blocked'
      }
    });

  } catch (error) {
    console.error('User status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check user status' },
      { status: 500 }
    );
  }
}
