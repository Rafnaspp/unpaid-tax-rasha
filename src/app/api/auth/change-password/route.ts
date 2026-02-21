import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Username, current password, and new password are required'
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'New password must be at least 6 characters long'
      }, { status: 400 });
    }

    await connectDB();

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password'
      }, { status: 400 });
    }

    // Verify current password (direct comparison, no hashing)
    if (currentPassword !== user.password) {
      return NextResponse.json({
        success: false,
        message: 'Current password is incorrect'
      }, { status: 400 });
    }

    // Update user password (no hashing)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
