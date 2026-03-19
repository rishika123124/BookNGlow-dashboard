import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    await connectDB();
    
    // Use User model
    const User = require('@/models/User').default;
    
    // Build query
    let query = {};
    if (status) query.status = status;
    if (role) query.role = role;

    // Get users
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const totalCount = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { userId, action, data } = await request.json();

    await connectDB();
    
    // Use User model
    const User = require('@/models/User').default;
    
    let updateData = {};
    
    switch (action) {
      case 'block':
        updateData = { 
          status: 'blocked',
          blockedAt: new Date(),
          updatedAt: new Date()
        };
        break;
      
      case 'unblock':
        updateData = { 
          status: 'active',
          unblockedAt: new Date(),
          updatedAt: new Date()
        };
        break;
      
      case 'delete':
        // Soft delete
        updateData = { 
          status: 'deleted',
          deletedAt: new Date(),
          updatedAt: new Date()
        };
        break;
      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    const result = await User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} successfully`,
      action
    });

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Use User model
    const User = require('@/models/User').default;

    // Hard delete
    const result = await User.deleteOne({
      _id: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
