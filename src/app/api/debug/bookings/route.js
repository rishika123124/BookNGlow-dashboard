import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET() {
  try {
    console.log('=== DEBUG BOOKINGS API ===');
    
    // Test database connection
    await connectDB();
    console.log('Database connected successfully');
    
    // Test Booking model
    console.log('Booking model:', typeof Booking);
    console.log('Booking model methods:', Object.getOwnPropertyNames(Booking));
    
    // Test simple count
    const count = await Booking.countDocuments();
    console.log('Total bookings count:', count);
    
    // Test find one
    const sampleBooking = await Booking.findOne();
    console.log('Sample booking:', sampleBooking);
    
    // Test find all
    const allBookings = await Booking.find().limit(5);
    console.log('First 5 bookings:', allBookings.length);
    
    return NextResponse.json({
      success: true,
      message: 'Debug successful',
      data: {
        bookingModelType: typeof Booking,
        totalBookings: count,
        sampleBooking: sampleBooking,
        firstFiveBookings: allBookings.map(b => ({
          _id: b._id,
          customerName: b.customerName,
          salonName: b.salonName,
          status: b.status,
          date: b.date,
          time: b.time
        }))
      }
    });
    
  } catch (error) {
    console.error('Debug bookings error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      message: 'Debug failed',
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      }
    }, { status: 500 });
  }
}
