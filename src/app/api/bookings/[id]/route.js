import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'bson';

// Helper function to verify JWT and get user info
async function authenticateRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401 };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  return { authenticatedUser: decoded };
}

// PUT /api/bookings/[id] - Update booking status (cancel/confirm)
export async function PUT(request, { params }) {
  try {
    console.log(`PUT /api/bookings/${params.id} - Starting booking update`);
    
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { authenticatedUser } = auth;
    console.log('User authenticated:', { id: authenticatedUser.id, role: authenticatedUser.role });

    // Parse request body
    const body = await request.json();
    const { status } = body;

    console.log('Booking update request:', { bookingId: params.id, status, userRole: authenticatedUser.role });

    // Validate status
    if (!['pending', 'confirmed', 'cancelled', 'rejected'].includes(status)) {
      console.log('Invalid status:', status);
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be pending, confirmed, cancelled, or rejected' },
        { status: 400 }
      );
    }

    // Connect to database
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    // Find booking
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(params.id) });
    
    if (!booking) {
      console.log('Booking not found:', params.id);
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('Found booking:', { id: booking._id, status: booking.status });

    // CANCELLATION POLICY: Special handling for cancellation requests
    if (status === 'cancelled') {
      // Allow both customers and salon owners to cancel, but with different rules
      if (authenticatedUser.role !== 'customer' && authenticatedUser.role !== 'salon') {
        console.log('Access denied: Non-authorized user trying to cancel booking');
        return NextResponse.json(
          { success: false, message: 'Access denied. Only customers and salon owners can cancel bookings.' },
          { status: 403 }
        );
      }

      // For testing, allow salon to cancel their own bookings
      if (authenticatedUser.role === 'salon') {
        if (booking.salonId.toString() !== authenticatedUser.id) {
          console.log('Access denied: Salon trying to cancel booking for different salon');
          return NextResponse.json(
            { success: false, message: 'Access denied. You can only cancel bookings for your own salon.' },
            { status: 403 }
          );
        }
      }

      // Check current status - only allow cancellation of 'confirmed' or 'pending' bookings
      if (!['confirmed', 'pending'].includes(booking.status)) {
        console.log('Cannot cancel booking with status:', booking.status);
        return NextResponse.json(
          { success: false, message: `Cannot cancel booking with status '${booking.status}'. Only confirmed or pending bookings can be cancelled.` },
          { status: 400 }
        );
      }
    }

    // Update booking status
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log('No booking matched for update');
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('Booking updated successfully');

    return NextResponse.json({
      success: true,
      data: {
        message: `Booking ${status} successfully`,
        status: status,
        bookingId: params.id
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete booking
export async function DELETE(request, { params }) {
  try {
    console.log(`DELETE /api/bookings/${params.id} - Starting booking deletion`);
    
    // Authenticate request
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { authenticatedUser } = auth;

    // Connect to database
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    // Find and delete booking
    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(params.id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Booking deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
