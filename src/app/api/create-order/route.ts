import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SGXNcfSszwWDa0",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "5gZe2BdBOsulRlVdPlB4w6nF",
});

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json({
        success: false,
        message: 'Assessment ID is required'
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

    // Create Razorpay order
    const options = {
      amount: assessment.balance * 100, // Convert to paise
      currency: 'INR',
      receipt: `ORD_${Date.now()}`, // Shortened to under 40 chars
      notes: {
        assessmentId: assessmentId
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
