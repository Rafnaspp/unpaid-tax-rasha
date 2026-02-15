import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

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

    const reminders = await Reminder.find({ taxpayerId: userId })
      .populate('assessmentId', 'financialYear amount')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      reminders
    });
  } catch (error) {
    console.error('Get user reminders error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
