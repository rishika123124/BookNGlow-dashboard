import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Salon from '@/models/Salon';

export async function DELETE(request) {
  try {
    console.log('=== CLEANUP TEST DATA ===');
    
    await connectDB();
    console.log('Database connected for cleanup');

    let deletedBookings = 0;
    
    // Delete bookings with undefined or test-like customer names
    const undefinedBookings = await Booking.find({
      $or: [
        { customerName: { $in: [undefined, null, '', 'Unknown Customer', 'undefined'] } },
        { customerEmail: { $in: [undefined, null, '', 'No Email', 'undefined'] } },
        { salonName: { $in: [undefined, null, '', 'Unknown Salon', 'undefined'] } },
        { customerPhone: { $in: [undefined, null, '', 'No Phone', 'undefined'] } }
      ]
    });

    console.log(`Found ${undefinedBookings.length} bookings with undefined/test data`);

    for (const booking of undefinedBookings) {
      await Booking.findByIdAndDelete(booking._id);
      deletedBookings++;
      console.log(`Deleted booking: ${booking.customerName || 'undefined'} - ${booking.salonName || 'undefined'}`);
    }

    // Also delete bookings with test patterns
    const testBookingPatterns = [
      /test/i,
      /dummy/i,
      /sample/i,
      /demo/i,
      /mock/i,
      /example/i,
      /test@/i,
      /dummy@/i,
      /sample@/i,
      /demo@/i,
      /example@/i
    ];

    for (const pattern of testBookingPatterns) {
      const bookingsToDelete = await Booking.find({
        $or: [
          { customerName: { $regex: pattern } },
          { customerEmail: { $regex: pattern } },
          { salonName: { $regex: pattern } },
          { notes: { $regex: pattern } },
          { specialRequests: { $regex: pattern } }
        ]
      });
      
      if (bookingsToDelete.length > 0) {
        console.log(`Found ${bookingsToDelete.length} bookings matching pattern: ${pattern}`);
        
        for (const booking of bookingsToDelete) {
          await Booking.findByIdAndDelete(booking._id);
          deletedBookings++;
          console.log(`Deleted booking: ${booking.customerName} - ${booking.salonName}`);
        }
      }
    }

    // Clean up test salons too
    let deletedSalons = 0;
    const testSalonPatterns = [
      /test/i,
      /dummy/i,
      /sample/i,
      /demo/i,
      /mock/i,
      /example/i
    ];

    for (const pattern of testSalonPatterns) {
      const salonsToDelete = await Salon.find({
        $or: [
          { salonName: { $regex: pattern } },
          { ownerName: { $regex: pattern } },
          { email: { $regex: pattern } },
          { description: { $regex: pattern } }
        ]
      });
      
      if (salonsToDelete.length > 0) {
        console.log(`Found ${salonsToDelete.length} salons matching pattern: ${pattern}`);
        
        for (const salon of salonsToDelete) {
          await Salon.findByIdAndDelete(salon._id);
          deletedSalons++;
          console.log(`Deleted salon: ${salon.salonName} - ${salon.email}`);
        }
      }
    }

    console.log('=== CLEANUP COMPLETE ===');
    console.log(`Total bookings deleted: ${deletedBookings}`);
    console.log(`Total salons deleted: ${deletedSalons}`);

    return NextResponse.json({
      success: true,
      message: 'Test data cleanup completed',
      data: {
        deletedBookings,
        deletedSalons,
        remainingBookings: await Booking.countDocuments(),
        remainingSalons: await Salon.countDocuments()
      }
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup test data' },
      { status: 500 }
    );
  }
}
