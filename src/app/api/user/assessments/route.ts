import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
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

    // Get assessments with their payments
    const assessments = await Assessment.find({ taxpayerId: userId })
      .sort({ createdAt: -1 });

    // Get payments for these assessments
    const payments = await Payment.find({ 
      assessmentId: { $in: assessments.map(a => a._id) }
    });

    // Calculate refund amounts for each assessment
    const assessmentsWithRefunds = assessments.map(assessment => {
      const assessmentPayments = payments.filter(p => 
        p.assessmentId.toString() === assessment._id.toString()
      );
      
      const totalRefunded = assessmentPayments.reduce((sum, payment) => 
        sum + (payment.refundAmount || 0), 0
      );

      return {
        ...assessment.toObject(),
        refundedAmount: totalRefunded
      };
    });

    return NextResponse.json({
      success: true,
      assessments: assessmentsWithRefunds
    });
  } catch (error) {
    console.error('Get user assessments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
