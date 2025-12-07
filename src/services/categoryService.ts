import apiClient from '../api/client';
import { Category } from '../types';
import { getUserId } from '../utils/auth';

export interface CreateCategoryData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const userId = getUserId();
    const response = await apiClient.get<Category[]>(`/categories/${userId}`);
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Create category
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', {
      ...data,
      type: data.type.toLowerCase(), // Backend expects lowercase
      user_id: getUserId()
    });
    return response.data;
  },

  // Update category
  update: async (id: string, data: Partial<CreateCategoryData>): Promise<Category> => {
    const payload = { ...data };
    // Backend expects lowercase type
    if (payload.type) {
      payload.type = payload.type.toLowerCase() as 'INCOME' | 'EXPENSE';
    }
    const response = await apiClient.put<Category>(`/categories/${id}`, payload);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  // Get categories by type
  getByType: async (type: 'INCOME' | 'EXPENSE'): Promise<Category[]> => {
    const userId = getUserId();
    const response = await apiClient.get<Category[]>(`/categories/${userId}`, {
      params: { type: type.toLowerCase() } // Backend expects lowercase
    });
    return response.data;
  },
};

export default categoryService;
