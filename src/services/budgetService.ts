import apiClient from '../api/client';
import { Budget } from '../types';
import { getUserId } from '../utils/auth';

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
  // Get overall budget
  getAll: async (): Promise<Budget[]> => {
    const userId = getUserId();
    const response = await apiClient.get(`/budgets/overall/${userId}`);
    // Backend returns a single budget object, wrap it in an array
    let data = response.data;
    
    // Handle empty or null responses
    if (!data) return [];
    
    // Normalize the data structure - ensure we have the right properties
    const normalizeBudget = (budget: any): Budget => ({
      id: budget.id || budget._id || String(Math.random()),
      category: budget.category || 'General',
      limit: budget.limit || budget.amount || 0,
      spent: budget.spent || budget.current || 0,
      startDate: budget.startDate || budget.start_date || new Date().toISOString().split('T')[0],
      endDate: budget.endDate || budget.end_date || new Date().toISOString().split('T')[0],
      userId: budget.userId || budget.user_id,
    });
    
    // If it's already an array, normalize each item; otherwise normalize single object and wrap in array
    if (Array.isArray(data)) {
      return data.map(normalizeBudget);
    }
    
    return [normalizeBudget(data)];
  },

  // Get budget by ID
  getById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  // Create budget
  create: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await apiClient.post<Budget>('/budgets/overall', {
      ...data,
      user_id: getUserId()
    });
    return response.data;
  },

  // Update budget
  update: async (id: string, data: Partial<CreateBudgetData>): Promise<Budget> => {
    // Backend uses POST for both create and update
    const response = await apiClient.post<Budget>('/budgets/overall', { id, ...data });
    return response.data;
  },

  // Delete budget
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },

  // Get budget spending
  getSpending: async (startDate?: string, endDate?: string): Promise<BudgetSpendingResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await apiClient.get<BudgetSpendingResponse>(`/budgets/spending?${params.toString()}`);
    return response.data;
  },

  // Get current month's budgets
  getCurrentMonth: async (): Promise<Budget[]> => {
    const userId = getUserId();
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const response = await apiClient.get(`/budgets/overall/${userId}`, {
      params: { startDate, endDate }
    });
    
    // Backend returns a single budget object, wrap it in an array
    let data = response.data;
    
    // Handle empty or null responses
    if (!data) return [];
    
    // Normalize the data structure - ensure we have the right properties
    const normalizeBudget = (budget: any): Budget => ({
      id: budget.id || budget._id || String(Math.random()),
      category: budget.category || 'General',
      limit: budget.limit || budget.amount || 0,
      spent: budget.spent || budget.current || 0,
      startDate: budget.startDate || budget.start_date || startDate,
      endDate: budget.endDate || budget.end_date || endDate,
      userId: budget.userId || budget.user_id,
    });
    
    // If it's already an array, normalize each item; otherwise normalize single object and wrap in array
    if (Array.isArray(data)) {
      return data.map(normalizeBudget);
    }
    
    return [normalizeBudget(data)];
  },
};

export default budgetService;
