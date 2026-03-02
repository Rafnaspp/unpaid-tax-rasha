'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'taxpayer';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If still loading, don't do anything yet
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      if (requiredRole === 'admin') {
        router.push('/admin/login');
      } else if (requiredRole === 'taxpayer') {
        router.push('/taxpayer/login');
      } else {
        // Default to taxpayer login if no specific role required
        router.push('/taxpayer/login');
      }
      return;
    }

    // If authenticated but wrong role, redirect to correct login
    if (requiredRole && user?.role !== requiredRole) {
      if (requiredRole === 'admin' && user?.role !== 'admin') {
        router.push('/admin/login');
      } else if (requiredRole === 'taxpayer' && user?.role !== 'taxpayer') {
        router.push('/taxpayer/login');
      }
      return;
    }

    // Check localStorage for specific role data
    const currentPath = window.location.pathname;
    const isAdminRoute = currentPath.startsWith('/admin');
    const isTaxpayerRoute = currentPath.startsWith('/taxpayer');

    if (isAdminRoute) {
      const adminInfo = localStorage.getItem('admin-info');
      if (!adminInfo) {
        router.push('/admin/login');
        return;
      }
    } else if (isTaxpayerRoute) {
      const taxpayerInfo = localStorage.getItem('taxpayer-info');
      if (!taxpayerInfo) {
        router.push('/taxpayer/login');
        return;
      }
    }

  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If wrong role, don't render children (will redirect)
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
