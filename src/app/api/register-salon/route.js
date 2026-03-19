import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const pincode = formData.get('pincode');
    const serviceName = formData.get('serviceName');
    const price = formData.get('price');
    let offers = formData.get('offers');
    const phoneVerified = formData.get('phoneVerified');
    const gender = formData.get('gender');
    const salonType = formData.get('salonType');
    const contactInfo = formData.get('contactInfo');
    const openingTime = formData.get('openingTime');
    const closingTime = formData.get('closingTime');

    // Handle offers field - convert to array if needed
    let offersArray = [];
    if (offers && offers.trim() !== '') {
      if (offers.startsWith('[') && offers.endsWith(']')) {
        try {
          offersArray = JSON.parse(offers);
          if (!Array.isArray(offersArray)) {
            offersArray = [offers];
          }
        } catch (e) {
          offersArray = offers.split(',').map(o => o.trim()).filter(o => o);
        }
      } else {
        offersArray = offers.split(',').map(o => o.trim()).filter(o => o);
      }
    }

    console.log('=== SALON REGISTRATION DEBUG ===');
    console.log('Salon Name:', salonName);
    console.log('Gender:', gender);
    console.log('Salon Type:', salonType);
    console.log('Is Premium:', salonType === 'premium');
    console.log('Offers:', offersArray);
    console.log('Offers Type:', Array.isArray(offersArray));
    console.log('All Form Data:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value} (${typeof value})`);
    }

    // Validate required fields
    const requiredFields = ['salonName', 'ownerName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'serviceName', 'price', 'contactInfo', 'openingTime', 'closingTime', 'gender', 'salonType'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields: missingFields
      }, { status: 400 });
    }

    // Validate gender enum
    if (!['male', 'female', 'unisex'].includes(gender)) {
      console.error('Invalid gender value:', gender);
      return NextResponse.json({
        success: false,
        message: `Invalid gender value: ${gender}. Must be male, female, or unisex`
      }, { status: 400 });
    }

    // Validate salonType enum
    if (!['male', 'female', 'unisex', 'premium'].includes(salonType)) {
      console.error('Invalid salonType value:', salonType);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      console.error('Invalid phone format:', phone);
      return NextResponse.json({
        success: false,
        message: 'Invalid phone number format'
      }, { status: 400 });
    }

    // Validate pincode format
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      console.error('Invalid pincode format:', pincode);
    }

    // Handle file uploads
    const serviceImages = formData.getAll('serviceImages');
    const galleryImages = formData.getAll('galleryImages');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(path.join(uploadsDir, '.gitkeep'), '');
    } catch (error) {
      console.log('Uploads directory created or already exists');
    }

    // Create salon with pending status for admin approval
    const newSalon = new Salon({
      salonName,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      services: [{
        name: serviceName,
        price: parseFloat(price)
      }],
      offers: offersArray,
      phoneVerified: phoneVerified === 'true',
      gender,
      salonType,
      contactInfo,
      openingTime,
      closingTime,
      status: 'pending', // Admin approval required
      isActive: false, // Inactive until approved
      isPremium: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save to real database
    const savedSalon = await newSalon.save();
    
    console.log('=== SALON SAVED TO DATABASE ===');
    console.log('Salon Name:', savedSalon.salonName);
    console.log('Status:', savedSalon.status);
    console.log('Database ID:', savedSalon._id);
    console.log('Total Pending Salons in DB:', await Salon.countDocuments({status: 'pending'}));
    
    return NextResponse.json({
      success: true,
      message: 'Salon registration submitted successfully! Awaiting admin approval.',
      data: savedSalon
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving salon to database:', error);
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
    const salons = await Salon.find().sort({ createdAt: -1 });
    
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
