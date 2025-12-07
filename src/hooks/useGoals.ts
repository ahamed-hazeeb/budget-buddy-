import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import goalService, { CreateGoalData } from '../services/goalService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useGoals = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GOALS],
    queryFn: goalService.getAll,
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GOALS, id],
    queryFn: () => goalService.getById(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalData) => goalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] });
      toast.success('Goal created successfully');
    },
    onError: () => {
      toast.error('Failed to create goal');
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoalData> }) =>
      goalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] });
      toast.success('Goal updated successfully');
    },
    onError: () => {
      toast.error('Failed to update goal');
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] });
      toast.success('Goal deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete goal');
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalService.updateProgress(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] });
      toast.success('Goal progress updated successfully');
    },
    onError: () => {
      toast.error('Failed to update goal progress');
    },
  });
};
