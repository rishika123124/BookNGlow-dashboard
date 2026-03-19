import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Salon from '@/models/Salon';

export async function GET(request) {
  try {
    console.log('=== DATABASE DEBUG ===');
    
    await connectDB();
    console.log('Database connected');

    // Check all bookings
    const allBookings = await Booking.find().limit(10);
    console.log(`Total bookings: ${await Booking.countDocuments()}`);
    
    // Check all salons
    const allSalons = await Salon.find().limit(10);
    console.log(`Total salons: ${await Salon.countDocuments()}`);

    // Show sample data
    const bookingSample = allBookings.map(b => ({
      _id: b._id,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      salonName: b.salonName,
      status: b.status,
      price: b.price,
      date: b.date,
      time: b.time
    }));

    const salonSample = allSalons.map(s => ({
      _id: s._id,
      salonName: s.salonName,
      ownerName: s.ownerName,
      email: s.email,
      status: s.status,
      isPremium: s.isPremium
    }));

    console.log('Booking Sample:', bookingSample);
    console.log('Salon Sample:', salonSample);

    return NextResponse.json({
      success: true,
      message: 'Database debug complete',
      data: {
        totalBookings: await Booking.countDocuments(),
        totalSalons: await Salon.countDocuments(),
        bookingSample,
        salonSample
      }
    });

  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to debug database' },
      { status: 500 }
    );
  }
}
