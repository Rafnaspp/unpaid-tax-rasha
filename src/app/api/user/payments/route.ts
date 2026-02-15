import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

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

    const payments = await Payment.find({ taxpayerId: userId })
      .populate('assessmentId', 'financialYear amount')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
