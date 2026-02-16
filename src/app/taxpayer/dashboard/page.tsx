'use client';

import React, { useState, useEffect } from 'react';
import TaxpayerLayout from '@/components/Layout/TaxpayerLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CreditCard
} from 'lucide-react';

interface Assessment {
  _id: string;
  financialYear: string;
  slabName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'unpaid' | 'partially_paid' | 'paid';
}

interface Payment {
  _id: string;
  amount: number;
  paymentDate: string;
  mode: string;
  receiptNumber: string;
}

interface User {
  _id: string;
  name: string;
  businessName: string;
  ward: string;
}

export default function TaxpayerDashboard() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch user assessments
      const assessmentsResponse = await fetch(`/api/user/assessments?userId=${user?.id}`);
      const assessmentsData = await assessmentsResponse.json();
      if (assessmentsData.success) {
        setAssessments(assessmentsData.assessments || []);
      }

      // Fetch user payments
      const paymentsResponse = await fetch(`/api/user/payments?userId=${user?.id}`);
      const paymentsData = await paymentsResponse.json();
      if (paymentsData.success) {
        setPayments(paymentsData.payments || []);
      }

      // Set user info from auth context
      setUserInfo({
        _id: user?.id || '',
        name: user?.name || '',
        businessName: user?.businessName || '',
        ward: user?.ward || ''
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Safe calculations with fallbacks
  const totalAssessed = assessments.reduce(
    (sum: number, assessment: Assessment) => sum + (assessment?.amount || 0),
    0
  );
  const totalPaid = assessments.reduce(
    (sum: number, assessment: Assessment) => sum + (assessment?.paidAmount || 0),
    0
  );
  const totalUnpaid = assessments.reduce(
    (sum: number, assessment: Assessment) => sum + (assessment?.balance || 0),
    0
  );

  // Safe filtering with fallbacks
  const overdueAssessments = assessments.filter(
    a => a?.status === 'unpaid' && a?.dueDate && new Date(a.dueDate) < new Date()
  );

  const nextDueAssessment = assessments
    .filter(a => a?.balance > 0)
    .sort((a, b) => {
      const dateA = a?.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b?.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    })[0];

  // Loading state
  if (isLoading) {
    return (
      <TaxpayerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </TaxpayerLayout>
    );
  }

  return (
    <TaxpayerLayout>
      <div className="space-y-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, {userInfo?.name || 'User'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Business:</span> {userInfo?.businessName || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Ward:</span> {userInfo?.ward || 'N/A'}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {userInfo?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Summary Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">₹{totalUnpaid.toLocaleString()}</div>
              <div className="text-teal-100">Total Outstanding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {nextDueAssessment?.dueDate ? new Date(nextDueAssessment.dueDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-teal-100">Next Due Date</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{assessments.length}</div>
              <div className="text-teal-100">Active Assessments</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Assessed</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{totalAssessed.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Payment History</p>
                <p className="text-2xl font-bold text-slate-900">
                  {payments.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Assessments */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Your Assessments</h3>
            </div>
            <div className="p-6">
              {assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.slice(0, 4).map((assessment) => (
                    <div key={assessment._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{assessment.financialYear}</p>
                        <p className="text-sm text-slate-600">Balance: ₹{(assessment.balance || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${assessment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            assessment.status === 'partially_paid' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {assessment.status === 'paid' ? 'Paid' :
                            assessment.status === 'partially_paid' ? 'Partially Paid' : 'Unpaid'}
                        </span>
                        {(assessment.balance || 0) > 0 && (
                          <button className="mt-2 w-full px-3 py-1 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No assessments found</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
            </div>
            <div className="p-6">
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.slice(0, 4).map((payment) => (
                    <div key={payment._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">#{payment.receiptNumber}</p>
                        <p className="text-sm text-slate-600">
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{(payment.amount || 0).toLocaleString()}</p>
                        <p className="text-xs text-slate-500 capitalize">{payment.mode || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payments found</p>
              )}
            </div>
          </div>
        </div>

        {/* Overdue Alert */}
        {overdueAssessments.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Payment Overdue</h3>
                <p className="text-red-100">
                  You have {overdueAssessments.length} overdue assessment(s) totaling {overdueAssessments.reduce((sum: number, a: Assessment) => sum + (a?.balance || 0), 0).toLocaleString()}
                </p>
                <p className="text-red-200 text-sm mt-2">
                  Please make your payment as soon as possible to avoid penalties.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </TaxpayerLayout>
  );
}
