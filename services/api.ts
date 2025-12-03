
import { Transaction, TransactionType, Budget, Goal, Reminder, Account, MonthlySummary, User, AuthResponse } from '../types';

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

let reminders: Reminder[] = [
  { id: '1', title: 'Electricity Bill', dueDate: '2025-03-29', amount: 5000, isPaid: false, sendEmail: true },
  { id: '2', title: 'Internet Bill', dueDate: '2025-03-25', amount: 3500, isPaid: false, sendEmail: false },
];

let accounts: Account[] = [
  { id: '1', name: 'Cash', type: 'Cash', balance: 8346.94 },
  { id: '2', name: 'Card', type: 'Card', balance: 9500.00 },
  { id: '3', name: 'Savings', type: 'Bank', balance: 1000.00 },
];

// Mock User Data
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

export const ApiService = {
  // Authentication
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate net lag
    // In a real app, validate credentials with backend
    if (email && password) {
      return {
        user: { ...MOCK_USER, email }, // Return mock user with the entered email for demo
        token: 'mock-jwt-token-12345'
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      user: { id: Math.random().toString(), name, email },
      token: 'mock-jwt-token-new-user'
    };
  },

  // Dashboard Data
  getSummary: async (): Promise<MonthlySummary> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Using mock balance from accounts + income - expense calculation is tricky in mocks 
    // without full state history, so we'll approximate or use the hardcoded PDF values 
    // if not dynamic, but here let's make it somewhat dynamic based on accounts:
    const currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      income: 739000, // Hardcoded from PDF for visual consistency
      expenses: 403930, 
      balance: currentBalance // Dynamic based on accounts
    };
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...transactions];
  },

  addTransaction: async (txn: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const newTxn = { ...txn, id: Math.random().toString(36).substr(2, 9) };
    transactions = [newTxn, ...transactions];
    
    // Update account balance
    const accIndex = accounts.findIndex(a => a.name === txn.account);
    if (accIndex >= 0) {
        if (txn.type === TransactionType.INCOME) {
            accounts[accIndex].balance += txn.amount;
        } else {
            accounts[accIndex].balance -= txn.amount;
        }
    }
    
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

  addReminder: async (reminder: Omit<Reminder, 'id' | 'isPaid'>): Promise<Reminder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newReminder = { 
        ...reminder, 
        id: Math.random().toString(36).substr(2, 9),
        isPaid: false 
    };
    reminders = [newReminder, ...reminders];
    
    if (reminder.sendEmail) {
        console.log(`[Mock Backend] Scheduling email notification for ${reminder.title} on ${reminder.dueDate}`);
    }
    
    return newReminder;
  },
  
  // Account Management
  getAccounts: async (): Promise<Account[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...accounts];
  },

  addAccount: async (account: Omit<Account, 'id'>): Promise<Account> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newAcc = { ...account, id: Math.random().toString(36).substr(2, 9) };
      accounts = [...accounts, newAcc];
      return newAcc;
  },

  deleteAccount: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      accounts = accounts.filter(a => a.id !== id);
  },

  // Machine Learning
  predictBudget: async (income: number): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.floor(income * 0.45); 
  }
};
