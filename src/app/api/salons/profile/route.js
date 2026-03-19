import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Salon from '@/models/Salon';
import { ObjectId } from 'bson';

export async function GET(request) {
  try {
    console.log('GET /api/salons/profile - Starting salon profile fetch');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header or invalid format');
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Extracted token:', token);
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    
    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user has salon owner role
    const { id, email, role } = decoded;
    console.log('User info:', { id, email, role });
    
    if (!email) {
      console.log('Email is missing from token');
      return NextResponse.json(
        { success: false, message: 'Email is required for salon profile access' },
        { status: 400 }
      );
    }
    
    if (role !== 'salon') {
      console.log('Access denied: User role is not salon');
      return NextResponse.json(
        { success: false, message: 'Access denied. Salon owner role required.' },
        { status: 401 }
      );
    }

    // Connect to database and fetch salon data
    console.log('Connecting to database...');
    const dbConnection = await connectToDatabase();
    console.log('Database connected successfully');
    const db = dbConnection.db;

    // Find salon by email (since salon documents contain user info)
    console.log('Searching for salon with email:', email);
    const salon = await db.collection('salons').findOne({ email: email });
    console.log('Found salon:', salon);
    
    if (!salon) {
      console.log('Salon not found for email:', email);
      return NextResponse.json(
        { success: false, message: 'Salon profile not found' },
        { status: 404 }
      );
    }

    console.log('Returning salon data');
    return NextResponse.json({
      success: true,
      data: salon
    });

  } catch (error) {
    console.error('Salon profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
