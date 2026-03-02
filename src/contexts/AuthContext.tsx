'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  name?: string;
  businessName?: string;
  ward?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check current path to determine which user type to check for
    const currentPath = window.location.pathname;
    const isAdminRoute = currentPath.startsWith('/admin');
    const isTaxpayerRoute = currentPath.startsWith('/taxpayer');
    
    // Check localStorage based on current route
    let storedUser = null;
    let storedRole = null;
    
    if (isAdminRoute) {
      // Check for admin info
      const adminInfo = localStorage.getItem('admin-info');
      if (adminInfo) {
        storedUser = adminInfo;
        storedRole = 'admin';
      }
    } else if (isTaxpayerRoute) {
      // Check for taxpayer info
      const taxpayerInfo = localStorage.getItem('taxpayer-info');
      if (taxpayerInfo) {
        storedUser = taxpayerInfo;
        storedRole = 'taxpayer';
      }
    } else {
      // For other routes, check general user info
      storedUser = localStorage.getItem('user');
      storedRole = localStorage.getItem('role');
    }
    
    if (storedUser && storedRole) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('admin-info');
        localStorage.removeItem('taxpayer-info');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Try admin login first
      if (username === 'admin') {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
          const user = data.user;
          
          // Store admin info in localStorage
          localStorage.setItem('admin-info', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role);
          
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
      } else {
        // Try taxpayer login
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
          const user = data.user;
          
          // Store taxpayer info in localStorage
          localStorage.setItem('taxpayer-info', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role);
          
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    // Clear all localStorage keys
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('admin-info');
    localStorage.removeItem('taxpayer-info');
    
    // Clear cookies (in case they exist)
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    document.cookie = 'user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
