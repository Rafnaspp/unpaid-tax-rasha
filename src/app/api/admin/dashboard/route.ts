import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get all assessments
    const assessments = await Assessment.find({});

    // Calculate totals
    const totalAssessed = assessments.reduce((sum, assessment) => sum + assessment.amount, 0);
    const totalCollected = assessments.reduce((sum, assessment) => sum + assessment.paidAmount, 0);
    const totalUnpaid = assessments.reduce((sum, assessment) => sum + assessment.balance, 0);
    const totalTaxpayers = await User.countDocuments({ role: 'taxpayer' });

    return NextResponse.json({
      success: true,
      data: {
        totalAssessed,
        totalCollected,
        totalUnpaid,
        totalTaxpayers
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
