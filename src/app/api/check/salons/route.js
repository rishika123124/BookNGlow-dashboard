import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';

export async function GET() {
  try {
    await connectDB();
    
    const allSalons = await Salon.find({}).lean();
    
    return NextResponse.json({
      success: true,
      message: `Found ${allSalons.length} salons`,
      salons: allSalons.map(s => ({
        _id: s._id,
        salonName: s.salonName,
        gender: s.gender,
        location: s.location,
        hasAddress: !!s.address,
        hasCity: !!s.city,
        hasState: !!s.state,
        hasPincode: !!s.pincode,
        hasSalonType: !!s.salonType,
        hasIsPremium: !!s.isPremium,
        isActive: s.isActive
      }))
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error checking salons',
      error: error.message
    }, { status: 500 });
  }
}
