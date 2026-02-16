'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { state } = useApp();

  // Safe data access with fallbacks
  const assessments = state?.assessments || [];
  const taxpayers = state?.taxpayers || [];
  const payments = state?.payments || [];
  const reminders = state?.reminders || [];

  // Safe calculations with fallbacks
  const totalAssessed = assessments.reduce(
    (sum, a) => sum + (a?.amount || 0),
    0
  );
  const totalCollected = assessments.reduce(
    (sum, a) => sum + (a?.paidAmount || 0),
    0
  );
  const totalUnpaid = assessments.reduce(
    (sum, a) => sum + (a?.balance || 0),
    0
  );
  const totalTaxpayers = taxpayers.length;

  // Safe filtering with fallbacks
  const recentPayments = payments
    .filter(p => p?.paymentDate)
    .slice(-5)
    .reverse();

  const overdueAssessments = assessments.filter(
    a => a?.status === 'unpaid' && a?.dueDate && new Date(a.dueDate) < new Date()
  );

  // Loading state
  if (state?.loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Taxpayers</p>
                <p className="text-2xl font-bold text-gray-900">{totalTaxpayers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessed</p>
                <p className="text-2xl font-bold text-gray-900">${totalAssessed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-gray-900">${totalCollected.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">${totalUnpaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
          </div>
          <div className="p-6">
            {recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div key={payment._id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Payment #{payment.receiptNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${payment.amount?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{payment.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent payments found</p>
            )}
          </div>
        </div>

        {/* Overdue Assessments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Overdue Assessments</h3>
          </div>
          <div className="p-6">
            {overdueAssessments.length > 0 ? (
              <div className="space-y-3">
                {overdueAssessments.map((assessment) => (
                  <div key={assessment._id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assessment.financialYear} - {assessment.slabName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        ${assessment.balance?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{assessment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No overdue assessments found</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
