import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    
    // Update all existing salon documents to add the salonImage field
    const result = await db.collection('salons').updateMany(
      { salonImage: { $exists: false } },
      { $set: { salonImage: null } }
    );
    
    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} salon documents`,
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error('Schema update error:', error);
    return NextResponse.json(
      { success: false, message: 'Schema update failed' },
      { status: 500 }
    );
  }
}
