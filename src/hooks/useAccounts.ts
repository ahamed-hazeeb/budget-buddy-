import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import accountService, { CreateAccountData } from '../services/accountService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useAccounts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: accountService.getAll,
    retry: false,
    meta: {
      errorMessage: 'Failed to load accounts',
    },
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS, id],
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountData) => accountService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      toast.success('Account created successfully');
    },
    onError: () => {
      toast.error('Failed to create account');
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAccountData> }) =>
      accountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      toast.success('Account updated successfully');
    },
    onError: () => {
      toast.error('Failed to update account');
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      toast.success('Account deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete account');
    },
  });
};

export const useTotalBalance = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS, 'total'],
    queryFn: accountService.getTotalBalance,
  });
};
