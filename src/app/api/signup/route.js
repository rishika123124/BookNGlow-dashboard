import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Salon from '@/models/Salon';

export async function POST(request) {
  try {
    await connectDB();
    const { 
      email, 
      password, 
      fullName, 
      phone, 
      userType, 
      location,
      image,
      // Salon specific fields
      salonName,
      salonType,
      services,
      offers,
      images
    } = await request.json();

    console.log("Received signup data:", {
      email,
      fullName,
      userType,
      imageLength: image ? image.length : 0,
      imagePreview: image ? image.substring(0, 50) + '...' : 'NO IMAGE',
      imagesCount: images ? images.length : 0
    });

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email or phone already exists'
      }, { status: 400 });
    }

    // Create new user
    const newUser = new User({
      email,
      password, // In production, hash this with bcrypt
      fullName,
      phone,
      userType,
      location,
      image,
      ...(userType === 'salon' && {
        salonType,
        services
      }),
      isEmailVerified: false,
      isPhoneVerified: false
    });

    await newUser.save();
    
    console.log("User saved to database:", {
      id: newUser._id,
      email: newUser.email,
      imageLength: newUser.image ? newUser.image.length : 0,
      imagePreview: newUser.image ? newUser.image.substring(0, 50) + '...' : 'NO IMAGE'
    });

    // If salon owner, create salon profile
    if (userType === 'salon') {
      const newSalon = new Salon({
        userId: newUser._id,
        ownerName: fullName,
        salonName,
        location,
        phone,
        services: services || [],
        offers: offers || [],
        images: images || []
      });

      await newSalon.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        userType: newUser.userType,
        location: newUser.location
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create account',
      error: error.message
    }, { status: 500 });
  }
}
