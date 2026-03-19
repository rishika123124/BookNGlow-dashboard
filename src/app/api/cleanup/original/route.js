import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';

export async function POST(request) {
  try {
    await connectDB();
    
    console.log('=== FINAL CLEANUP - BEFORE PREMIUM LOGIC ===');
    
    // Get all salons to see current state
    const allSalons = await Salon.find({}).lean();
    console.log(`Found ${allSalons.length} salons in database`);
    
    // Clean up each salon to match original state before premium logic
    const updatePromises = allSalons.map(async (salon) => {
      const updateData = {};
      
      // Remove any fields that were added during premium implementation
      const fieldsToRemove = ['password', 'salonType', 'isPremium'];
      fieldsToRemove.forEach(field => {
        if (salon[field] !== undefined) {
          console.log(`Removing ${field} from salon ${salon._id}`);
          updateData.$unset = { ...updateData.$unset, [field]: 1 };
        }
      });
      
      // Ensure all original fields exist
      if (!salon.serviceImages) {
        updateData.serviceImages = [];
      }
      if (!salon.galleryImages) {
        updateData.galleryImages = [];
      }
      if (!salon.offers) {
        updateData.offers = [];
      }
      
      return { _id: salon._id, ...updateData };
    });
    
    // Apply all updates
    const updateResults = await Promise.all(
      updatePromises.map(update => 
        Salon.findByIdAndUpdate(update._id, update, { new: true })
      )
    );
    console.log(`Updated ${updateResults.length} salons`);
    
    return NextResponse.json({
      success: true,
      message: `Final cleanup completed. System reverted to state before premium logic. Processed ${allSalons.length} salons.`,
      details: {
        totalSalons: allSalons.length,
        updatedSalons: updateResults.length
      }
    });
    
  } catch (error) {
    console.error('Final cleanup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Final cleanup failed',
      error: error.message
    }, { status: 500 });
  }
}
