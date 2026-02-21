import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import User from '@/models/User';

// Kerala Professional Tax Half-Yearly Slabs
const calculateKeralaTax = (halfYearIncome: number) => {
  if (halfYearIncome <= 12000) return 0;
  if (halfYearIncome <= 18000) return 120;
  if (halfYearIncome <= 30000) return 180;
  if (halfYearIncome <= 45000) return 300;
  if (halfYearIncome <= 60000) return 450;
  if (halfYearIncome <= 75000) return 600;
  if (halfYearIncome <= 100000) return 750;
  if (halfYearIncome <= 125000) return 1000;
  return 1250; // Maximum per half-year (₹2,500 per year)
};

// Calculate Kerala due date based on current month
const calculateKeralaDueDate = () => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (0=Jan, 8=Sep)
  const currentYear = now.getFullYear();
  
  // Kerala Professional Tax due dates: March 31 and September 30
  if (currentMonth >= 3 && currentMonth <= 8) { // April to September
    return new Date(currentYear, 8, 30); // September 30
  } else { // October to March
    return new Date(currentYear, 2, 31); // March 31
  }
};

export async function POST(request: NextRequest) {
  try {
    const { taxpayerId, financialYear, halfYearIncome } = await request.json();

    if (!taxpayerId || !financialYear || !halfYearIncome) {
      return NextResponse.json({
        success: false,
        message: 'Taxpayer ID, financial year, and half-year income are required'
      }, { status: 400 });
    }

    await connectDB();

    // Get taxpayer name
    const taxpayer = await User.findById(taxpayerId);
    const taxpayerName = taxpayer?.name || 'Unknown';

    // Calculate tax amount using Kerala slabs
    const taxAmount = calculateKeralaTax(halfYearIncome);
    
    // Determine slab name based on income
    let slabName;
    if (halfYearIncome <= 12000) slabName = 'Up to ₹12,000';
    else if (halfYearIncome <= 18000) slabName = '₹12,001 - ₹18,000';
    else if (halfYearIncome <= 30000) slabName = '₹18,001 - ₹30,000';
    else if (halfYearIncome <= 45000) slabName = '₹30,001 - ₹45,000';
    else if (halfYearIncome <= 60000) slabName = '₹45,001 - ₹60,000';
    else if (halfYearIncome <= 75000) slabName = '₹60,001 - ₹75,000';
    else if (halfYearIncome <= 100000) slabName = '₹75,001 - ₹1,00,000';
    else if (halfYearIncome <= 125000) slabName = '₹1,00,001 - ₹1,25,000';
    else slabName = 'Above ₹1,25,000';

    // Calculate automatic due date
    const dueDate = calculateKeralaDueDate();

    // Create new assessment with calculated values
    const assessment = new Assessment({
      taxpayerId,
      taxpayerName,
      financialYear,
      halfYearIncome,
      slabName,
      amount: taxAmount,
      paidAmount: 0,
      balance: taxAmount,
      dueDate,
      status: 'unpaid'
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
