'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Users, TrendingUp, AlertCircle, DollarSign, Calendar, User } from 'lucide-react';

interface DashboardStats {
  totalTaxpayers: number;
  totalAssessments: number;
  totalCollected: number;
  totalUnpaid: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTaxpayers: 0,
    totalAssessments: 0,
    totalCollected: 0,
    totalUnpaid: 0
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [overdueAssessments, setOverdueAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard data
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success && data.data) {
        setStats({
          totalTaxpayers: data.data.totalTaxpayers || 0,
          totalAssessments: data.data.totalAssessed || 0,
          totalCollected: data.data.totalCollected || 0,
          totalUnpaid: data.data.totalUnpaid || 0
        });
      }

      // Fetch recent payments and overdue assessments separately
      const [paymentsRes, assessmentsRes] = await Promise.all([
        fetch('/api/admin/payments'),
        fetch('/api/admin/assessments')
      ]);

      const paymentsData = await paymentsRes.json();
      const assessmentsData = await assessmentsRes.json();

      const payments = paymentsData.payments || [];
      const assessments = assessmentsData.assessments || [];

      // Set recent payments (last 5)
      const recent = payments
        .filter((p: any) => p?.paymentDate)
        .sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
        .slice(0, 5);
      setRecentPayments(recent);

      // Set overdue assessments
      const overdue = assessments.filter(
        (assessment: any) =>
          assessment?.status === 'unpaid' &&
          assessment?.dueDate &&
          new Date(assessment.dueDate) < new Date()
      );
      setOverdueAssessments(overdue);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
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
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Taxpayers</p>
                <p className="text-3xl font-bold mt-2">{stats.totalTaxpayers}</p>
              </div>

            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">Total Assessments</p>
                <p className="text-3xl font-bold mt-2">{stats.totalAssessments}</p>
              </div>

            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">Total Collected</p>
                <p className="text-3xl font-bold mt-2">₹{stats.totalCollected.toLocaleString('en-IN')}</p>
              </div>

            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-100">Outstanding</p>
                <p className="text-3xl font-bold mt-2">₹{stats.totalUnpaid.toLocaleString('en-IN')}</p>
              </div>

            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              Recent Payments
            </h3>
          </div>
          <div className="p-6">
            {recentPayments.length > 0 ? (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Receipt #{payment.receiptNumber}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{payment.amount?.toLocaleString('en-IN') || 0}
                      </p>
                      <p className="text-sm text-gray-500 capitalize bg-gray-200 px-2 py-1 rounded mt-1">
                        {payment.mode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <DollarSign className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">No recent payments found</p>
              </div>
            )}
          </div>
        </div>

        {/* Overdue Assessments */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Overdue Assessments
            </h3>
          </div>
          <div className="p-6">
            {overdueAssessments.length > 0 ? (
              <div className="space-y-4">
                {overdueAssessments.map((assessment) => (
                  <div key={assessment._id} className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-gray-600 mr-2" />
                          <p className="text-sm font-semibold text-gray-900">
                            {assessment.taxpayerName || 'Unknown'}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {assessment.financialYear} - {assessment.slabName}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {new Date(assessment.dueDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-red-600">
                          ₹{assessment.balance?.toLocaleString('en-IN') || 0}
                        </p>
                        <p className="text-sm text-red-500 capitalize bg-red-200 px-2 py-1 rounded mt-1">
                          {assessment.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <AlertCircle className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">No overdue assessments found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
