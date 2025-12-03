import { Transaction, TransactionType, Budget, Goal, Reminder, Account, MonthlySummary } from '../types';

// NOTE: To connect to your real Node.js/Express backend:
// 1. Install axios: npm install axios
// 2. Replace the return statements with axios calls, e.g.:
//    const response = await axios.get('http://localhost:3000/api/transactions');
//    return response.data;

// Mock Data matching PDF Screenshots
let transactions: Transaction[] = [
  { id: '1', date: '2025-03-16', amount: 755, category: 'Business', account: 'Cash', type: TransactionType.INCOME, note: 'Logo Design' },
  { id: '2', date: '2025-03-16', amount: 8000, category: 'Business', account: 'Bank', type: TransactionType.INCOME, note: 'Design Project' },
  { id: '3', date: '2025-03-16', amount: 8000, category: 'Business', account: 'Bank', type: TransactionType.INCOME, note: 'OCR Project' },
  { id: '4', date: '2025-03-16', amount: 1500, category: 'Travel', account: 'Cash', type: TransactionType.EXPENSE, note: 'Bus Fare' },
  { id: '5', date: '2025-03-12', amount: 1000, category: 'Bonus', account: 'Bank', type: TransactionType.INCOME, note: 'Yearly Bonus' },
  { id: '6', date: '2025-02-10', amount: 5500, category: 'Groceries', account: 'Card', type: TransactionType.EXPENSE, note: 'Supermarket' },
];

let budgets: Budget[] = [
  { id: '1', category: 'Overall', limit: 35556.88, spent: 19255, startDate: '2025-03-01', endDate: '2025-03-31' },
  { id: '2', category: 'Food', limit: 15000, spent: 12500, startDate: '2025-03-01', endDate: '2025-03-31' },
];

let goals: Goal[] = [
  { id: '1', name: 'Vacation', targetAmount: 150000, currentAmount: 41000, targetDate: '2025-12-31', monthlyContribution: 5000 },
  { id: '2', name: 'Laptop', targetAmount: 250000, currentAmount: 50000, targetDate: '2025-09-30', monthlyContribution: 10000 },
];

const reminders: Reminder[] = [
  { id: '1', title: 'Electricity Bill', dueDate: '2025-03-29', amount: 5000, isPaid: false },
  { id: '2', title: 'Internet Bill', dueDate: '2025-03-25', amount: 3500, isPaid: false },
];

const accounts: Account[] = [
  { id: '1', name: 'Cash', type: 'Cash', balance: 8346.94 },
  { id: '2', name: 'Card', type: 'Card', balance: 9500.00 },
  { id: '3', name: 'Savings', type: 'Bank', balance: 1000.00 },
];

export const ApiService = {
  getSummary: async (): Promise<MonthlySummary> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      income: 739000,
      expenses: 403930,
      balance: 138790
    };
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...transactions];
  },

  addTransaction: async (txn: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const newTxn = { ...txn, id: Math.random().toString(36).substr(2, 9) };
    transactions = [newTxn, ...transactions];
    return newTxn;
  },

  getBudgets: async (): Promise<Budget[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...budgets];
  },

  getGoals: async (): Promise<Goal[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...goals];
  },

  getReminders: async (): Promise<Reminder[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...reminders];
  },
  
  getAccounts: async (): Promise<Account[]> => {
    return [...accounts];
  },

  // Simulates the Machine Learning Endpoint for Budget Prediction
  predictBudget: async (income: number): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate ML processing time
    // Logic based on PDF: Suggests ~70-80% of income or based on past spending
    return Math.floor(income * 0.45); 
  }
};
