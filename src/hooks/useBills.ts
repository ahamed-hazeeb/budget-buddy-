import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import billService, { CreateBillData } from '../services/billService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useBills = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BILLS],
    queryFn: billService.getAll,
    retry: false,
    meta: {
      errorMessage: 'Failed to load bills',
    },
  });
};

export const useBill = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BILLS, id],
    queryFn: () => billService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBillData) => billService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS] });
      toast.success('Bill reminder created successfully');
    },
    onError: () => {
      toast.error('Failed to create bill reminder');
    },
  });
};

export const useUpdateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBillData> }) =>
      billService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS] });
      toast.success('Bill updated successfully');
    },
    onError: () => {
      toast.error('Failed to update bill');
    },
  });
};

export const useDeleteBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS] });
      toast.success('Bill deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete bill');
    },
  });
};

export const useMarkBillAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billService.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS] });
      toast.success('Bill marked as paid');
    },
    onError: () => {
      toast.error('Failed to mark bill as paid');
    },
  });
};

export const useUpcomingBills = (days: number = 30) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BILLS, 'upcoming', days],
    queryFn: () => billService.getUpcoming(days),
  });
};

export const useOverdueBills = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BILLS, 'overdue'],
    queryFn: billService.getOverdue,
  });
};
