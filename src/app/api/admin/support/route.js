import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import SupportMessage from '@/models/SupportMessage';
import { authenticateAdmin } from '@/lib/admin-auth';

export async function GET(request) {
  try {
    console.log('=== ADMIN SUPPORT MESSAGES API - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    console.log('Admin authenticated for support messages');
    
    await connectDB();
    console.log('Database connected for support messages');

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');

    console.log('Support messages query params:', { limit, page, status });

    // Build query for database
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    console.log('Support messages query:', query);

    // Fetch from real database
    const messages = await SupportMessage.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log('Support messages from database:', messages.length);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);

    console.log('Returning support messages:', paginatedMessages.length);

    return NextResponse.json({
      success: true,
      data: paginatedMessages,
      pagination: {
        page,
        limit,
        total: messages.length,
        pages: Math.ceil(messages.length / limit)
      }
    });

  } catch (error) {
    console.error('Support messages fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch support messages' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('=== ADMIN SUPPORT MESSAGE UPDATE - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    console.log('Admin authenticated for support update');
    
    const { messageId, action, data } = await request.json();
    console.log('Support message action:', { messageId, action, data });

    await connectDB();
    console.log('Database connected for support update');

    // Find support message in real database
    const message = await SupportMessage.findById(messageId);
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Support message not found' },
        { status: 404 }
      );
    }

    let updateData = {};
    
    switch (action) {
      case 'resolve':
        updateData = { 
          status: 'resolved',
          resolvedAt: new Date(),
          resolvedBy: 'admin',
          resolution: data?.resolution || 'Resolved by admin',
          updatedAt: new Date()
        };
        break;
      
      case 'reopen':
        updateData = { 
          status: 'pending',
          reopenedAt: new Date(),
          reopenedBy: 'admin',
          updatedAt: new Date()
        };
        break;
      
      case 'in-progress':
        updateData = { 
          status: 'in-progress',
          assignedTo: data?.assignedTo || 'admin',
          updatedAt: new Date()
        };
        break;
      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    console.log('Support message update data:', updateData);

    // Update in real database
    const updatedMessage = await SupportMessage.findByIdAndUpdate(
      messageId, 
      updateData,
      { new: true }
    );

    console.log('Support message updated successfully:', updatedMessage._id);

    return NextResponse.json({
      success: true,
      message: `Support message ${action}d successfully`,
      data: updatedMessage
    });

  } catch (error) {
    console.error('Support message update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update support message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log('=== ADMIN SUPPORT MESSAGE DELETE - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    console.log('Admin authenticated for support delete');
    
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting support message:', messageId);

    await connectDB();
    console.log('Database connected for support delete');

    // Delete from real database
    const deletedMessage = await SupportMessage.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, message: 'Support message not found' },
        { status: 404 }
      );
    }

    console.log('Support message deleted successfully:', deletedMessage._id);

    return NextResponse.json({
      success: true,
      message: 'Support message deleted successfully',
      data: deletedMessage
    });

  } catch (error) {
    console.error('Support message delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete support message' },
      { status: 500 }
    );
  }
}
