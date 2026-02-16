import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function GET() {
  try {
    await connectDB();

    const reminders = await Reminder.find({})
      .populate('taxpayerId', 'name businessName')
      .populate('assessmentId', 'financialYear amount')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      reminders
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
