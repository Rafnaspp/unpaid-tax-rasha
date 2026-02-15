import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import Payment from '@/models/Payment';

// Generate receipt number
function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `REC-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const { assessmentId, amount, mode } = await request.json();

    if (!assessmentId || !amount || !mode) {
      return NextResponse.json({
        success: false,
        message: 'Assessment ID, amount, and mode are required'
      }, { status: 400 });
    }

    await connectDB();

    // Find assessment
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return NextResponse.json({
        success: false,
        message: 'Assessment not found'
      }, { status: 404 });
    }

    // Update assessment
    assessment.paidAmount += amount;
    assessment.balance = assessment.amount - assessment.paidAmount;

    // Update status
    if (assessment.balance === 0) {
      assessment.status = 'Paid';
    } else if (assessment.paidAmount > 0) {
      assessment.status = 'Partially Paid';
    }

    await assessment.save();

    // Create payment record
    const payment = new Payment({
      assessmentId,
      taxpayerId: assessment.taxpayerId,
      amount,
      mode,
      receiptNumber: generateReceiptNumber()
    });

    await payment.save();

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      assessment,
      payment
    });
  } catch (error) {
    console.error('Manual payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
