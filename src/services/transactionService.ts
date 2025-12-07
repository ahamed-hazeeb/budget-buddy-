import apiClient from '../api/client';
import { Transaction } from '../types';
import { getUserId } from '../utils/auth';

export interface CreateTransactionData {
  date: string;
  amount: number;
  category_id: number;
  account_id: number;
  type: 'INCOME' | 'EXPENSE' | 'income' | 'expense';
  note?: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string;
}

const transactionService = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    const userId = getUserId();
    const response = await apiClient.get<Transaction[]>(`/transactions/${userId}`);
    return response.data;
  },

  // Get transaction by ID
  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  // Create transaction
  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', {
      ...data,
      user_id: getUserId()
    });
    return response.data;
  },

  // Update transaction
  update: async (id: string, data: Partial<CreateTransactionData>): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  // Delete transaction
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  // Get transactions by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Transaction[]> => {
    const userId = getUserId();
    const response = await apiClient.get<Transaction[]>(`/transactions/${userId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get transactions by type
  getByType: async (type: 'INCOME' | 'EXPENSE'): Promise<Transaction[]> => {
    const userId = getUserId();
    const response = await apiClient.get<Transaction[]>(`/transactions/${userId}`, {
      params: { type }
    });
    return response.data;
  },
};

export default transactionService;
