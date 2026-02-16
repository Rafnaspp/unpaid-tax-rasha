import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await connectDB();

    const payments = await Payment.find({})
      .populate('assessmentId', 'financialYear amount')
      .populate('taxpayerId', 'name businessName')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
