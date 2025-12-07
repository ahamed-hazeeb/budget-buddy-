import apiClient from '../api/client';
import { Bill } from '../types';

export interface CreateBillData {
  title: string;
  dueDate: string;
  amount: number;
  category?: string;
  isPaid?: boolean;
}

const billService = {
  // Get all bills
  getAll: async (): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>('/bills');
    return response.data;
  },

  // Get bill by ID
  getById: async (id: string): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/bills/${id}`);
    return response.data;
  },

  // Create bill
  create: async (data: CreateBillData): Promise<Bill> => {
    const response = await apiClient.post<Bill>('/bills', data);
    return response.data;
  },

  // Update bill
  update: async (id: string, data: Partial<CreateBillData>): Promise<Bill> => {
    const response = await apiClient.put<Bill>(`/bills/${id}`, data);
    return response.data;
  },

  // Delete bill
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/bills/${id}`);
  },

  // Mark bill as paid
  markAsPaid: async (id: string): Promise<Bill> => {
    const response = await apiClient.patch<Bill>(`/bills/${id}/pay`);
    return response.data;
  },

  // Get upcoming bills
  getUpcoming: async (days: number = 30): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>('/bills/upcoming', {
      params: { days }
    });
    return response.data;
  },

  // Get overdue bills
  getOverdue: async (): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>('/bills/overdue');
    return response.data;
  },
};

export default billService;
