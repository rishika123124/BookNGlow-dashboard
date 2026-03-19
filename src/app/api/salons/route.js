import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';

// Cache for salons data
let salonsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Export cache clearing function
export function clearSalonsCache() {
  salonsCache = null;
  cacheTimestamp = null;
  console.log('Salons cache cleared');
}

export async function GET() {
  try {
    console.log('=== PUBLIC SALONS API - REAL DATABASE ===');
    
    // Check cache first
    const now = Date.now();
    if (salonsCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      console.log('Returning cached salons');
      return NextResponse.json({
        success: true,
        data: salonsCache,
        cached: true
      });
    }
    
    await connectDB();
    console.log('Database connected for public salons');
    
    // Filter only approved and active salons for public display
    // Use lean() for better performance and select only needed fields
    const approvedSalons = await Salon.find({ 
      isActive: true, 
      status: 'approved' 
    })
    .select('salonName location area gender contactInfo openingTime closingTime salonImage serviceImages')
    .sort({ createdAt: -1 })
    .lean()
    .exec();
    
    console.log('Approved salons from database:', approvedSalons.length);
    
    // Update cache with approved salons
    salonsCache = {
      all: approvedSalons
    };
    cacheTimestamp = now;
    
    console.log('Cache updated with approved salons');
    console.log('Total approved salons:', approvedSalons.length);
    console.log('Female salons:', approvedSalons.filter(s => s.gender === 'female').length);
    console.log('Male salons:', approvedSalons.filter(s => s.gender === 'male').length);
    console.log('Unisex salons:', approvedSalons.filter(s => s.gender === 'unisex').length);
    
    return NextResponse.json({
      success: true,
      data: salonsCache
    });
    
  } catch (error) {
    console.error('Public salons fetch error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching salons from database',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newSalon = new Salon(body);
    const savedSalon = await newSalon.save();
    
    return NextResponse.json({
      success: true,
      message: 'Salon created successfully!',
      data: savedSalon
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error creating salon',
      error: error.message
    }, { status: 500 });
  }
}
