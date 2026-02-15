'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Professional Tax Tracker</h1>
          <p className="text-xl text-slate-600">Unpaid Professional Tax Management System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Login Card */}
          <div className="bg-white shadow-lg border border-slate-200 rounded-none p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-none mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin / Staff</h2>
              <p className="text-slate-600">System Administration</p>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-2">Access Features:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Taxpayer Management</li>
                  <li>• Assessment Creation</li>
                  <li>• Payment Processing</li>
                  <li>• Report Generation</li>
                  <li>• System Administration</li>
                </ul>
              </div>
              
              <Link
                href="/admin/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>

          {/* Taxpayer Login Card */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-teal-100 hover:shadow-2xl transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl mb-4 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Taxpayer</h2>
              <p className="text-teal-600 font-medium">Citizen Portal</p>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-2">Access Features:</p>
                <ul className="space-y-1 text-xs">
                  <li>• View Your Assessments</li>
                  <li>• Make Online Payments</li>
                  <li>• Download Receipts</li>
                  <li>• Payment History</li>
                  <li>• Account Management</li>
                </ul>
              </div>
              
              <Link
                href="/taxpayer/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Taxpayer Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Select your role above to access the appropriate portal
          </p>
        </div>
      </div>
    </div>
  );
}
