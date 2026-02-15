'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  Users,
  FileText,
  CreditCard,
  Bell,
  LogOut,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/taxpayers', label: 'Taxpayers', icon: Users },
    { href: '/admin/assessments', label: 'Assessments', icon: FileText },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/unpaid', label: 'Unpaid/Overdue', icon: BarChart3 },
    { href: '/admin/reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white h-screen fixed left-0 top-0 border-r border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Professional Tax System</h1>
        <p className="text-xs text-slate-400 mt-1">Administration Portal</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
        <div className="mb-4">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wide">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded transition-colors text-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Admin Dashboard
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Professional Tax Management System
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-slate-400 mt-1">System Time</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
