import apiClient from '../api/client';
import { Budget } from '../types';

export interface CreateBudgetData {
  category: string;
  limit: number;
  startDate: string;
  endDate: string;
}

export interface BudgetSpendingResponse {
  budgetId: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

const budgetService = {
  // Get all budgets
  getAll: async (): Promise<Budget[]> => {
    const response = await apiClient.get<Budget[]>('/budgets');
    return response.data;
  },

  // Get budget by ID
  getById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  // Create budget
  create: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await apiClient.post<Budget>('/budgets', data);
    return response.data;
  },

  // Update budget
  update: async (id: string, data: Partial<CreateBudgetData>): Promise<Budget> => {
    const response = await apiClient.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  // Delete budget
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },

  // Get budget spending
  getSpending: async (budgetId: string): Promise<BudgetSpendingResponse> => {
    const response = await apiClient.get<BudgetSpendingResponse>(`/budgets/${budgetId}/spending`);
    return response.data;
  },

  // Get current month's budgets
  getCurrentMonth: async (): Promise<Budget[]> => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const response = await apiClient.get<Budget[]>('/budgets', {
      params: { startDate, endDate }
    });
    return response.data;
  },
};

export default budgetService;
