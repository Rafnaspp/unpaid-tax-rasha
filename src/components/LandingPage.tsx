'use client';

import React from 'react';
import PublicLayout from '@/components/Layout/PublicLayout';
import Link from 'next/link';
import { ArrowRight, Users, FileText, Shield, CreditCard } from 'lucide-react';

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50">
        {/* Hero Section */}
        <div className="relative pt-16 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                  Professional Tax
                  <span className="block text-teal-600">Payment Portal</span>
                </h1>
                <p className="mt-6 text-lg text-slate-600">
                  Easy and secure online portal for managing your professional tax assessments,
                  making payments, and tracking your tax history. Designed specifically for taxpayers.
                </p>
                <div className="mt-8">
                  <Link
                    href="/taxpayer/login"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg transition-all transform hover:scale-[1.02]"
                  >
                    Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <img
                  src="/taxImage.jpg"
                  alt="Professional Tax Payment Portal"
                  className="w-full max-w-sm h-auto rounded-2xl shadow-2xl mx-auto"
                />
             
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Your Tax Management Made Simple
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need to manage your professional taxes in one convenient portal
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* View Assessments */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">View Assessments</h3>
                <p className="text-slate-600">
                  Access all your tax assessments, view detailed breakdowns, and track payment status in real-time.
                </p>
              </div>

              {/* Make Payments */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Pay Online</h3>
                <p className="text-slate-600">
                  Secure online payment processing with instant confirmation and downloadable receipts.
                </p>
              </div>

              {/* Track History */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Payment History</h3>
                <p className="text-slate-600">
                  Complete record of all your tax payments with receipts and transaction details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Choose Our Portal?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Designed with taxpayers in mind for a seamless experience
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Private</h3>
                  <p className="text-slate-600">
                    Your tax information is protected with enterprise-grade security and encryption.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Receipts</h3>
                  <p className="text-slate-600">
                    Get immediate confirmation and downloadable receipts for all your payments.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Multiple Payment Options</h3>
                  <p className="text-slate-600">
                    Choose from various payment methods for your convenience.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">24/7 Access</h3>
                  <p className="text-slate-600">
                    Manage your taxes anytime, anywhere with our always-available portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Manage Your Taxes?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Log in to access your personalized tax dashboard and manage your payments
            </p>
            <div className="flex justify-center">
              <Link
                href="/taxpayer/login"
                className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-xl transition-all transform hover:scale-[1.05]"
              >
                <Users className="mr-2 h-5 w-5" />
                Login to Your Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Stock Image Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
