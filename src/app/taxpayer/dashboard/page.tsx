'use client';

import React from 'react';
import TaxpayerLayout from '@/components/Layout/TaxpayerLayout';
import { useApp } from '@/contexts/AppContext';
import {
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export default function TaxpayerDashboard() {
  const { state } = useApp();

  // For demo purposes, we'll show data for first taxpayer
  const taxpayerId = '1'; // John Smith's ID
  const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
  
  const taxpayerAssessments = state.assessments.filter(a => a.taxpayerId === taxpayerId);
  const taxpayerPayments = state.payments.filter(p => {
    const assessment = state.assessments.find(a => a.id === p.assessmentId);
    return assessment?.taxpayerId === taxpayerId;
  });

  const totalAssessed = taxpayerAssessments.reduce((sum, a) => sum + a.totalAmount, 0);
  const totalPaid = taxpayerAssessments.reduce((sum, a) => sum + a.paidAmount, 0);
  const totalUnpaid = taxpayerAssessments.reduce((sum, a) => sum + a.balance, 0);
  const overdueAssessments = taxpayerAssessments.filter(a => a.balance > 0 && new Date(a.dueDate) < new Date());

  const nextDueAssessment = taxpayerAssessments
    .filter(a => a.balance > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <TaxpayerLayout>
      <div className="space-y-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, {taxpayer?.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Profession:</span> {taxpayer?.profession}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {taxpayer?.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {taxpayer?.phone}
                </div>
                <div>
                  <span className="font-medium">Registration:</span> {taxpayer?.registrationDate}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {taxpayer?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Summary Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">${totalUnpaid.toLocaleString()}</div>
              <div className="text-teal-100">Total Outstanding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {nextDueAssessment ? new Date(nextDueAssessment.dueDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-teal-100">Next Due Date</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{taxpayerAssessments.length}</div>
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
                  ${totalAssessed.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${totalPaid.toLocaleString()}
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
                  {taxpayerPayments.length}
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
              <div className="space-y-4">
                {taxpayerAssessments.slice(0, 4).map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">{assessment.assessmentYear}</p>
                      <p className="text-sm text-slate-600">Balance: ${assessment.balance.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        assessment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        assessment.status === 'partially_paid' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assessment.status === 'paid' ? 'Paid' :
                         assessment.status === 'partially_paid' ? 'Partially Paid' : 'Unpaid'}
                      </span>
                      {assessment.balance > 0 && (
                        <button className="mt-2 w-full px-3 py-1 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {taxpayerPayments.slice(0, 4).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900">{payment.receiptNumber}</p>
                      <p className="text-sm text-slate-600">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{payment.method}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  You have {overdueAssessments.length} overdue assessment(s) totaling ${overdueAssessments.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                </p>
                <p className="text-red-200 text-sm mt-2">
                  Please make your payment as soon as possible to avoid penalties.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TaxpayerLayout>
  );
}
