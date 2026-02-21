import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({
        success: false,
        message: 'Username is required'
      }, { status: 400 });
    }

    await connectDB();

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this username exists, a password reset link has been sent.'
      });
    }

    // Generate reset token (simple implementation for demo)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // In a real application, you would send an email here
    // For demo purposes, we'll just return the token
    console.log(`Password reset token for ${username}: ${resetToken}`);
    console.log(`Reset link would be: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&username=${username}`);

    return NextResponse.json({
      success: true,
      message: 'If an account with this username exists, a password reset link has been sent.',
      // For demo only - remove in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
