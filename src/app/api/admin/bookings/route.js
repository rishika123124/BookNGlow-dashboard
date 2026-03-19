import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Salon from '@/models/Salon';
import { authenticateAdmin } from '@/lib/admin-auth';

export async function GET(request) {
  try {
    console.log('=== ADMIN BOOKINGS API - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }
    
    console.log('Admin authenticated successfully:', auth.admin.email);
    
    await connectDB();
    console.log('Database connected for bookings');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const salonId = searchParams.get('salonId');
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (salonId) {
      query.salonId = salonId;
    }
    
    console.log('Bookings Query:', query);
    
    // Check if Booking model is available
    console.log('Booking model available:', typeof Booking);
    
    // Fetch bookings with populated salon details (no Customer model)
    let bookings = await Booking.find(query)
      .populate('salonId', 'salonName ownerName email phone address city')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log('Total bookings from database:', bookings.length);
    
    // Log status breakdown
    const statusCounts = {
      pending: bookings.filter(b => b.status === 'pending').length,
      accepted: bookings.filter(b => b.status === 'accepted').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    console.log('Status breakdown:', statusCounts);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = bookings.slice(startIndex, endIndex);
    
    // Format booking data for admin
    const formattedBookings = paginatedBookings.map(booking => ({
      _id: booking._id,
      customerName: booking.customerName || 'Unknown Customer',
      customerEmail: booking.customerEmail || 'No Email',
      customerPhone: booking.customerPhone || 'No Phone',
      salonName: booking.salonName || 'Unknown Salon',
      salonId: booking.salonId,
      serviceName: booking.serviceDetails?.name || 'Unknown Service',
      servicePrice: booking.serviceDetails?.price || booking.price || 0,
      bookingDate: booking.date,
      bookingTime: booking.time,
      totalAmount: booking.serviceDetails?.price || booking.price || 0,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      notes: booking.notes || '',
      specialRequests: booking.specialRequests || ''
    }));

    console.log('Formatted bookings for admin:', formattedBookings.length);

    return NextResponse.json({
      success: true,
      data: formattedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(bookings.length / limit),
        totalBookings: bookings.length,
        hasNext: endIndex < bookings.length,
        hasPrev: page > 1
      },
      stats: statusCounts
    });

  } catch (error) {
    console.error('Admin bookings fetch error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings from database', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('=== ADMIN BOOKING UPDATE - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }
    
    console.log('Admin authenticated successfully:', auth.admin.email);
    
    await connectDB();
    
    const { bookingId, action, reason } = await request.json();
    
    console.log('Booking Update Action:', action);
    console.log('Booking ID:', bookingId);

    // Find booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found in database' },
        { status: 404 }
      );
    }

    let updateData = {};
    let message = '';
    
    switch (action) {
      case 'accept':
        updateData = { 
          status: 'accepted',
          acceptedAt: new Date(),
          acceptedBy: auth.admin.email,
          updatedAt: new Date()
        };
        message = 'Booking accepted successfully';
        break;
      
      case 'reject':
        updateData = { 
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: auth.admin.email,
          rejectionReason: reason || 'Rejected by admin',
          updatedAt: new Date()
        };
        message = 'Booking rejected successfully';
        break;
      
      case 'cancel':
        updateData = { 
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledBy: auth.admin.email,
          cancellationReason: reason || 'Cancelled by admin',
          updatedAt: new Date()
        };
        message = 'Booking cancelled successfully';
        break;
      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update booking in real database
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId, 
      updateData, 
      { new: true }
    );

    console.log('Updated booking in database:', updatedBooking);
    console.log('Update success:', message);

    return NextResponse.json({
      success: true,
      message,
      action,
      data: updatedBooking
    });

  } catch (error) {
    console.error('Admin booking update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update booking in database' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('=== ADMIN BOOKING DELETE - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }
    
    console.log('Admin authenticated successfully:', auth.admin.email);
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Delete booking from database
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    
    if (!deletedBooking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('Deleted booking from database:', deletedBooking);

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
      data: deletedBooking
    });

  } catch (error) {
    console.error('Admin booking delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
