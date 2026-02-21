import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Assessment from '@/models/Assessment';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { paymentId, refundAmount } = await request.json();

    if (!paymentId || !refundAmount) {
      return NextResponse.json({
        success: false,
        message: 'Payment ID and refund amount are required'
      }, { status: 400 });
    }

    await connectDB();

    // Find payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({
        success: false,
        message: 'Payment not found'
      }, { status: 404 });
    }

    // Validate payment mode is online
    if (payment.mode !== 'online') {
      return NextResponse.json({
        success: false,
        message: 'Refunds are only available for online payments'
      }, { status: 400 });
    }

    // Validate refund amount (simple validation: refundAmount <= payment.amount)
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      return NextResponse.json({
        success: false,
        message: 'Refund amount must be greater than 0 and less than or equal to payment amount'
      }, { status: 400 });
    }

    // Call Razorpay refund API
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SGXNcfSszwWDa0",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "5gZe2BdBOsulRlVdPlB4w6nF",
    });

    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: refundAmount * 100 // Convert to paise
    });

    // Update payment record only (do NOT modify assessment)
    payment.refundAmount = refundAmount;
    payment.razorpayRefundId = refund.id;
    
    // Set refund status
    if (refundAmount >= payment.amount) {
      payment.refundStatus = 'full';
    } else {
      payment.refundStatus = 'partial';
    }

    await payment.save();

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: payment.refundStatus
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process refund'
    }, { status: 500 });
  }
}
