import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';
import { generateToken, setAuthCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('=== REGISTRATION DEBUG ===');
    console.log('Received body:', body);
    const {
      name,
      salonName,
      email,
      password,
      phone,
      location,
      salonImage,
      openingTime,
      closingTime,
      contactInfo,
      gender,
      services,
      offers
    } = body;

    console.log('=== EXTRACTED FIELDS ===');
    console.log('salonImage:', salonImage ? 'Present' : 'Missing');
    console.log('salonImage length:', salonImage ? salonImage.length : 0);

    // Validate required fields
    if (!salonName || !email || !password || !phone || !location || !gender) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Check if salon already exists
    const existingSalon = await Salon.findOne({ email });
    if (existingSalon) {
      return NextResponse.json(
        { success: false, message: 'Salon with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new salon
    console.log('=== CREATING SALON ===');
    console.log('salonImage being saved:', salonImage ? 'Present' : 'Missing');
    
    const newSalon = new Salon({
      ownerName: name,
      salonName,
      email,
      password: hashedPassword,
      phone,
      location,
      gender,
      contactInfo,
      openingTime,
      closingTime,
      services: services || [],
      offers: offers || [],
      serviceImages: salonImage ? [salonImage] : [], // Store main image in serviceImages array
      galleryImages: [],
      phoneVerified: true
    });

    console.log('Salon object created, saving to database...');

    const savedSalon = await newSalon.save();
    
    console.log('=== SAVED SALON DEBUG ===');
    console.log('Saved salon salonImage:', savedSalon.salonImage ? 'Present' : 'Missing');
    console.log('Saved salon salonImage length:', savedSalon.salonImage ? savedSalon.salonImage.length : 0);
    console.log('Saved salon object keys:', Object.keys(savedSalon.toObject()));

    return NextResponse.json({
      success: true,
      message: 'Salon registered successfully!',
      data: savedSalon
    });

  } catch (error) {
    console.error('Salon registration error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validationErrors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
