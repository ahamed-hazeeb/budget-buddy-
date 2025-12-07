import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import mlService from '../services/mlService';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';
import {
  MLGoalTimelineRequest,
  MLReversePlanRequest,
} from '../types';

export const useMLHealth = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_HEALTH],
    queryFn: mlService.checkHealth,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMLPredictions = (months: number = 6) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_PREDICTIONS, months],
    queryFn: () => mlService.getPredictions(months),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMLInsights = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_INSIGHTS],
    queryFn: mlService.getUserInsights,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMLInsightsSummary = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_INSIGHTS_SUMMARY],
    queryFn: mlService.getInsightsSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrainMLModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mlService.trainModel,
    onSuccess: () => {
      // Invalidate all ML-related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ML_PREDICTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ML_INSIGHTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ML_INSIGHTS_SUMMARY] });
      toast.success('ML model trained successfully');
    },
    onError: () => {
      toast.error('Failed to train ML model');
    },
  });
};

export const useCalculateGoalTimeline = () => {
  return useMutation({
    mutationFn: (data: MLGoalTimelineRequest) => mlService.calculateGoalTimeline(data),
    onError: () => {
      toast.error('Failed to calculate goal timeline');
    },
  });
};

export const useReversePlanGoal = () => {
  return useMutation({
    mutationFn: (data: MLReversePlanRequest) => mlService.reversePlanGoal(data),
    onError: () => {
      toast.error('Failed to create reverse plan');
    },
  });
};
