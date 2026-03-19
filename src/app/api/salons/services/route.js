import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';
import { getToken } from '@/lib/api';

export async function POST(request) {
  try {
    console.log('=== ADD SALON SERVICE API ===');
    
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

    console.log('Token found, proceeding with service addition');

    // Parse request body
    const serviceData = await request.json();
    console.log('Service data:', serviceData);

    // Extract salonId from request body
    const { salonId, name, price, description, duration } = serviceData;
    
    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Service name and price are required' },
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
    console.log('Database connected for adding service');

    // Get salon from authenticated user
    // Use the specific salonId from request
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return NextResponse.json(
        { success: false, message: 'Salon not found' },
        { status: 404 }
      );
    }

    console.log('Found salon:', salon.salonName);
    console.log('Current services count:', salon.services?.length || 0);

    // Create new service object
    const newService = {
      name: name.trim(),
      price: parseFloat(price),
      description: description?.trim() || '',
      duration: duration?.trim() || '30min', // Use user-provided duration or default
      createdAt: new Date()
    };

    console.log('New service object:', newService);

    // Add service to salon's services array
    if (!salon.services) {
      salon.services = [];
    }
    salon.services.push(newService);

    // Save salon with new service
    await salon.save();
    console.log('Service added successfully to salon:', salon.salonName);
    console.log('Updated services count:', salon.services?.length || 0);
    console.log('New service details:', newService);

    return NextResponse.json({
      success: true,
      message: 'Service added successfully',
      data: {
        service: newService,
        salon: {
          id: salon._id,
          name: salon.salonName,
          services: salon.services
        }
      }
    });

  } catch (error) {
    console.error('Add service error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add service: ' + error.message 
      },
      { status: 500 }
    );
  }
}
