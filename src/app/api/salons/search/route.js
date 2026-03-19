import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request) {
  try {
    console.log('=== AI SALON SEARCH API ===');
    
    await connectDB();
    console.log('Database connected for salon search');

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const searchQuery = searchParams.get('searchQuery');

    console.log('Search parameters:', { location, searchQuery });

    // Validate parameters
    if (!location || !searchQuery) {
      console.log('Missing parameters');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Location and search query are required' 
        },
        { status: 400 }
      );
    }

    // Build MongoDB query
    const searchRegex = new RegExp(searchQuery, 'i'); // case-insensitive
    const locationRegex = new RegExp(location, 'i'); // case-insensitive

    const query = {
      location: { $regex: locationRegex },
      $or: [
        { salonName: { $regex: searchRegex } },
        { 'services.name': { $regex: searchRegex } }
      ]
    };

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    // Get Salon model (assuming it exists)
    const Salon = require('@/models/Salon').default;
    
    if (!Salon) {
      console.log('Salon model not found');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Salon model not available' 
        },
        { status: 500 }
      );
    }

    // Execute search
    console.log('Searching for salons...');
    const salons = await Salon.find(query)
      .select('salonName location services images rating address phone')
      .limit(20)
      .lean();

    console.log(`Found ${salons.length} salons`);

    // Format results with matched service details
    const formattedSalons = salons.map(salon => {
      const matchedService = findMatchingService(salon, searchQuery);
      
      return {
        id: salon._id,
        salonName: salon.salonName || 'Unnamed Salon',
        location: salon.location || 'Unknown Location',
        services: salon.services || [],
        images: salon.images || [],
        rating: salon.rating || 0,
        address: salon.address || '',
        phone: salon.phone || '',
        matchReason: determineMatchReason(salon, searchQuery),
        matchedService: matchedService // Add matched service with price
      };
    });

    console.log('Formatted salons:', formattedSalons.length);

    return NextResponse.json({
      success: true,
      message: `Found ${formattedSalons.length} matching salons`,
      data: {
        salons: formattedSalons,
        searchQuery,
        location,
        totalResults: formattedSalons.length
      }
    });

  } catch (error) {
    console.error('Salon search error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to search salons: ' + error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to find matching service with price
function findMatchingService(salon, searchQuery) {
  const searchRegex = new RegExp(searchQuery, 'i');
  
  if (salon.services && salon.services.length > 0) {
    const matchingService = salon.services.find(service => 
      service.name && searchRegex.test(service.name)
    );
    
    if (matchingService) {
      return {
        name: matchingService.name,
        price: matchingService.price || 'Not specified',
        duration: matchingService.duration || 'Not specified'
      };
    }
  }
  
  return null;
}

// Helper function to determine why a salon matched
function determineMatchReason(salon, searchQuery) {
  const searchRegex = new RegExp(searchQuery, 'i');
  
  if (salon.salonName && searchRegex.test(salon.salonName)) {
    return 'Salon Name Match';
  }
  
  if (salon.services && salon.services.length > 0) {
    const matchingService = salon.services.find(service => 
      service.name && searchRegex.test(service.name)
    );
    if (matchingService) {
      return `Service Match: ${matchingService.name}`;
    }
  }
  
  return 'Unknown Match';
}
