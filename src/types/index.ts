export interface User {
  id: string;
  username: string;
  role: 'admin' | 'taxpayer';
  name: string;
}

export interface Taxpayer {
  id: string;
  name: string;
  username: string;
  phone: string;
  address: string;
  profession: string;
  registrationDate: string;
}

export interface Assessment {
  id: string;
  taxpayerId: string;
  assessmentYear: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partially_paid' | 'unpaid';
  createdAt: string;
}

export interface Payment {
  id: string;
  assessmentId: string;
  amount: number;
  paymentDate: string;
  receiptNumber: string;
  method: string;
}

export interface Reminder {
  id: string;
  assessmentId: string;
  taxpayerId: string;
  generatedDate: string;
  dueDate: string;
  amount: number;
  status: 'sent' | 'pending';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
