'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  FileText,
  CreditCard,
  LogOut,
  User
} from 'lucide-react';

interface TaxpayerLayoutProps {
  children: React.ReactNode;
}

const TaxpayerHeader = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/taxpayer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/taxpayer/assessments', label: 'My Assessments', icon: FileText },
    { href: '/taxpayer/payments', label: 'Payment History', icon: CreditCard },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-teal-600">Taxpayer Portal</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">Taxpayer</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function TaxpayerLayout({ children }: TaxpayerLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <TaxpayerHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
