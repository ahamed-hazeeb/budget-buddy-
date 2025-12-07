import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionService, { CreateTransactionData } from '../services/transactionService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: transactionService.getAll,
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      toast.success('Transaction created successfully');
    },
    onError: () => {
      toast.error('Failed to create transaction');
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionData> }) =>
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      toast.success('Transaction updated successfully');
    },
    onError: () => {
      toast.error('Failed to update transaction');
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      toast.success('Transaction deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete transaction');
    },
  });
};
