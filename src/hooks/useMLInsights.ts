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
    retry: false, // Don't retry on 400/404
    meta: {
      errorMessage: 'Failed to load ML insights',
    },
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

// NEW ADVANCED ML HOOKS

export const useAdvancedExpenseForecast = (months: number = 12) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_ADVANCED_FORECAST, months],
    queryFn: () => mlService.getAdvancedExpenseForecast(months),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: false,
  });
};

export const useHealthScore = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_HEALTH_SCORE],
    queryFn: mlService.getHealthScore,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: false,
  });
};

export const useHealthTrends = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_HEALTH_TRENDS],
    queryFn: mlService.getHealthTrends,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
};

export const useBenchmark = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_BENCHMARK],
    queryFn: mlService.getBenchmark,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: false,
  });
};

export const useBudgetRecommendations = (totalBudget: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_BUDGET_RECOMMENDATIONS, totalBudget],
    queryFn: () => mlService.getBudgetRecommendations(totalBudget),
    enabled: totalBudget > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });
};

export const useBudgetAlerts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_BUDGET_ALERTS],
    queryFn: mlService.getBudgetAlerts,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: false,
  });
};

export const useOptimizeBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mlService.optimizeBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ML_BUDGET_RECOMMENDATIONS] });
      toast.success('Budget optimization completed');
    },
    onError: () => {
      toast.error('Failed to optimize budget');
    },
  });
};

export const useSpendingHabits = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_SPENDING_HABITS],
    queryFn: mlService.getSpendingHabits,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: false,
  });
};

export const useSavingsOpportunities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_SAVINGS_OPPORTUNITIES],
    queryFn: mlService.getSavingsOpportunities,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: false,
  });
};

export const useBehaviorNudges = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_BEHAVIOR_NUDGES],
    queryFn: mlService.getBehaviorNudges,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });
};

export const useModelPerformance = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ML_MODEL_PERFORMANCE],
    queryFn: mlService.getModelPerformance,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: false,
  });
};
