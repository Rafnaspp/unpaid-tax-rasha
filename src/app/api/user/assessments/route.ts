import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    await connectDB();

    const assessments = await Assessment.find({ taxpayerId: userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      assessments
    });
  } catch (error) {
    console.error('Get user assessments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
