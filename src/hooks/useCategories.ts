import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService, { CreateCategoryData } from '../services/categoryService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: categoryService.getAll,
    retry: false,
    meta: {
      errorMessage: 'Failed to load categories',
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      toast.success('Category created successfully');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryData> }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      toast.success('Category updated successfully');
    },
    onError: () => {
      toast.error('Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      toast.success('Category deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete category');
    },
  });
};
