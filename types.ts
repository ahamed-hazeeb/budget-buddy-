export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string; // ISO Date string
  amount: number;
  category: string;
  account: string;
  type: TransactionType;
  note?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  sendEmail: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Card' | 'Other';
  balance: number;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}