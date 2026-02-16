'use client';

import React, { useState, useEffect } from 'react';
import TaxpayerLayout from '@/components/Layout/TaxpayerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Download } from 'lucide-react';

interface Payment {
  _id: string;
  amount: number;
  paymentDate: string;
  mode: string;
  receiptNumber: string;
  assessmentId?: {
    _id: string;
    financialYear: string;
    amount: number;
  } | null;
}

interface User {
  _id: string;
  name: string;
  businessName: string;
  ward: string;
}

export default function TaxpayerPaymentsPage() {
  const { user } = useAuth();
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
      console.error('Error fetching payments:', error);
      setError('Failed to load payment data');
    } finally {
      setIsLoading(false);
    }
  };

  const printReceipt = (payment: Payment) => {
    const receiptContent = `
PROFESSIONAL TAX PAYMENT RECEIPT

Receipt Number: ${payment.receiptNumber}
Payment Date: ${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
Taxpayer: ${userInfo?.name || 'N/A'}
Business: ${userInfo?.businessName || 'N/A'}

Payment Details:
- Assessment: ${payment.assessmentId?.financialYear || 'N/A'}
- Amount Paid: $${(payment.amount || 0).toLocaleString()}
- Payment Method: ${payment.mode || 'N/A'}

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

  // Safe calculations with fallbacks
  const totalPaid = payments.reduce(
    (sum: number, payment: Payment) => sum + (payment?.amount || 0),
    0
  );

  // Loading state
  if (isLoading) {
    return (
      <TaxpayerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading payments...</div>
        </div>
      </TaxpayerLayout>
    );
  }

  return (
    <TaxpayerLayout>
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
              <div className="text-3xl font-bold text-blue-600">{payments.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Payments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalPaid.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Amount Paid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {payments.length > 0 ? Math.round(totalPaid / payments.length).toLocaleString() : '0'}
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
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{payment.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.assessmentId?.financialYear || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.mode || 'N/A'}
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {error || 'No payments found'}
                  </td>
                </tr>
              )}
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
                {['online', 'cash', 'cheque', 'bank_transfer'].map((method) => {
                  const methodPayments = payments.filter(p => p?.mode === method);
                  const methodTotal = methodPayments.reduce(
                    (sum: number, p: Payment) => sum + (p?.amount || 0),
                    0
                  );
                  return (
                    <div key={method} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{method.replace('_', ' ')}:</span>
                      <span className="font-medium">${methodTotal.toLocaleString()} ({methodPayments.length})</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {payments
                  .sort((a, b) => {
                    const dateA = a?.paymentDate ? new Date(a.paymentDate).getTime() : 0;
                    const dateB = b?.paymentDate ? new Date(b.paymentDate).getTime() : 0;
                    return dateB - dateA;
                  })
                  .slice(0, 3)
                  .map((payment) => (
                    <div key={payment._id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">#{payment.receiptNumber}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(payment.amount || 0).toLocaleString()}</div>
                        <div className="text-gray-500">
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <FileText className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </TaxpayerLayout>
  );
}
