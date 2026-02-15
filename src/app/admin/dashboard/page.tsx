'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import {
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  Receipt
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { state } = useApp();

  const totalAssessed = state.assessments.reduce((sum, a) => sum + a.totalAmount, 0);
  const totalCollected = state.assessments.reduce((sum, a) => sum + a.paidAmount, 0);
  const totalUnpaid = state.assessments.reduce((sum, a) => sum + a.balance, 0);
  const totalTaxpayers = state.taxpayers.length;

  const recentPayments = state.payments
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  const overdueAssessments = state.assessments.filter(
    a => a.balance > 0 && new Date(a.dueDate) < new Date()
  );

  const getTaxpayerName = (taxpayerId: string) => {
    const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
    return taxpayer?.name || 'Unknown';
  };

  const getAssessmentDetails = (assessmentId: string) => {
    const assessment = state.assessments.find(a => a.id === assessmentId);
    return assessment;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-slate-600">Total Assessed</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${totalAssessed.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-slate-600">Total Collected</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${totalCollected.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 p-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-slate-600">Total Unpaid</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${totalUnpaid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-slate-100 p-2">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-slate-600">Total Taxpayers</p>
                <p className="text-lg font-semibold text-slate-900">
                  {totalTaxpayers}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-white border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-medium text-slate-900">Recent Payments</h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Taxpayer
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {recentPayments.map((payment) => {
                    const assessment = getAssessmentDetails(payment.assessmentId);
                    return (
                      <tr key={payment.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-900">
                          {getTaxpayerName(assessment?.taxpayerId || '')}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-900">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-500">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-blue-600">
                          {payment.receiptNumber}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overdue Assessments */}
          <div className="bg-white border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-medium text-slate-900">Overdue Assessments</h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Taxpayer
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {overdueAssessments.map((assessment) => (
                    <tr key={assessment.id} className="bg-red-50">
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-900">
                        {getTaxpayerName(assessment.taxpayerId)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-red-600">
                        ${assessment.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-500">
                        {new Date(assessment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold bg-red-100 text-red-800">
                          OVERDUE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
