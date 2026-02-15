import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { taxpayerId, financialYear, slabName, amount, dueDate } = await request.json();

    if (!taxpayerId || !financialYear || !slabName || !amount || !dueDate) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }

    await connectDB();

    // Create new assessment with default values
    const assessment = new Assessment({
      taxpayerId,
      financialYear,
      slabName,
      amount,
      paidAmount: 0,
      balance: amount,
      dueDate: new Date(dueDate),
      status: 'Unpaid'
    });

    await assessment.save();

    // Populate taxpayer name for response
    const populatedAssessment = await Assessment.findById(assessment._id).populate('taxpayerId', 'name businessName');

    return NextResponse.json({
      success: true,
      message: 'Assessment created successfully',
      assessment: populatedAssessment
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const assessments = await Assessment.find({})
      .populate('taxpayerId', 'name businessName')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      assessments
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
