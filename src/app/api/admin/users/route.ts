import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, username, password, businessName, ward } = await request.json();

    if (!name || !username || !password || !businessName || !ward) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }

    await connectDB();

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Username already exists'
      }, { status: 400 });
    }

    // Create new taxpayer (password will be hashed automatically by pre-save hook)
    const user = new User({
      name,
      username,
      password,
      businessName,
      ward,
      role: 'taxpayer'
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Taxpayer created successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        businessName: user.businessName,
        ward: user.ward,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({ role: 'taxpayer' }).select('-password');

    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
