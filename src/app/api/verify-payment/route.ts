import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import Payment from '@/models/Payment';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SGXNcfSszwWDa0",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "5gZe2BdBOsulRlVdPlB4w6nF",
});

// Generate receipt number
function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `REC-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, assessmentId } = await request.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !assessmentId) {
      return NextResponse.json({
        success: false,
        message: 'All payment details are required'
      }, { status: 400 });
    }

    await connectDB();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "5gZe2BdBOsulRlVdPlB4w6nF")
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({
        success: false,
        message: 'Invalid payment signature'
      }, { status: 400 });
    }

    // Find assessment
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return NextResponse.json({
        success: false,
        message: 'Assessment not found'
      }, { status: 404 });
    }

    // Get payment amount from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amount = Number(payment.amount) / 100; // Convert from paise to rupees

    // Update assessment
    assessment.paidAmount = Number(assessment.paidAmount) + amount;
    assessment.balance = Number(assessment.amount) - Number(assessment.paidAmount);

    // Update status
    if (assessment.balance <= 0) {
      assessment.status = 'paid';
    } else if (assessment.paidAmount > 0) {
      assessment.status = 'partially_paid';
    }

    await assessment.save();

    // Create payment record
    const paymentRecord = new Payment({
      assessmentId,
      taxpayerId: assessment.taxpayerId,
      amount,
      mode: 'online',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      receiptNumber: generateReceiptNumber()
    });

    await paymentRecord.save();

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      assessment,
      payment: paymentRecord
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
