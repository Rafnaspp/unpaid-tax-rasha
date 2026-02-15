'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { useApp } from '@/contexts/AppContext';
import { Bell, Download, AlertTriangle } from 'lucide-react';

export default function UnpaidPage() {
  const { state, addReminder } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'upcoming'>('all');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  const getTaxpayerName = (taxpayerId: string) => {
    const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
    return taxpayer?.name || 'Unknown';
  };

  const getTaxpayerEmail = (taxpayerId: string) => {
    const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
    return taxpayer?.email || '';
  };

  const getTaxpayerAddress = (taxpayerId: string) => {
    const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
    return taxpayer?.address || '';
  };

  const unpaidAssessments = state.assessments.filter(a => a.balance > 0);
  
  const filteredAssessments = unpaidAssessments.filter(assessment => {
    const dueDate = new Date(assessment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filterStatus === 'overdue') {
      return dueDate < today;
    } else if (filterStatus === 'upcoming') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return dueDate >= today && dueDate <= thirtyDaysFromNow;
    }
    return true;
  });

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const generateReminder = (assessment: any) => {
    setSelectedAssessment(assessment);
    setShowReminderModal(true);
  };

  const createReminder = () => {
    if (!selectedAssessment) return;

    addReminder({
      assessmentId: selectedAssessment.id,
      taxpayerId: selectedAssessment.taxpayerId,
      generatedDate: new Date().toISOString().split('T')[0],
      dueDate: selectedAssessment.dueDate,
      amount: selectedAssessment.balance,
      status: 'sent'
    });

    setShowReminderModal(false);
    setSelectedAssessment(null);
  };

  const printReminder = () => {
    if (!selectedAssessment) return;
    
    const taxpayer = state.taxpayers.find(t => t.id === selectedAssessment.taxpayerId);
    const reminderContent = `
PROFESSIONAL TAX REMINDER NOTICE

Date: ${new Date().toLocaleDateString()}
Taxpayer: ${taxpayer?.name}
Address: ${taxpayer?.address}
Email: ${taxpayer?.email}

Assessment Details:
- Assessment Year: ${selectedAssessment.assessmentYear}
- Outstanding Amount: $${selectedAssessment.balance.toLocaleString()}
- Due Date: ${new Date(selectedAssessment.dueDate).toLocaleDateString()}
- Status: ${isOverdue(selectedAssessment.dueDate) ? 'OVERDUE' : 'DUE SOON'}

Please make your payment as soon as possible to avoid penalties.
Payment methods available: Online portal, Bank transfer, Cash, Check

Contact Information:
Tax Office: +1-234-567-8900
Email: taxoffice@example.com
Website: www.proftax.example.com

This is an automated reminder. Please disregard if payment has already been made.
    `.trim();

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Tax Reminder Notice</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { text-align: center; color: #333; }
              .notice { border: 2px solid #333; padding: 20px; margin: 20px 0; }
              .overdue { color: #d00; font-weight: bold; }
            </style>
          </head>
          <body>
            <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${reminderContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Unpaid & Overdue Assessments</h1>
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-lg shadow">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All ({unpaidAssessments.length})
              </button>
              <button
                onClick={() => setFilterStatus('overdue')}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === 'overdue'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overdue ({unpaidAssessments.filter(a => isOverdue(a.dueDate)).length})
              </button>
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  filterStatus === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Due Soon (30 days)
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${unpaidAssessments.filter(a => isOverdue(a.dueDate)).reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Soon (30 days)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${filteredAssessments.filter(a => !isOverdue(a.dueDate)).reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reminders Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {state.reminders.filter(r => r.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Overdue
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
              {filteredAssessments.map((assessment) => {
                const overdue = isOverdue(assessment.dueDate);
                const daysOverdue = overdue ? Math.floor((new Date().getTime() - new Date(assessment.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <tr key={assessment.id} className={overdue ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getTaxpayerName(assessment.taxpayerId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assessment.assessmentYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${assessment.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assessment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {overdue ? (
                        <span className="text-red-600 font-medium">{daysOverdue} days</span>
                      ) : (
                        <span className="text-green-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        overdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {overdue ? 'Overdue' : 'Due Soon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => generateReminder(assessment)}
                        className="flex items-center px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                      >
                        <Bell className="w-4 h-4 mr-1" />
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reminder Modal */}
        {showReminderModal && selectedAssessment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Reminder</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Taxpayer: {getTaxpayerName(selectedAssessment.taxpayerId)}</p>
                  <p className="text-sm text-gray-600">Email: {getTaxpayerEmail(selectedAssessment.taxpayerId)}</p>
                  <p className="text-sm text-gray-600">Assessment Year: {selectedAssessment.assessmentYear}</p>
                  <p className="text-sm text-gray-600">Outstanding Amount: ${selectedAssessment.balance.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Due Date: {new Date(selectedAssessment.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowReminderModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={printReminder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Print Notice
                  </button>
                  <button
                    onClick={createReminder}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
