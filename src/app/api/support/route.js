import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportMessage from '@/models/SupportMessage';

export async function POST(request) {
  try {
    console.log('=== USER SUPPORT SUBMISSION - REAL DATABASE ===');
    
    await connectDB();
    console.log('Database connected for support submission');

    const body = await request.json();
    console.log('Support submission data:', body);

    const { name, email, phone, subject, message, category } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return NextResponse.json(
        { success: false, message: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    console.log('Creating SupportMessage instance...');
    console.log('SupportMessage model available:', !!SupportMessage);

    // Create new support message
    const supportMessage = new SupportMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      message: message.trim(),
      category: category || 'General Inquiry',
      status: 'pending',
      priority: 'medium'
    });

    console.log('Support message created:', supportMessage);
    console.log('Support message object before save:', JSON.stringify(supportMessage.toObject(), null, 2));

    // Save to database
    console.log('Attempting to save to database...');
    const savedMessage = await supportMessage.save();
    console.log('Support message saved successfully:', savedMessage._id);
    console.log('Saved message object:', JSON.stringify(savedMessage.toObject(), null, 2));

    return NextResponse.json({
      success: true,
      message: 'Support message submitted successfully. We will get back to you soon.',
      data: {
        id: savedMessage._id,
        status: savedMessage.status,
        createdAt: savedMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Support submission error - Full details:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.log('Validation error details:', error.errors);
      return NextResponse.json(
        { success: false, message: 'Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    
    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
      console.log('Database connection error');
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to submit support message: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    console.log('=== USER SUPPORT STATUS CHECK ===');
    
    await connectDB();
    console.log('Database connected for support status check');

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const messageId = searchParams.get('messageId');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    let query = { email: email.toLowerCase().trim() };
    if (messageId) {
      query._id = messageId;
    }

    // Fetch user's support messages
    const messages = await SupportMessage.find(query)
      .sort({ createdAt: -1 })
      .select('subject status category createdAt updatedAt')
      .lean()
      .exec();

    console.log(`Found ${messages.length} support messages for email: ${email}`);

    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length
    });

  } catch (error) {
    console.error('Support status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check support status' },
      { status: 500 }
    );
  }
}
