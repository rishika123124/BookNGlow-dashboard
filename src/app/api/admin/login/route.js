import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Mock admin check for testing
    if (email === 'admin@booknglow.com' && password === 'admin123') {
      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: 'mock-admin-id',
          email: 'admin@booknglow.com',
          role: 'admin'
        },
        'your-super-secret-jwt-key-for-booknglow-admin-2024',
        { expiresIn: '24h' }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          id: 'mock-admin-id',
          name: 'Admin User',
          email: 'admin@booknglow.com',
          role: 'admin'
        }
      });
    }
    
    // Database connection
    await connectDB();
    
    // Find admin in database
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }
    
    // Verify password (in production, use bcrypt)
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Admin account is deactivated' },
        { status: 403 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id.toString(),
        email: admin.email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    await Admin.updateOne(
      { _id: admin._id },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
