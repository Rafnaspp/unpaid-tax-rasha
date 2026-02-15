'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Taxpayer, Assessment, Payment, Reminder } from '@/types';
import { mockTaxpayers, mockAssessments, mockPayments, mockReminders } from '@/data/mockData';

interface AppState {
  taxpayers: Taxpayer[];
  assessments: Assessment[];
  payments: Payment[];
  reminders: Reminder[];
  receiptCounter: number;
}

interface AppContextType {
  state: AppState;
  addTaxpayer: (taxpayer: Omit<Taxpayer, 'id'>) => void;
  updateTaxpayer: (id: string, updates: Partial<Taxpayer>) => void;
  deleteTaxpayer: (id: string) => void;
  addAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt'>) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => string;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    taxpayers: mockTaxpayers,
    assessments: mockAssessments,
    payments: mockPayments,
    reminders: mockReminders,
    receiptCounter: 4
  });

  const addTaxpayer = (taxpayer: Omit<Taxpayer, 'id'>) => {
    const newTaxpayer: Taxpayer = {
      ...taxpayer,
      id: Date.now().toString()
    };
    setState(prev => ({
      ...prev,
      taxpayers: [...prev.taxpayers, newTaxpayer]
    }));
  };

  const updateTaxpayer = (id: string, updates: Partial<Taxpayer>) => {
    setState(prev => ({
      ...prev,
      taxpayers: prev.taxpayers.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  };

  const deleteTaxpayer = (id: string) => {
    setState(prev => ({
      ...prev,
      taxpayers: prev.taxpayers.filter(t => t.id !== id)
    }));
  };

  const addAssessment = (assessment: Omit<Assessment, 'id' | 'createdAt'>) => {
    const newAssessment: Assessment = {
      ...assessment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({
      ...prev,
      assessments: [...prev.assessments, newAssessment]
    }));
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setState(prev => ({
      ...prev,
      assessments: prev.assessments.map(a => 
        a.id === id ? { ...a, ...updates } : a
      )
    }));
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'receiptNumber'>): string => {
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(state.receiptCounter).padStart(4, '0')}`;
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      receiptNumber
    };

    setState(prev => {
      const updatedAssessments = prev.assessments.map(a => {
        if (a.id === payment.assessmentId) {
          const newPaidAmount = a.paidAmount + payment.amount;
          const newBalance = a.totalAmount - newPaidAmount;
          return {
            ...a,
            paidAmount: newPaidAmount,
            balance: Math.max(0, newBalance),
            status: newBalance === 0 ? 'paid' as const : newBalance < a.totalAmount ? 'partially_paid' as const : 'unpaid' as const
          };
        }
        return a;
      });

      return {
        ...prev,
        assessments: updatedAssessments,
        payments: [...prev.payments, newPayment],
        receiptCounter: prev.receiptCounter + 1
      };
    });

    return receiptNumber;
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString()
    };
    setState(prev => ({
      ...prev,
      reminders: [...prev.reminders, newReminder]
    }));
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => 
        r.id === id ? { ...r, ...updates } : r
      )
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      addTaxpayer,
      updateTaxpayer,
      deleteTaxpayer,
      addAssessment,
      updateAssessment,
      addPayment,
      addReminder,
      updateReminder
    }}>
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
