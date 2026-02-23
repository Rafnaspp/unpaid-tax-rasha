import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { taxpayerId, assessmentId, title, message } = await request.json();

    // Validate required fields
    if (!taxpayerId || !title || !message) {
      return NextResponse.json({
        success: false,
        message: 'Taxpayer ID, title, and message are required'
      }, { status: 400 });
    }

    await connectDB();

    // Validate taxpayer exists
    const taxpayer = await User.findById(taxpayerId);
    if (!taxpayer) {
      return NextResponse.json({
        success: false,
        message: 'Taxpayer not found'
      }, { status: 404 });
    }

    // Create new reminder
    const reminder = new Reminder({
      taxpayerId,
      assessmentId: assessmentId || null,
      title,
      message,
      createdBy: 'Admin'
    });

    await reminder.save();

    // Populate taxpayer name for response
    const populatedReminder = await Reminder.findById(reminder._id)
      .populate('taxpayerId', 'name businessName')
      .populate('assessmentId', 'financialYear slabName');

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
