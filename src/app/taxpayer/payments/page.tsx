'use client';

import React from 'react';
import Layout from '@/components/Layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { FileText, Download } from 'lucide-react';

export default function TaxpayerPaymentsPage() {
  const { state } = useApp();

  // For demo purposes, we'll show data for the first taxpayer
  const taxpayerId = '1'; // John Smith's ID
  const taxpayer = state.taxpayers.find(t => t.id === taxpayerId);
  const taxpayerPayments = state.payments.filter(p => {
    const assessment = state.assessments.find(a => a.id === p.assessmentId);
    return assessment?.taxpayerId === taxpayerId;
  });

  const getAssessmentDetails = (assessmentId: string) => {
    return state.assessments.find(a => a.id === assessmentId);
  };

  const printReceipt = (payment: any) => {
    const assessment = getAssessmentDetails(payment.assessmentId);
    const receiptContent = `
PROFESSIONAL TAX PAYMENT RECEIPT

Receipt Number: ${payment.receiptNumber}
Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}
Taxpayer: ${taxpayer?.name}
Profession: ${taxpayer?.profession}

Payment Details:
- Assessment Year: ${assessment?.assessmentYear}
- Amount Paid: $${payment.amount.toLocaleString()}
- Payment Method: ${payment.method}

Payment Status: COMPLETED
Processing Date: ${new Date().toLocaleDateString()}

Thank you for your payment!
This receipt serves as proof of payment for your records.

Contact Information:
Tax Office: +1-234-567-8900
Email: taxoffice@example.com
Website: www.proftax.example.com
    `.trim();

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${payment.receiptNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { text-align: center; color: #333; }
              .receipt { border: 2px solid #333; padding: 20px; margin: 20px 0; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .footer { text-align: center; border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>PROFESSIONAL TAX PAYMENT RECEIPT</h1>
              </div>
              <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${receiptContent}</pre>
              <div class="footer">
                <p>This is an official receipt. Please keep for your records.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const totalPaid = taxpayerPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <div className="text-sm text-gray-600">
            Total Paid: <span className="text-lg font-semibold text-gray-900">${totalPaid.toLocaleString()}</span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{taxpayerPayments.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Payments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Amount Paid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ${taxpayerPayments.length > 0 ? Math.round(totalPaid / taxpayerPayments.length).toLocaleString() : '0'}
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Payment</div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxpayerPayments.map((payment) => {
                const assessment = getAssessmentDetails(payment.assessmentId);
                return (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {payment.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment?.assessmentYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => printReceipt(payment)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Payment Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Methods</h4>
              <div className="space-y-2">
                {['Credit Card', 'Bank Transfer', 'Cash', 'Check'].map((method) => {
                  const methodPayments = taxpayerPayments.filter(p => p.method === method);
                  const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
                  return (
                    <div key={method} className="flex justify-between text-sm">
                      <span className="text-gray-600">{method}:</span>
                      <span className="font-medium">${methodTotal.toLocaleString()} ({methodPayments.length})</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {taxpayerPayments
                  .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                  .slice(0, 3)
                  .map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">{payment.receiptNumber}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${payment.amount.toLocaleString()}</div>
                        <div className="text-gray-500">{new Date(payment.paymentDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
