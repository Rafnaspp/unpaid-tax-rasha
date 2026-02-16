'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  username: string;
  businessName: string;
  ward: string;
  role: string;
}

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
  taxpayerId?: {
    name: string;
    businessName: string;
  };
}

interface Payment {
  _id: string;
  assessmentId: string;
  taxpayerId: string;
  amount: number;
  paymentDate: string;
  mode: 'online' | 'manual';
  receiptNumber: string;
  assessmentId?: {
    financialYear: string;
    amount: number;
  };
}

interface Reminder {
  _id: string;
  taxpayerId: string;
  assessmentId: string;
  reminderDate: string;
  message: string;
  taxpayerId?: {
    name: string;
    businessName: string;
  };
  assessmentId?: {
    financialYear: string;
    amount: number;
  };
}

interface AppState {
  users: User[];
  assessments: Assessment[];
  payments: Payment[];
  reminders: Reminder[];
  dashboardData: {
    totalAssessed: number;
    totalCollected: number;
    totalUnpaid: number;
    totalTaxpayers: number;
  } | null;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  // User management
  addTaxpayer: (taxpayer: Omit<User, 'id' | 'role'>) => Promise<void>;
  updateTaxpayer: (id: string, taxpayer: Partial<User>) => Promise<void>;
  deleteTaxpayer: (id: string) => Promise<void>;
  getUsers: () => Promise<void>;

  // Assessment management
  addAssessment: (assessment: Omit<Assessment, '_id' | 'paidAmount' | 'balance' | 'status'>) => Promise<void>;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => Promise<void>;
  getAssessments: () => Promise<void>;

  // Payment management
  addPayment: (payment: { assessmentId: string; amount: number; mode: 'online' | 'manual'; razorpayPaymentId?: string; razorpayOrderId?: string }) => Promise<void>;
  getPayments: () => Promise<void>;

  // Reminder management
  addReminder: (reminder: Omit<Reminder, '_id'>) => Promise<void>;
  getReminders: () => Promise<void>;

  // Dashboard
  getDashboardData: () => Promise<void>;

  // User specific data
  getUserAssessments: (userId: string) => Promise<Assessment[]>;
  getUserPayments: (userId: string) => Promise<Payment[]>;
  getUserReminders: (userId: string) => Promise<Reminder[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    assessments: [],
    taxpayers: [],
    payments: [],
    reminders: [],
    loading: false,
    error: null
  });

  // API helper function
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  };

  // User management
  const addTaxpayer = async (taxpayer: Omit<User, 'id' | 'role'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await apiCall('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ ...taxpayer, role: 'taxpayer' }),
      });
      await getUsers();
    } catch (error) {
      console.error('Add taxpayer error:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getUsers = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await apiCall('/api/admin/users');
      setState(prev => ({ ...prev, users: response.users, isLoading: false }));
    } catch (error) {
      console.error('Get users error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Assessment management
  const addAssessment = async (assessment: Omit<Assessment, '_id' | 'paidAmount' | 'balance' | 'status'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await apiCall('/api/admin/assessments', {
        method: 'POST',
        body: JSON.stringify(assessment),
      });
      await getAssessments();
    } catch (error) {
      console.error('Add assessment error:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getAssessments = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await apiCall('/api/admin/assessments');
      setState(prev => ({ ...prev, assessments: response.assessments, isLoading: false }));
    } catch (error) {
      console.error('Get assessments error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Payment management
  const addPayment = async (payment: { assessmentId: string; amount: number; mode: 'online' | 'manual'; razorpayPaymentId?: string; razorpayOrderId?: string }) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      if (payment.mode === 'manual') {
        await apiCall('/api/admin/manual-payment', {
          method: 'POST',
          body: JSON.stringify({
            assessmentId: payment.assessmentId,
            amount: payment.amount,
            mode: payment.mode,
          }),
        });
      }
      
      await getAssessments();
      await getPayments();
    } catch (error) {
      console.error('Add payment error:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getPayments = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await apiCall('/api/admin/payments');
      setState(prev => ({ ...prev, payments: response.payments || [], isLoading: false }));
    } catch (error) {
      console.error('Get payments error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Reminder management
  const addReminder = async (reminder: Omit<Reminder, '_id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await apiCall('/api/admin/reminder', {
        method: 'POST',
        body: JSON.stringify(reminder),
      });
      await getReminders();
    } catch (error) {
      console.error('Add reminder error:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getReminders = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await apiCall('/api/admin/reminders');
      setState(prev => ({ ...prev, reminders: response.reminders || [], isLoading: false }));
    } catch (error) {
      console.error('Get reminders error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Dashboard
  const getDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await apiCall('/api/admin/dashboard');
      setState(prev => ({ ...prev, dashboardData: response.data, isLoading: false }));
    } catch (error) {
      console.error('Get dashboard data error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // User specific data
  const getUserAssessments = async (userId: string): Promise<Assessment[]> => {
    try {
      const response = await apiCall(`/api/user/assessments?userId=${userId}`);
      return response.assessments || [];
    } catch (error) {
      console.error('Get user assessments error:', error);
      return [];
    }
  };

  const getUserPayments = async (userId: string): Promise<Payment[]> => {
    try {
      const response = await apiCall(`/api/user/payments?userId=${userId}`);
      return response.payments || [];
    } catch (error) {
      console.error('Get user payments error:', error);
      return [];
    }
  };

  const getUserReminders = async (userId: string): Promise<Reminder[]> => {
    try {
      const response = await apiCall(`/api/user/reminders?userId=${userId}`);
      return response.reminders || [];
    } catch (error) {
      console.error('Get user reminders error:', error);
      return [];
    }
  };

  // Placeholder functions for update/delete
  const updateTaxpayer = async (id: string, taxpayer: Partial<User>) => {
    console.log('Update taxpayer not implemented yet');
  };

  const deleteTaxpayer = async (id: string) => {
    console.log('Delete taxpayer not implemented yet');
  };

  const updateAssessment = async (id: string, assessment: Partial<Assessment>) => {
    console.log('Update assessment not implemented yet');
  };

  // Load initial data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      getUsers();
      getAssessments();
      getPayments();
      getReminders();
      getDashboardData();
    }
  }, []);

  const value: AppContextType = {
    ...state,
    addTaxpayer,
    updateTaxpayer,
    deleteTaxpayer,
    getUsers,
    addAssessment,
    updateAssessment,
    getAssessments,
    addPayment,
    getPayments,
    addReminder,
    getReminders,
    getDashboardData,
    getUserAssessments,
    getUserPayments,
    getUserReminders,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
