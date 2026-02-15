'use client';

import React from 'react';
import Layout from '@/components/Layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { Bell, Mail, CheckCircle } from 'lucide-react';

export default function RemindersPage() {
  const { state } = useApp();

  const getTaxpayerName = (taxpayerId: string) => {
    const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
    return taxpayer?.name || 'Unknown';
  };

  const getAssessmentDetails = (assessmentId: string) => {
    return state.assessments.find(a => a.id === assessmentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reminder Management</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Bell className="w-4 h-4" />
            <span>{state.reminders.length} total reminders</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reminders Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {state.reminders.filter(r => r.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {state.reminders.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount Reminded</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${state.reminders.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Reminders</h3>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxpayer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.reminders.map((reminder) => {
                  const assessment = getAssessmentDetails(reminder.assessmentId);
                  return (
                    <tr key={reminder.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getTaxpayerName(reminder.taxpayerId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assessment?.assessmentYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${reminder.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reminder.generatedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reminder.status)}`}>
                          {getStatusText(reminder.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {state.reminders
                .sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime())
                .slice(0, 5)
                .map((reminder) => (
                  <div key={reminder.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 rounded-full p-2 ${
                      reminder.status === 'sent' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {reminder.status === 'sent' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Mail className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Reminder {reminder.status === 'sent' ? 'sent to' : 'pending for'} {getTaxpayerName(reminder.taxpayerId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Amount: ${reminder.amount.toLocaleString()} • Generated: {new Date(reminder.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
