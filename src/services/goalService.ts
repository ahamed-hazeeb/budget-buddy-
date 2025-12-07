import apiClient from '../api/client';
import { Goal } from '../types';

export interface CreateGoalData {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution?: number;
}

const goalService = {
  // Get all goals
  getAll: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/goals');
    return response.data;
  },

  // Get goal by ID
  getById: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  // Create goal
  create: async (data: CreateGoalData): Promise<Goal> => {
    const response = await apiClient.post<Goal>('/goals', data);
    return response.data;
  },

  // Update goal
  update: async (id: string, data: Partial<CreateGoalData>): Promise<Goal> => {
    const response = await apiClient.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  // Delete goal
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`);
  },

  // Update goal progress
  updateProgress: async (id: string, amount: number): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}/progress`, { amount });
    return response.data;
  },
};

export default goalService;
