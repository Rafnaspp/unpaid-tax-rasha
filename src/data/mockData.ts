import { Taxpayer, Assessment, Payment, Reminder } from '@/types';

export const mockTaxpayers: Taxpayer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    address: '123 Main St, City, State 12345',
    profession: 'Doctor',
    registrationDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State 12345',
    profession: 'Lawyer',
    registrationDate: '2023-02-20'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    phone: '+1234567892',
    address: '789 Pine Rd, City, State 12345',
    profession: 'Engineer',
    registrationDate: '2023-03-10'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1234567893',
    address: '321 Elm St, City, State 12345',
    profession: 'Architect',
    registrationDate: '2023-04-05'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.w@email.com',
    phone: '+1234567894',
    address: '654 Maple Dr, City, State 12345',
    profession: 'Accountant',
    registrationDate: '2023-05-12'
  }
];

export const mockAssessments: Assessment[] = [
  {
    id: '1',
    taxpayerId: '1',
    assessmentYear: '2023-2024',
    totalAmount: 5000,
    paidAmount: 2000,
    balance: 3000,
    dueDate: '2024-03-31',
    status: 'partially_paid',
    createdAt: '2023-04-01'
  },
  {
    id: '2',
    taxpayerId: '2',
    assessmentYear: '2023-2024',
    totalAmount: 6000,
    paidAmount: 6000,
    balance: 0,
    dueDate: '2024-03-31',
    status: 'paid',
    createdAt: '2023-04-01'
  },
  {
    id: '3',
    taxpayerId: '3',
    assessmentYear: '2023-2024',
    totalAmount: 4500,
    paidAmount: 0,
    balance: 4500,
    dueDate: '2024-03-31',
    status: 'unpaid',
    createdAt: '2023-04-01'
  },
  {
    id: '4',
    taxpayerId: '4',
    assessmentYear: '2023-2024',
    totalAmount: 5500,
    paidAmount: 1000,
    balance: 4500,
    dueDate: '2024-02-28',
    status: 'partially_paid',
    createdAt: '2023-04-01'
  },
  {
    id: '5',
    taxpayerId: '5',
    assessmentYear: '2023-2024',
    totalAmount: 4000,
    paidAmount: 0,
    balance: 4000,
    dueDate: '2024-01-31',
    status: 'unpaid',
    createdAt: '2023-04-01'
  },
  {
    id: '6',
    taxpayerId: '1',
    assessmentYear: '2024-2025',
    totalAmount: 5200,
    paidAmount: 0,
    balance: 5200,
    dueDate: '2025-03-31',
    status: 'unpaid',
    createdAt: '2024-04-01'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    assessmentId: '1',
    amount: 2000,
    paymentDate: '2024-01-15',
    receiptNumber: 'RCP-2024-0001',
    method: 'Credit Card'
  },
  {
    id: '2',
    assessmentId: '2',
    amount: 6000,
    paymentDate: '2024-03-15',
    receiptNumber: 'RCP-2024-0002',
    method: 'Bank Transfer'
  },
  {
    id: '3',
    assessmentId: '4',
    amount: 1000,
    paymentDate: '2024-02-10',
    receiptNumber: 'RCP-2024-0003',
    method: 'Cash'
  }
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    assessmentId: '5',
    taxpayerId: '5',
    generatedDate: '2024-02-01',
    dueDate: '2024-01-31',
    amount: 4000,
    status: 'sent'
  },
  {
    id: '2',
    assessmentId: '4',
    taxpayerId: '4',
    generatedDate: '2024-02-15',
    dueDate: '2024-02-28',
    amount: 4500,
    status: 'pending'
  }
];

export const hardcodedCredentials = {
  admin: {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin' as const
  },
  taxpayer: {
    username: 'taxpayer',
    password: 'tax123',
    name: 'John Taxpayer',
    role: 'taxpayer' as const
  }
};
