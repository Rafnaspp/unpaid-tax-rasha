import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function POST(request: NextRequest) {
  try {
    const { taxpayerId, assessmentId, reminderDate, message } = await request.json();

    if (!taxpayerId || !assessmentId || !reminderDate || !message) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }

    await connectDB();

    // Create reminder
    const reminder = new Reminder({
      taxpayerId,
      assessmentId,
      reminderDate: new Date(reminderDate),
      message
    });

    await reminder.save();

    // Populate for response
    const populatedReminder = await Reminder.findById(reminder._id)
      .populate('taxpayerId', 'name businessName')
      .populate('assessmentId', 'financialYear amount');

    return NextResponse.json({
      success: true,
      message: 'Reminder created successfully',
      reminder: populatedReminder
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
