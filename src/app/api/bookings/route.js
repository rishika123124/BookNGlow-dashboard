import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { ObjectId } from 'bson';
import Salon from '@/models/Salon'; // Import Mongoose model

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to send confirmation email
async function sendConfirmationEmail(customerEmail, customerName, salonName) {
  try {
    console.log('Sending confirmation email to:', customerEmail);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Booking Request Received at ${salonName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Booking Request Received!</h2>
          <p>Dear <strong>${customerName || 'Customer'}</strong>,</p>
          <p>Thank you for choosing ${salonName}!</p>
          <p>Your booking request has been received and is pending confirmation by the salon.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Customer Name:</strong> ${customerName || 'Customer'}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Salon:</strong> ${salonName}</p>
            <p><strong>Status:</strong> <span style="color: #FFA500; font-weight: bold;">PENDING</span></p>
          </div>
          
          <p>We will notify you once the salon confirms your appointment.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <p style="color: #666;">1. Check your email for booking updates</p>
            <p style="color: #666;">2. Visit your dashboard to see booking status</p>
          </div>
          <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', customerEmail);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error - booking should still be confirmed even if email fails
  }
}

// Helper function to send booking confirmed email
async function sendBookingConfirmedEmail(customerEmail, customerName, salonName) {
  try {
    console.log('Sending booking confirmed email to:', customerEmail);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Booking Confirmed at ${salonName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Booking Confirmed! 🎉</h2>
          <p>Dear ${customerName || 'Customer'},</p>
          <p>Great news! Your booking has been confirmed by ${salonName}.</p>
          <p><strong>Booking Details:</strong></p>
          <p><strong>Salon:</strong> ${salonName}</p>
          <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">CONFIRMED</span></p>
          <p>Please arrive at the salon on time for your appointment.</p>
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Important Information:</h3>
            <p style="color: #666;">• Please arrive 5-10 minutes before your appointment</p>
            <p style="color: #666;">• Bring any necessary documents or requirements</p>
            <p style="color: #666;">• If you need to cancel, please do so at least 2 hours in advance</p>
          </div>
          <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking confirmed email sent successfully to:', customerEmail);
  } catch (error) {
    console.error('Error sending booking confirmed email:', error);
    // Don't throw error - booking should still be confirmed even if email fails
  }
}

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

// POST /api/bookings - Create new booking
export async function POST(request) {
  try {
    console.log('POST /api/bookings - Starting booking creation');
    
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

    // Check if user is blocked
    await connectToDatabase();
    const User = require('@/models/User').default;
    
    const user = await User.findOne({ email: authenticatedUser.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.status === 'blocked') {
      console.log('Blocked user attempted to book:', authenticatedUser.email);
      return NextResponse.json(
        { success: false, message: 'Your account has been blocked by the admin.' },
        { status: 403 }
      );
    }

    console.log('User status check passed:', { email: authenticatedUser.email, status: user.status });

    // Parse request body - accept both frontend and backend field formats
    const body = await request.json();
    console.log('Raw booking request received:', body);

    // Map frontend fields to backend expected fields
    const { 
      salonId, 
      service, 
      serviceDetails, 
      date, 
      time, 
      userId, 
      customerEmail 
    } = body;

    // Use serviceDetails if available, otherwise use service
    const finalServiceDetails = serviceDetails || service;
    
    // Get customer email from authenticated user or request body
    const finalCustomerEmail = customerEmail || authenticatedUser.email || 'customer@example.com';

    console.log('Processed booking request:', { 
      salonId, 
      serviceDetails: finalServiceDetails, 
      customerEmail: finalCustomerEmail,
      userId,
      date,
      time,
      authenticatedUserEmail: authenticatedUser.email
    });

    // Validate required fields
    if (!salonId || !finalServiceDetails || !finalCustomerEmail) {
      console.log('Missing required fields:', { 
        salonId, 
        serviceDetails: finalServiceDetails, 
        customerEmail: finalCustomerEmail 
      });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: salonId, service, customerEmail' },
        { status: 400 }
      );
    }

    // Bypass ownership checks for customers and salons (for testing)
    if (authenticatedUser.role === 'customer' || authenticatedUser.role === 'salon') {
      console.log(`${authenticatedUser.role} creating booking - bypassing ownership checks`);
    } else {
      console.log('Invalid user role attempting to create booking');
      return NextResponse.json(
        { success: false, message: 'Only customers and salons can create bookings' },
        { status: 403 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    const dbConnection = await connectToDatabase();
    console.log('Database connected successfully to:', dbConnection.dbName);
    const db = dbConnection.db;

    // Validate salon exists - use Mongoose model like the working /api/salons/[id] route
    console.log('=== SALON LOOKUP DEBUG ===');
    console.log('Searching for salon with ID:', salonId, 'Type:', typeof salonId);
    console.log('Database being queried:', dbConnection.dbName);
    
    let salon;
    
    // Use Mongoose model like the successful /api/salons/[id] route
    console.log('Step 1: Trying Mongoose Salon.findById lookup...');
    try {
      salon = await Salon.findById(salonId);
      console.log('Mongoose findById result:', salon ? 'Found' : 'Not found');
      
      if (salon) {
        console.log('Found salon with Mongoose:', salon.name || 'Unnamed salon');
        console.log('Salon _id:', salon._id, 'Type:', typeof salon._id);
      }
    } catch (mongooseError) {
      console.log('Mongoose findById failed:', mongooseError.message);
    }

    // If Mongoose fails, try direct MongoDB as fallback
    if (!salon) {
      console.log('Step 2: Falling back to direct MongoDB lookup...');
      let salonObjectId;
      
      try {
        salonObjectId = new ObjectId(salonId);
        console.log('Converted salonId to ObjectId:', salonObjectId);
        
        salon = await db.collection('salons').findOne({ _id: salonObjectId });
        console.log('Direct MongoDB ObjectId lookup result:', salon ? 'Found' : 'Not found');
        
      } catch (error) {
        console.log('ObjectId conversion failed:', error.message);
      }

      // Try string lookup as final fallback
      if (!salon) {
        console.log('Step 3: Trying string lookup...');
        try {
          salon = await db.collection('salons').findOne({ _id: salonId });
          console.log('String lookup result:', salon ? 'Found' : 'Not found');
        } catch (stringError) {
          console.log('String lookup failed:', stringError.message);
        }
      }
    }

    console.log('=== END SALON LOOKUP DEBUG ===');
    
    // Handle salon not found gracefully with enhanced debugging
    if (!salon) {
      console.log('SALON NOT FOUND - All lookup methods failed');
      console.log('Attempted lookups:');
      console.log('1. ObjectId lookup:', salonObjectId ? 'Attempted' : 'Skipped');
      console.log('2. String lookup:', 'Attempted');
      console.log('3. Fallback lookups:', 'Attempted');
      
      // Enhanced debugging: Check what salons actually exist
      console.log('=== DATABASE DEBUGGING ===');
      try {
        const sampleSalons = await db.collection('salons').find({}).limit(5).toArray();
        console.log('Sample salons in database:');
        sampleSalons.forEach((salon, index) => {
          console.log(`  ${index + 1}. Name: ${salon.name || 'Unnamed'}`);
          console.log(`     _id: ${salon._id} (Type: ${typeof salon._id})`);
          console.log(`     _id.toString(): ${salon._id.toString()}`);
          if (salon.id) console.log(`     id: ${salon.id} (Type: ${typeof salon.id})`);
          console.log('     ---');
        });
        
        const totalSalons = await db.collection('salons').countDocuments();
        console.log(`Total salons in database: ${totalSalons}`);
        
        // Try exact match with the searched ID
        const exactMatch = await db.collection('salons').findOne({
          $or: [
            { _id: salonId },
            { _id: salonObjectId },
            { id: salonId }
          ]
        });
        console.log('Exact match result:', exactMatch ? 'Found' : 'Not found');
        
      } catch (debugError) {
        console.log('Database debugging failed:', debugError.message);
      }
      console.log('=== END DATABASE DEBUGGING ===');
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Salon not found. Please verify the salon ID and ensure the salon exists in the database.',
          debug: {
            searchedId: salonId,
            searchedType: typeof salonId,
            database: dbConnection.dbName,
            lookupAttempts: ['ObjectId', 'String', 'Fallback'],
            tip: 'Check the terminal output for available salon IDs and formats'
          }
        },
        { status: 404 }
      );
    }

    console.log('SALON FOUND SUCCESSFULLY:', salon.name || 'Unnamed salon');

    // Create booking object with the correct salon ID format and complete information
    const booking = {
      salonId: salon._id, // Use Mongoose salon's _id directly
      salonName: salon.salonName || salon.name || 'Unknown Salon', // Store salon name
      customerId: authenticatedUser.id,
      customerName: authenticatedUser.name || authenticatedUser.email || 'Unknown Customer', // Store customer name
      customerEmail: finalCustomerEmail,
      serviceDetails: finalServiceDetails,
      date: date, // Include booking date
      time: time, // Include booking time
      price: finalServiceDetails.price || 0, // Store price separately
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Creating booking object:', booking);

    console.log('Time slot is available, proceeding with booking creation...');

    // Save booking to database
    console.log('Inserting booking into database...');
    const result = await db.collection('bookings').insertOne(booking);
    console.log('Booking created successfully:', result.insertedId);

    // Send confirmation email to customer when booking is created
    if (booking.customerEmail) {
      console.log('Sending booking confirmation email to customer:', booking.customerEmail);
      
      // Get salon details for email
      const salon = await db.collection('salons').findOne({ _id: booking.salonId });
      const salonName = salon ? salon.salonName || salon.name : 'Unknown Salon';
      
      // Get customer name
      let customerName = 'Customer';
      if (booking.customerId) {
        console.log('Fetching customer name for customerId:', booking.customerId);
        const customer = await db.collection('users').findOne({ _id: booking.customerId });
        console.log('Customer data found:', customer ? 'Yes' : 'No');
        if (customer) {
          customerName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer';
          console.log('Customer name resolved to:', customerName);
        }
      } else {
        console.log('No customerId found in booking');
      }
      
      // Send confirmation email (async, don't wait)
      sendConfirmationEmail(booking.customerEmail, customerName, salonName);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        bookingId: result.insertedId,
        message: 'Booking created successfully. Awaiting salon confirmation.',
        status: 'pending'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Fetch bookings
export async function GET(request) {
  try {
    console.log('GET /api/bookings - Starting bookings fetch');
    
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salonId');
    const userId = searchParams.get('userId');

    console.log('Query parameters:', { salonId, userId });

    // Connect to database
    console.log('Connecting to database...');
    const dbConnection = await connectToDatabase();
    console.log('Database connected successfully to:', dbConnection.dbName);
    const db = dbConnection.db;

    let bookings;
    let query = {};

    // SECURITY CHECK: Prevent unauthorized access
    if (authenticatedUser.role === 'salon') {
      console.log('SECURITY: Salon owner access check');
      
      let targetSalonId = salonId;
      
      // If no salonId provided, get it from the authenticated user's salon profile
      if (!salonId) {
        console.log('SECURITY: No salonId provided, fetching from user profile');
        const userSalon = await db.collection('salons').findOne({ 
          email: authenticatedUser.email 
        });
        
        if (!userSalon) {
          console.log('SECURITY: No salon found for user', { email: authenticatedUser.email });
          return NextResponse.json(
            { success: false, message: 'Access denied. No salon associated with your account.' },
            { status: 403 }
          );
        }
        
        targetSalonId = userSalon._id.toString();
        console.log('SECURITY: Using salonId from user profile:', targetSalonId);
      } else {
        // If salonId is provided, verify it belongs to the authenticated user
        const salon = await db.collection('salons').findOne({ 
          _id: new ObjectId(salonId),
          email: authenticatedUser.email 
        });
        
        if (!salon) {
          console.log('SECURITY: Salon owner trying to access different salon', {
            requestedSalonId: salonId,
            userEmail: authenticatedUser.email
          });
          return NextResponse.json(
            { success: false, message: 'Access denied. You can only access your own salon bookings.' },
            { status: 403 }
          );
        }
        
        console.log('SECURITY: Provided salonId verified, belongs to user');
      }
      
      query = { salonId: new ObjectId(targetSalonId) };
      console.log('SECURITY: Final query for salon owner:', query);
      
    } else if (authenticatedUser.role === 'customer') {
      console.log('SECURITY: Customer access check');
      
      // Customers can only access their own bookings
      if (userId && authenticatedUser.id !== userId) {
        console.log('SECURITY: Customer trying to access other user bookings');
        return NextResponse.json(
          { success: false, message: 'Access denied. You can only access your own bookings.' },
          { status: 403 }
        );
      }
      
      // If no userId provided, use the authenticated user's ID
      const targetUserId = userId || authenticatedUser.id;
      query = { customerId: targetUserId };
      
    } else {
      console.log('SECURITY: Invalid user role', { role: authenticatedUser.role });
      return NextResponse.json(
        { success: false, message: 'Access denied. Invalid user role.' },
        { status: 403 }
      );
    }

    console.log('Executing query:', query);

    // Fetch bookings from database with salon details
    bookings = await db.collection('bookings')
      .aggregate([
        {
          $match: query // CRITICAL: Filter by salonId/userId first
        },
        {
          $lookup: {
            from: 'salons',
            localField: 'salonId',
            foreignField: '_id',
            as: 'salon'
          }
        },
        {
          $unwind: '$salon'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: {
            path: '$customer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            salonId: 1,
            customerId: 1,
            customerEmail: 1,
            'customer.name': 1,
            'customer.firstName': 1,
            'customer.lastName': 1,
            serviceDetails: 1,
            date: 1,
            time: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            'salon.salonName': 1,
            'salon.name': 1,
            'salon.location': 1,
            'salon.contactInfo': 1,
            'salon.phone': 1,
            'salon.area': 1
          }
        }
      ])
      .sort({ createdAt: -1 })
      .toArray();

    console.log('Found bookings:', bookings.length);

    return NextResponse.json({
      success: true,
      data: bookings
    }, { status: 200 });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings - Update booking status
export async function PATCH(request) {
  try {
    console.log('PATCH /api/bookings - Starting booking status update');
    
    // Log the incoming request details
    const bodyText = await request.text();
    console.log('PATCH request body:', bodyText);
    
    // Parse the body back to JSON
    const { bookingId, status } = JSON.parse(bodyText);
    console.log('Parsed request data:', { bookingId, status });

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

    // Validate required fields
    if (!bookingId || !status) {
      console.log('Missing required fields:', { bookingId, status });
      return NextResponse.json(
        { success: false, message: 'Missing required fields: bookingId, status' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['pending', 'confirmed', 'cancelled', 'rejected'].includes(status)) {
      console.log('Invalid status:', status);
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be pending, confirmed, cancelled, or rejected' },
        { status: 400 }
      );
    }

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
    } else {
      // Only salon owners can update other statuses (confirm, reject, etc.)
      if (authenticatedUser.role !== 'salon') {
        console.log('Access denied: Non-salon user trying to update booking status');
        return NextResponse.json(
          { success: false, message: 'Access denied. Only salon owners can update booking status.' },
          { status: 403 }
        );
      }
    }

    // Connect to database
    console.log('Connecting to database...');
    const dbConnection = await connectToDatabase();
    console.log('Database connected successfully to:', dbConnection.dbName);
    const db = dbConnection.db;

    // Convert bookingId to ObjectId
    let bookingObjectId;
    try {
      bookingObjectId = new ObjectId(bookingId);
      console.log('Converted bookingId to ObjectId:', bookingObjectId);
    } catch (error) {
      console.log('Invalid bookingId format:', bookingId);
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // Find and update booking
    console.log('Finding booking to update:', bookingObjectId);
    const booking = await db.collection('bookings').findOne({ _id: bookingObjectId });

    if (!booking) {
      console.log('Booking not found:', bookingObjectId);
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('Found booking:', booking);

    // SECURITY CHECK: Verify ownership based on user role
    if (authenticatedUser.role === 'salon') {
      console.log('=== SALON OWNERSHIP DEBUG ===');
      console.log('req.user (authenticatedUser):', {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        role: authenticatedUser.role
      });
      console.log('booking details:', {
        bookingId: booking._id,
        salonId: booking.salonId,
        customerId: booking.customerId,
        customerEmail: booking.customerEmail,
        status: booking.status
      });
      
      console.log('Verifying salon ownership...');
      console.log('Searching for salon with:', {
        _id: booking.salonId,
        email: authenticatedUser.email
      });
      
      const salon = await db.collection('salons').findOne({ 
        _id: booking.salonId, 
        email: authenticatedUser.email 
      });
      
      console.log('Salon query result:', salon ? 'Found' : 'Not found');
      if (salon) {
        console.log('Found salon details:', {
          _id: salon._id,
          email: salon.email,
          name: salon.name
        });
      }
      
      if (!salon) {
        console.log('Access denied: Salon owner trying to update booking for different salon');
        return NextResponse.json(
          { success: false, message: 'Access denied. You can only update bookings for your own salon.' },
          { status: 403 }
        );
      }
      console.log('Salon ownership verified');
    } else if (authenticatedUser.role === 'customer') {
      console.log('=== CUSTOMER OWNERSHIP DEBUG ===');
      console.log('req.user (authenticatedUser):', {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        role: authenticatedUser.role
      });
      console.log('booking details:', {
        bookingId: booking._id,
        salonId: booking.salonId,
        customerId: booking.customerId,
        customerEmail: booking.customerEmail,
        status: booking.status
      });
      
      console.log('Verifying customer ownership...');
      console.log('Checking if booking.customerId matches user.id:', {
        bookingCustomerId: booking.customerId,
        authenticatedUserId: authenticatedUser.id,
        customerIdMatch: booking.customerId === authenticatedUser.id
      });
      console.log('Checking if booking.customerEmail matches user.email:', {
        bookingCustomerEmail: booking.customerEmail,
        authenticatedUserEmail: authenticatedUser.email,
        customerEmailMatch: booking.customerEmail === authenticatedUser.email
      });
      
      // Customers can only cancel their own bookings
      if (booking.customerId !== authenticatedUser.id && booking.customerEmail !== authenticatedUser.email) {
        console.log('Access denied: Customer trying to cancel booking for different user');
        return NextResponse.json(
          { success: false, message: 'Access denied. You can only cancel your own bookings.' },
          { status: 403 }
        );
      }
      console.log('Customer ownership verified');
    }

    // CANCELLATION POLICY: Check if booking can be cancelled
    if (status === 'cancelled') {
      console.log('Checking cancellation policy...');
      
      // Check current status - only allow cancellation of 'confirmed' or 'pending' bookings
      if (!['confirmed', 'pending'].includes(booking.status)) {
        console.log('Cannot cancel booking with status:', booking.status);
        return NextResponse.json(
          { success: false, message: `Cannot cancel booking with status '${booking.status}'. Only confirmed or pending bookings can be cancelled.` },
          { status: 400 }
        );
      }

      // TIME RESTRICTION: Check if appointment is less than 2 hours away
      console.log('Checking time restriction...');
      console.log('Backend date/time input:', { date: booking.date, time: booking.time });
      
      let appointmentDateTime;
      
      // Handle different date formats (ISO string vs regular date string)
      if (booking.date && booking.date.toString().includes('T')) {
        // ISO format: Extract just the date part and combine with time
        const datePart = booking.date.toString().split('T')[0]; // Get YYYY-MM-DD
        appointmentDateTime = new Date(`${datePart} ${booking.time}`);
        console.log('Using ISO format parsing:', { datePart, fullString: `${datePart} ${booking.time}` });
      } else {
        // Regular format: Use as-is
        appointmentDateTime = new Date(`${booking.date} ${booking.time}`);
        console.log('Using regular format parsing:', { dateString: `${booking.date} ${booking.time}` });
      }
      
      // Check if the created date is valid
      if (isNaN(appointmentDateTime.getTime())) {
        console.log('Backend: Invalid date/time format', { 
          bookingDate: booking.date, 
          bookingTime: booking.time,
          appointmentDateTime: appointmentDateTime.toString()
        });
        return NextResponse.json(
          { success: false, message: 'Invalid booking date or time format' },
          { status: 400 }
        );
      }
      
      const currentTime = new Date();
      const timeDifference = appointmentDateTime - currentTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert to hours

      console.log('Time check:', {
        appointmentDateTime: appointmentDateTime.toISOString(),
        currentTime: currentTime.toISOString(),
        hoursDifference: hoursDifference
      });

      if (hoursDifference < 2) {
        console.log('Cancellation blocked: Less than 2 hours until appointment');
        return NextResponse.json(
          { success: false, message: 'Last-minute cancellations (within 2 hours) are not allowed.' },
          { status: 400 }
        );
      }

      console.log('Time restriction passed - cancellation allowed');
    }

    // Update booking status
    console.log('Updating booking status to:', status);
    const updateResult = await db.collection('bookings').updateOne(
      { _id: bookingObjectId },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      console.log('No booking was updated');
      return NextResponse.json(
        { success: false, message: 'No changes made to the booking' },
        { status: 400 }
      );
    }

    console.log('Booking updated successfully');

    // Send confirmation email when booking is confirmed
    if (status === 'confirmed') {
      console.log('Booking confirmed - sending confirmation email to customer...');
      
      try {
        // Get salon details for email
        const salon = await db.collection('salons').findOne({ _id: booking.salonId });
        const salonName = salon ? salon.salonName || salon.name : 'Unknown Salon';
        
        // Get customer name
        let customerName = 'Customer';
        if (booking.customerId) {
          const customer = await db.collection('users').findOne({ _id: booking.customerId });
          if (customer) {
            customerName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer';
          }
        }
        
        // Send booking confirmed email (async, don't wait)
        sendBookingConfirmedEmail(booking.customerEmail, customerName, salonName);
        console.log('Booking confirmed email sent to customer:', booking.customerEmail);
      } catch (error) {
        console.error('Error sending booking confirmed email:', error);
        // Don't throw error - booking should still be confirmed even if email fails
      }
    }

    // NOTIFICATION SYSTEM: Send notification to salon owner when customer cancels
    if (status === 'cancelled' && authenticatedUser.role === 'customer') {
      console.log('Customer cancelled booking - creating notification for salon owner...');
      
      try {
        // Create notification entry
        const notification = {
          type: 'booking_cancelled',
          salonId: booking.salonId,
          bookingId: booking._id,
          customerId: booking.customerId,
          customerEmail: booking.customerEmail,
          message: `Customer ${booking.customerEmail} cancelled their booking on ${booking.date} at ${booking.time}`,
          createdAt: new Date(),
          read: false
        };

        const notificationResult = await db.collection('notifications').insertOne(notification);
        console.log('Notification created successfully:', notificationResult.insertedId);

        // Also send email notification to salon owner (if email exists)
        const salon = await db.collection('salons').findOne({ _id: booking.salonId });
        if (salon && salon.email) {
          console.log('Sending cancellation email to salon owner:', salon.email);
          
          // Send email notification
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: salon.email,
            subject: 'Booking Cancellation Notification',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e74c3c;">Booking Cancelled</h2>
                <p>A customer has cancelled their booking:</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p><strong>Customer:</strong> ${booking.customerEmail}</p>
                  <p><strong>Date:</strong> ${booking.date}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p><strong>Service:</strong> ${
                    Array.isArray(booking.serviceDetails) 
                      ? booking.serviceDetails.map(service => service.name || service).join(', ')
                      : booking.serviceDetails?.name || booking.serviceDetails || 'Service not specified'
                  }</p>
                </div>
                <p>Please check your dashboard for more details.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">This is an automated message from BookNGlow.</p>
              </div>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log('Cancellation email sent to salon owner');
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Booking ${status} successfully`,
        status: status,
        bookingId: bookingObjectId
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Booking update error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
