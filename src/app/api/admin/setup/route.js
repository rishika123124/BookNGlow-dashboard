import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectDB();
    
    // Use Admin model instead of direct collection
    const Admin = require('@/models/Admin').default;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@booknglow.com' });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Create admin user
    const adminUser = new Admin({
      name: 'Admin User',
      email: 'admin@booknglow.com',
      password: 'admin123', // In production, use hashed password
      role: 'admin',
      isActive: true,
      permissions: [
        { module: 'users', actions: ['read', 'write', 'delete'] },
        { module: 'salons', actions: ['read', 'write', 'delete'] },
        { module: 'bookings', actions: ['read', 'write', 'delete'] },
        { module: 'support', actions: ['read', 'write', 'delete'] },
        { module: 'premium', actions: ['read', 'write'] },
        { module: 'settings', actions: ['read', 'write'] }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const result = await adminUser.save();

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        email: adminUser.email,
        password: adminUser.password
      }
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create admin user'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Use Admin model
    const Admin = require('@/models/Admin').default;
    
    const adminCount = await Admin.countDocuments();

    return NextResponse.json({
      success: true,
      adminExists: adminCount > 0
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check admin status'
    }, { status: 500 });
  }
}
