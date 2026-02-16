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

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/taxpayers', label: 'Taxpayers', icon: Users },
    { href: '/admin/assessments', label: 'Assessments', icon: FileText },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    // { href: '/admin/unpaid', label: 'Unpaid/Overdue', icon: BarChart3 },
    { href: '/admin/reminders', label: 'Reminders', icon: Bell },
  ];

  const taxpayerMenuItems = [
    { href: '/taxpayer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/taxpayer/assessments', label: 'My Assessments', icon: FileText },
    { href: '/taxpayer/payments', label: 'Payment History', icon: CreditCard },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : taxpayerMenuItems;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">ProfTax Tracker</h1>
        <p className="text-sm text-gray-400 mt-1">Professional Tax Management</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="border-t border-gray-700 pt-4">
          <div className="mb-4">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
