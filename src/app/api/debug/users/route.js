import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    console.log('=== DEBUG USERS ===');
    
    await connectDB();
    console.log('Database connected');

    // Get all users
    const allUsers = await User.find({});
    console.log(`Total users found: ${allUsers.length}`);

    if (allUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found in database',
        data: {
          totalUsers: 0,
          users: []
        }
      });
    }

    // Show user details
    const userDetails = allUsers.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    }));

    console.log('Users found:');
    userDetails.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.email} (${user.status})`);
    });

    return NextResponse.json({
      success: true,
      message: 'Users debug complete',
      data: {
        totalUsers: allUsers.length,
        users: userDetails
      }
    });

  } catch (error) {
    console.error('Users debug error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to debug users' },
      { status: 500 }
    );
  }
}
