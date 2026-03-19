import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Salon from '@/models/Salon';

export async function POST(request) {
  try {
    await connectDB();
    
    const { userId } = await request.json();
    
    // Find user
    const user = await User.findById(userId);
    if (!user || user.userType !== 'salon') {
      return NextResponse.json({
        success: false,
        message: 'User not found or not a salon owner'
      }, { status: 404 });
    }
    
    // Check if salon already exists
    const existingSalon = await Salon.findOne({ userId: userId });
    if (existingSalon) {
      return NextResponse.json({
        success: false,
        message: 'Salon already exists for this user'
      }, { status: 400 });
    }
    
    // Create salon data
    const newSalon = new Salon({
      userId: user._id,
      ownerName: user.fullName,
      salonName: user.fullName + "'s Salon",
      location: user.location || 'Dehradun',
      phone: user.phone,
      services: [
        { name: 'Haircut', price: 499, duration: '30 mins', description: 'Professional haircut' },
        { name: 'Beard Trim', price: 299, duration: '15 mins', description: 'Beard styling' }
      ],
      offers: [],
      images: ["https://picsum.photos/seed/salon-default/600/400"],
      rating: '5.0'
    });
    
    await newSalon.save();
    
    return NextResponse.json({
      success: true,
      message: 'Salon data created successfully',
      data: {
        id: newSalon._id,
        salonName: newSalon.salonName,
        phone: newSalon.phone,
        location: newSalon.location,
        rating: newSalon.rating,
        services: newSalon.services,
        offers: newSalon.offers,
        images: newSalon.images
      }
    });
    
  } catch (error) {
    console.error('Create missing salon error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create salon data',
      error: error.message
    }, { status: 500 });
  }
}
