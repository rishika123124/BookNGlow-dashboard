import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';
import { authenticateAdmin } from '@/lib/admin-auth';

export async function GET(request) {
  try {
    console.log('=== ADMIN SALONS API - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    console.log('Admin authenticated successfully');
    
    await connectDB();
    console.log('Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');
    const isPremium = searchParams.get('isPremium');
    const recent = searchParams.get('recent');

    // Build query for database
    let query = {};
    if (status) {
      query.status = status;
    }
    if (isPremium !== null) {
      query.isPremium = isPremium === 'true';
    }

    console.log('Query:', query);
    console.log('Fetching from real database...');

    // Fetch from real database
    let salons = await Salon.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log('Total salons from database:', salons.length);
    
    // Filter by status if specified
    if (status) {
      salons = salons.filter(salon => salon.status === status);
      console.log(`Filtered by ${status}:`, salons.length);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSalons = salons.slice(startIndex, endIndex);

    console.log('Returning salons:', paginatedSalons.length);
    console.log('API Response Success: true');

    return NextResponse.json({
      success: true,
      data: paginatedSalons,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(salons.length / limit),
        totalSalons: salons.length,
        hasNext: endIndex < salons.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch salons from database' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log('=== ADMIN SALON UPDATE - REAL DATABASE ===');
    
    // Authenticate admin
    const auth = await authenticateAdmin(request);
    if (auth.error) {
      console.log('Authentication failed:', auth.error);
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    console.log('Admin authenticated for update');
    
    const { salonId, action, reason } = await request.json();

    console.log('=== ADMIN SALON UPDATE - REAL DATABASE ===');
    console.log('Action:', action);
    console.log('Salon ID:', salonId);

    await connectDB();
    console.log('Database connected for update');

    // Find salon in real database
    const salon = await Salon.findById(salonId);
    
    if (!salon) {
      return NextResponse.json(
        { success: false, message: 'Salon not found in database' },
        { status: 404 }
      );
    }

    let updateData = {};
    let message = '';
    
    switch (action) {
      case 'approve':
        updateData = { 
          status: 'approved',
          isActive: true,
          approvedAt: new Date(),
          approvedBy: 'admin',
          updatedAt: new Date()
        };
        message = 'Salon approved successfully';
        break;
      
      case 'reject':
        updateData = { 
          status: 'rejected',
          isActive: false,
          rejectedAt: new Date(),
          rejectedBy: 'admin',
          rejectionReason: reason || 'Rejected by admin',
          updatedAt: new Date()
        };
        message = 'Salon rejected successfully';
        break;
      
      case 'block':
        updateData = { 
          status: 'blocked',
          isActive: false,
          blockedAt: new Date(),
          blockedBy: 'admin',
          updatedAt: new Date()
        };
        message = 'Salon blocked successfully';
        break;
      
      case 'unblock':
        updateData = { 
          status: 'approved',
          isActive: true,
          unblockedAt: new Date(),
          unblockedBy: 'admin',
          updatedAt: new Date()
        };
        message = 'Salon unblocked successfully';
        break;
      
      case 'togglePremium':
        const currentStatus = salon.isPremium;
        updateData = { 
          isPremium: !currentStatus,
          updatedAt: new Date()
        };
        message = `Salon premium status ${!currentStatus ? 'enabled' : 'disabled'}`;
        break;
      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update salon in real database
    const updatedSalon = await Salon.findByIdAndUpdate(
      salonId, 
      updateData, 
      { new: true }
    );

    // Clear public salons cache to force refresh
    const { clearSalonsCache } = require('../../salons/route');
    if (clearSalonsCache) {
      clearSalonsCache();
    }

    console.log('Updated salon in database:', updatedSalon);
    console.log('Cache cleared for public display');
    console.log('Update success:', message);

    return NextResponse.json({
      success: true,
      message,
      action,
      data: updatedSalon
    });

  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update salon in database' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json(
        { success: false, message: 'Salon ID is required' },
        { status: 400 }
      );
    }

    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    // Hard delete
    const result = await db.collection('salons').deleteOne({
      _id: new ObjectId(salonId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Salon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Salon deleted successfully'
    });

  } catch (error) {
    console.error('Salon delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete salon' },
      { status: 500 }
    );
  }
}
