import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Salon from '@/models/Salon';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const salon = await Salon.findById(params.id);
    
    if (!salon) {
      return NextResponse.json({
        success: false,
        message: 'Salon not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: salon
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error fetching salon',
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    
    const salon = await Salon.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!salon) {
      return NextResponse.json({
        success: false,
        message: 'Salon not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Salon updated successfully',
      data: salon
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error updating salon',
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const salon = await Salon.findByIdAndDelete(params.id);

    if (!salon) {
      return NextResponse.json({
        success: false,
        message: 'Salon not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Salon deleted successfully'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error deleting salon',
      error: error.message
    }, { status: 500 });
  }
}
