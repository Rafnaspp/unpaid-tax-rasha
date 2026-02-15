import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: 'admin',
          username: 'admin',
          role: 'admin'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
