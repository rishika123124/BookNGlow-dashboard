import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';

export async function POST(request) {
  try {
    console.log('=== TEST SALON BLOCK/UNBLOCK FLOW ===');
    
    await connectDB();
    console.log('Database connected');

    const { action, salonName } = await request.json();
    
    if (!salonName) {
      return NextResponse.json({
        success: false,
        message: 'Salon name is required'
      });
    }

    // Find or create test salon
    let salon = await Salon.findOne({ name: salonName });
    
    if (!salon) {
      // Create test salon
      salon = new Salon({
        name: salonName,
        ownerName: 'Test Owner',
        email: 'test@salon.com',
        phone: '+919876543210',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        gender: 'Unisex',
        salonType: 'Beauty Salon',
        openingTime: '09:00',
        closingTime: '18:00',
        status: 'approved',
        isActive: true,
        isPremium: false
      });
      await salon.save();
      console.log('Test salon created:', salonName);
    }

    let message = '';
    
    switch (action) {
      case 'block':
        salon.status = 'blocked';
        salon.isActive = false;
        salon.blockedAt = new Date();
        await salon.save();
        message = 'Salon blocked successfully';
        console.log('Salon blocked:', salonName);
        break;
        
      case 'unblock':
        salon.status = 'approved';
        salon.isActive = true;
        salon.unblockedAt = new Date();
        await salon.save();
        message = 'Salon unblocked successfully';
        console.log('Salon unblocked:', salonName);
        break;
        
      case 'check-visibility':
        // Check if salon would be visible in public API
        const wouldBeVisible = salon.status === 'approved' && salon.isActive === true;
        message = wouldBeVisible ? 
          'Salon would be visible in public application' : 
          'Salon would NOT be visible in public application';
        console.log('Visibility check:', salonName, wouldBeVisible);
        break;
        
      case 'status':
        message = `Salon status: ${salon.status}, Active: ${salon.isActive}`;
        console.log('Salon status checked:', salonName, salon.status);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        });
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        name: salon.name,
        status: salon.status,
        isActive: salon.isActive,
        isBlocked: salon.status === 'blocked',
        isPubliclyVisible: salon.status === 'approved' && salon.isActive === true
      }
    });

  } catch (error) {
    console.error('Test salon flow error:', error);
    return NextResponse.json(
      { success: false, message: 'Test flow failed' },
      { status: 500 }
    );
  }
}
