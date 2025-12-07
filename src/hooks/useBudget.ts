import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import budgetService, { CreateBudgetData } from '../services/budgetService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useBudgets = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUDGETS],
    queryFn: budgetService.getAll,
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUDGETS, id],
    queryFn: () => budgetService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetData) => budgetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      toast.success('Budget created successfully');
    },
    onError: () => {
      toast.error('Failed to create budget');
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBudgetData> }) =>
      budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      toast.success('Budget updated successfully');
    },
    onError: () => {
      toast.error('Failed to update budget');
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      toast.success('Budget deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete budget');
    },
  });
};

export const useBudgetSpending = (budgetId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUDGETS, budgetId, 'spending'],
    queryFn: () => budgetService.getSpending(budgetId),
    enabled: !!budgetId,
  });
};
