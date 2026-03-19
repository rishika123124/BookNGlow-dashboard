import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';
import Booking from '@/models/Booking';

export async function GET(request) {
  try {
    console.log('=== ADMIN STATS API - REAL DATABASE ===');
    
    await connectDB();
    console.log('Database connected for stats');

    // Get real statistics from database
    const [
      totalSalons,
      pendingSalons,
      approvedSalons,
      rejectedSalons,
      activeSalons,
      premiumSalons,
      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings
    ] = await Promise.all([
      Salon.countDocuments(),
      Salon.countDocuments({ status: 'pending' }),
      Salon.countDocuments({ status: 'approved' }),
      Salon.countDocuments({ status: 'rejected' }),
      Salon.countDocuments({ isActive: true }),
      Salon.countDocuments({ isPremium: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'accepted' }),
      Booking.countDocuments({ status: 'rejected' })
    ]);

    const realStats = {
      totalUsers: 0, // Will be implemented when User model is ready
      totalSalons,
      totalBookings,
      totalPremiumSalons: premiumSalons,
      pendingSalons,
      approvedSalons,
      rejectedSalons,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      totalSupportMessages: 0, // Will be implemented when Support model is ready
      pendingSupportMessages: 0
    };

    console.log('=== REAL DATABASE STATS ===');
    console.log('Total Salons:', totalSalons);
    console.log('Pending Salons:', pendingSalons);
    console.log('Approved Salons:', approvedSalons);
    console.log('Rejected Salons:', rejectedSalons);
    console.log('Premium Salons:', premiumSalons);
    console.log('Total Bookings:', totalBookings);
    console.log('Pending Bookings:', pendingBookings);
    console.log('Accepted Bookings:', acceptedBookings);
    console.log('Rejected Bookings:', rejectedBookings);

    return NextResponse.json({
      success: true,
      data: realStats
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics from database' },
      { status: 500 }
    );
  }
}
