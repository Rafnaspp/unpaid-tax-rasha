'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

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
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Taxpayers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTaxpayers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
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
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalCollected.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalUnpaid.toLocaleString()}</p>
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
                        {payment.amount?.toLocaleString() || 0}
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
                        {assessment.balance?.toLocaleString() || 0}
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
