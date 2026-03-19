import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Salon from '@/models/Salon';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    // Extract form fields
    const salonName = formData.get('salonName');
    const ownerName = formData.get('ownerName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const location = formData.get('location');
    const password = formData.get('password');
    const services = JSON.parse(formData.get('services') || '[]');
    const offers = JSON.parse(formData.get('offers') || '[]');
    const phoneVerified = formData.get('phoneVerified');
    const gender = formData.get('gender');
    const salonType = formData.get('salonType');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const pincode = formData.get('pincode');
    const serviceName = formData.get('serviceName');
    const price = formData.get('price');
    const contactInfo = formData.get('contactInfo');
    const openingTime = formData.get('openingTime');
    const closingTime = formData.get('closingTime');

    // Handle file uploads
    const images = formData.getAll('images');
    const serviceImages = formData.getAll('serviceImages');
    const galleryImages = formData.getAll('galleryImages');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(path.join(uploadsDir, '.gitkeep'), '');
    } catch (error) {
      // Directory might already exist
    }

    // Process images
    const allImageUrls = [];
    
    // Process service images
    for (const file of serviceImages) {
      if (file && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const filename = `service-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.name)}`;
        const filepath = path.join(uploadsDir, filename);
        
        await writeFile(filepath, buffer);
        allImageUrls.push({
          filename,
          originalName: file.name,
          path: `/uploads/${filename}`,
          size: file.size,
          type: 'service'
        });
      }
    }
    
    // Process gallery images
    for (const file of galleryImages) {
      if (file && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const filename = `gallery-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.name)}`;
        const filepath = path.join(uploadsDir, filename);
        
        await writeFile(filepath, buffer);
        allImageUrls.push({
          filename,
          originalName: file.name,
          path: `/uploads/${filename}`,
          size: file.size,
          type: 'gallery'
        });
      }
    }
    
    // Process main images (if any)
    for (const file of images) {
      if (file && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const filename = `salon-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.name)}`;
        const filepath = path.join(uploadsDir, filename);
        
        await writeFile(filepath, buffer);
        allImageUrls.push({
          filename,
          originalName: file.name,
          path: `/uploads/${filename}`,
          size: file.size,
          type: 'main'
        });
      }
    }

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

    // Create user first
    const newUser = new User({
      email,
      password, // In production, hash this password
      fullName: ownerName,
      phone,
      userType: 'salon',
      location,
      isEmailVerified: false,
      isPhoneVerified: phoneVerified === 'true',
      emailOTP: null,
      phoneOTP: null,
      emailOTPExpires: null,
      phoneOTPExpires: null
    });

    const savedUser = await newUser.save();

    // Create salon linked to user
    const newSalon = new Salon({
      userId: savedUser._id,
      salonName,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      serviceName,
      price: parseFloat(price),
      gender,
      salonType,
      contactInfo,
      openingTime,
      closingTime,
      serviceImages: allImageUrls.filter(img => img.type === 'service').map(img => img.path),
      galleryImages: allImageUrls.filter(img => img.type === 'gallery').map(img => img.path),
      services: services.filter(s => s.name && s.price),
      offers: offers.filter(o => o.title && o.discount),
      images: allImageUrls.filter(img => img.type === 'main'),
      rating: 0,
      totalReviews: 0,
      isActive: true
    });

    const savedSalon = await newSalon.save();
    
    return NextResponse.json({
      success: true,
      message: 'Salon registration submitted successfully!',
      data: {
        user: savedUser,
        salon: savedSalon
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving salon:', error);
    return NextResponse.json({
      success: false,
      message: 'Error submitting salon registration',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const salons = await Salon.find({ isActive: true })
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: salons
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching salons',
      error: error.message
    }, { status: 500 });
  }
}
