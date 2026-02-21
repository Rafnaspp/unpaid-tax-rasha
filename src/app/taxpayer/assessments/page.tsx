'use client';

import React, { useState, useEffect } from 'react';
import TaxpayerLayout from '@/components/Layout/TaxpayerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard } from 'lucide-react';
import { createOrder, createRazorpayPayment, verifyPayment } from '@/utils/razorpay';

interface Assessment {
  _id: string;
  taxpayerId: string;
  financialYear: string;
  slabName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
  refundedAmount?: number;
}

export default function TaxpayerAssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchAssessments();
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`/api/user/assessments?userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setAssessments(data.assessments);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handlePayment = async (assessment: Assessment) => {
    if (!assessment.balance || assessment.balance <= 0) return;

    setSelectedAssessment(assessment);
    setPaymentAmount(assessment.balance.toString());
    setShowPaymentModal(true);
  };

  const handleOnlinePayment = async () => {
    if (!selectedAssessment || !paymentAmount) return;

    try {
      setIsLoading(true);
      setError('');

      // Create Razorpay order
      const orderResponse = await createOrder(selectedAssessment._id);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      // Initiate Razorpay payment
      await createRazorpayPayment({
        key: 'rzp_test_SGXNcfSszwWDa0', // Use environment variable in production
        amount: Number(paymentAmount) * 100, // Convert to paise
        currency: 'INR',
        name: 'Professional Tax Payment',
        description: `Payment for ${selectedAssessment.financialYear} - ${selectedAssessment.slabName}`,
        order_id: orderResponse.order.id,
        handler: {
          onPaymentSuccess: async (response: any) => {
            try {
              // Verify payment
              const verificationResponse = await verifyPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
                selectedAssessment._id
              );

              if (verificationResponse.success) {
                setReceiptData(verificationResponse.payment);
                setShowReceiptModal(true);
                setShowPaymentModal(false);
                await fetchAssessments(); // Refresh assessments
              } else {
                setError('Payment verification failed');
              }
            } catch (error) {
              setError('Payment verification failed');
            } finally {
              setIsLoading(false);
            }
          },
          onPaymentError: (error: any) => {
            setError('Payment failed. Please try again.');
            setIsLoading(false);
          },
        },
        theme: {
          color: '#14b8a6', // teal-600
        },
      });
    } catch (error) {
      setError('Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Partially Paid':
        return 'bg-amber-100 text-amber-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TaxpayerLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">My Assessments</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Assessed</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{assessments.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{assessments.reduce((sum, a) => sum + a.paidAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Outstanding Balance</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{assessments.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Assessment Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Financial Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Slab
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Refunded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {assessments.map((assessment) => (
                  <tr key={assessment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {assessment.financialYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {assessment.slabName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ₹{assessment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ₹{assessment.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ₹{(assessment.refundedAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ₹{assessment.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assessment.status)}`}>
                        {assessment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assessment.balance > 0 && (
                        <button
                          onClick={() => handlePayment(assessment)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Make Payment</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Financial Year</p>
                  <p className="font-medium text-slate-900">{selectedAssessment.financialYear}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Slab</p>
                  <p className="font-medium text-slate-900">{selectedAssessment.slabName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Outstanding Balance</p>
                  <p className="font-medium text-slate-900">₹{selectedAssessment.balance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Amount
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={selectedAssessment.balance}
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleOnlinePayment}
                  disabled={isLoading || !paymentAmount || Number(paymentAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Pay Online'}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && receiptData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Receipt</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Receipt Number:</span>
                  <span className="font-medium">{receiptData.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount Paid:</span>
                  <span className="font-medium">₹{receiptData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Date:</span>
                  <span className="font-medium">{new Date(receiptData.paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Mode:</span>
                  <span className="font-medium capitalize">{receiptData.mode}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={printReceipt}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TaxpayerLayout>
  );
}
