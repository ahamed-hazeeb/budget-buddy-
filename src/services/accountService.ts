import apiClient from '../api/client';
import { Account } from '../types';
import { getUserId } from '../utils/auth';

export interface CreateAccountData {
  name: string;
  type: 'Cash' | 'Bank' | 'Card' | 'Other';
  balance: number;
}

const accountService = {
  // Get all accounts
  getAll: async (): Promise<Account[]> => {
    const userId = getUserId();
    const response = await apiClient.get<Account[]>(`/accounts/${userId}`);
    return response.data;
  },

  // Get account by ID
  getById: async (id: string): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  // Create account
  create: async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post<Account>('/accounts', {
      ...data,
      user_id: getUserId()
    });
    return response.data;
  },

  // Update account
  update: async (id: string, data: Partial<CreateAccountData>): Promise<Account> => {
    // Backend uses /accounts/balance for balance updates
    if ('balance' in data && Object.keys(data).length === 1) {
      const response = await apiClient.put<Account>('/accounts/balance', {
        account_id: id,
        new_balance: data.balance
      });
      return response.data;
    }
    // For other updates, use the standard PUT endpoint
    const response = await apiClient.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  // Delete account
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accounts/${id}`);
  },

  // Get total balance
  getTotalBalance: async (): Promise<number> => {
    const accounts = await accountService.getAll();
    return accounts.reduce((total, account) => total + account.balance, 0);
  },
};

export default accountService;
