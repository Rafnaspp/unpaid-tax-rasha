import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { username, newPassword } = await request.json();

    console.log('Forgot password request:', { username, newPassword: '***' });

    if (!username || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Username and new password are required'
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    await connectDB();
    console.log('Connected to database');

    // Find user by username
    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 400 });
    }

    // Update user password (no hashing)
    user.password = newPassword;
    await user.save();
    console.log('Password updated in database');

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Simple forgot password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error: ' + error.message
    }, { status: 500 });
  }
}
