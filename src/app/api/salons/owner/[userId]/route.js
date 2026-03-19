import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { userId } = params;

    // Find user first to verify they exist and are a salon owner
    const user = await User.findById(userId);
    if (!user || user.userType !== 'salon') {
      return NextResponse.json({
        success: false,
        message: 'User not found or not a salon owner'
      }, { status: 404 });
    }

    // Find salon data for this user
    const salon = await Salon.findOne({ userId: userId });
    
    if (!salon) {
      return NextResponse.json({
        success: false,
        message: 'Salon not found for this user'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: salon._id,
        salonName: salon.salonName,
        phone: salon.phone,
        location: salon.location,
        rating: salon.rating || '5.0',
        services: salon.services || [],
        offers: salon.offers || [],
        images: salon.images || [],
        createdAt: salon.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching salon by owner:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch salon data',
      error: error.message
    }, { status: 500 });
  }
}
