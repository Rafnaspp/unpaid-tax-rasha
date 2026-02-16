'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { AlertTriangle, Calendar, Filter } from 'lucide-react';

interface Assessment {
  _id: string;
  taxpayerId: {
    _id: string;
    name: string;
    businessName: string;
  };
  taxpayerName: string;
  financialYear: string;
  slabName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'unpaid' | 'partially_paid' | 'paid';
}

export default function UnpaidPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/assessments');
      const data = await response.json();
      if (data.success) {
        setAssessments(data.assessments || []);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setError('Failed to fetch assessments');
    } finally {
      setIsLoading(false);
    }
  };

  const sendReminder = async (assessmentId: string) => {
    try {
      const response = await fetch('/api/admin/reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taxpayerId: assessments.find(a => a._id === assessmentId)?.taxpayerId?._id || '',
          assessmentId,
          message: 'Your professional tax payment is overdue. Please pay immediately to avoid penalties.'
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Reminder sent successfully');
      } else {
        alert('Failed to send reminder');
      }
    } catch (error) {
      alert('Error sending reminder');
    }
  };

  // Safe filtering with fallbacks
  const filteredAssessments = assessments.filter(assessment => {
    if (!assessment) return false;
    switch (filter) {
      case 'overdue':
        return assessment.status === 'unpaid' && assessment.dueDate && new Date(assessment.dueDate) < new Date();
      case 'unpaid':
        return assessment.status === 'unpaid';
      case 'partial':
        return assessment.status === 'partially_paid';
      default:
        return true;
    }
  });

  // Safe calculations with fallbacks
  const totalOutstanding = filteredAssessments.reduce(
    (sum: number, assessment: Assessment) => sum + (assessment?.balance || 0),
    0
  );

  const overdueCount = filteredAssessments.filter(
    a => a?.status === 'unpaid' && a?.dueDate && new Date(a.dueDate) < new Date()
  ).length;

  const partialPaymentCount = filteredAssessments.filter(
    a => a?.status === 'partially_paid'
  ).length;

  if (isLoading && assessments.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading unpaid assessments...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Unpaid & Overdue Assessments</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">

              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Partial Payments</p>
                <p className="text-2xl font-bold text-gray-900">{partialPaymentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Filter className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredAssessments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({assessments.length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'overdue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setFilter('unpaid')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'unpaid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Unpaid ({assessments.filter(a => a?.status === 'unpaid').length})
            </button>

          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Assessments</h3>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxpayer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slab
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((assessment) => {
                    const isOverdue = assessment.status === 'unpaid' && assessment.dueDate && new Date(assessment.dueDate) < new Date();

                    return (
                      <tr key={assessment._id} className={isOverdue ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assessment.taxpayerName || assessment.taxpayerId?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.financialYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.slabName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(assessment.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(assessment.paidAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{(assessment.balance || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assessment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : assessment.status === 'partially_paid'
                                ? 'bg-yellow-100 text-yellow-800'
                                : isOverdue
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                            {assessment.status === 'paid' ? 'Paid' :
                              assessment.status === 'partially_paid' ? 'Partial' :
                                isOverdue ? 'OVERDUE' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {assessment.status !== 'paid' && (
                            <button
                              onClick={() => sendReminder(assessment._id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      {error || 'No assessments found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
