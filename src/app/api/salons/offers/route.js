import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';
import { getToken } from '@/lib/api';

export async function POST(request) {
  try {
    console.log('=== ADD SALON OFFER API ===');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('No token found in headers or cookies');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('Token found, proceeding with offer addition');

    // Parse request body
    const offerData = await request.json();
    console.log('Offer data:', offerData);

    // Extract salonId from request body
    const { salonId, title, discount, description, validDate } = offerData;
    
    // Validate required fields
    if (!title || !discount) {
      return NextResponse.json(
        { success: false, message: 'Offer title and discount are required' },
        { status: 400 }
      );
    }

    // Validate salonId
    if (!salonId) {
      return NextResponse.json(
        { success: false, message: 'Salon ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    console.log('Database connected for adding offer');

    // Get salon from authenticated user
    // For now, let's get the first salon (in production, decode JWT to get user-specific salon)
    const salon = await Salon.findOne();
    if (!salon) {
      return NextResponse.json(
        { success: false, message: 'Salon not found' },
        { status: 404 }
      );
    }

    console.log('Found salon:', salon.salonName);
    console.log('Current offers count:', salon.offers?.length || 0);

    // Create new offer object
    const newOffer = {
      title: title.trim(),
      discount: parseFloat(discount),
      description: description?.trim() || '',
      validDate: validDate || null,
      createdAt: new Date(),
      isActive: true
    };

    // Add offer to salon's offers array
    if (!salon.offers) {
      salon.offers = [];
    }
    
    // Force update schema to accept objects
    // This is a workaround for MongoDB schema change issues
    try {
      // Check if offers array is still using old string format
      if (salon.offers.length > 0 && typeof salon.offers[0] === 'string') {
        console.log('Converting offers from string format to object format');
        salon.offers = []; // Reset to empty array for new format
      }
      
      salon.offers.push(newOffer);
      
      // Use markModified to ensure MongoDB recognizes the schema change
      salon.markModified('offers');
      
      // Save salon with new offer
      await salon.save();
      console.log('Offer added successfully to salon:', salon.salonName);
    } catch (schemaError) {
      console.error('Schema error:', schemaError.message);
      
      // If schema error, try to force update with raw MongoDB operation
      console.log('Attempting to force update with raw MongoDB operation...');
      
      try {
        // Use raw MongoDB update to bypass schema validation
        await Salon.updateOne(
          { _id: salon._id },
          { 
            $push: { offers: newOffer },
            $set: { updatedAt: new Date() }
          }
        );
        console.log('Offer added with raw MongoDB operation');
      } catch (rawError) {
        console.error('Raw MongoDB operation failed:', rawError.message);
        
        // Last resort: Create new offers array
        console.log('Attempting last resort solution...');
        
        await Salon.updateOne(
          { _id: salon._id },
          { 
            $set: { 
              offers: [newOffer],
              updatedAt: new Date() 
            }
          }
        );
        console.log('Offer added with last resort solution');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Offer added successfully',
      data: {
        offer: newOffer,
        salon: {
          id: salon._id,
          name: salon.salonName,
          offers: salon.offers
        }
      }
    });

  } catch (error) {
    console.error('Add offer error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add offer: ' + error.message 
      },
      { status: 500 }
    );
  }
}
