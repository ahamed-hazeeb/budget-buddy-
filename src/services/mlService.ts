import apiClient from '../api/client';
import {
  MLHealthResponse,
  MLTrainResponse,
  MLPredictionsResponse,
  MLInsightsResponse,
  MLInsightsSummaryResponse,
  MLGoalTimelineRequest,
  MLGoalTimelineResponse,
  MLReversePlanRequest,
  MLReversePlanResponse,
} from '../types';

const mlService = {
  // Check ML service health
  checkHealth: async (): Promise<MLHealthResponse> => {
    const response = await apiClient.get<MLHealthResponse>('/ml/health');
    return response.data;
  },

  // Train ML model
  trainModel: async (): Promise<MLTrainResponse> => {
    const response = await apiClient.post<MLTrainResponse>('/ml/train');
    return response.data;
  },

  // Get predictions
  getPredictions: async (months: number = 6): Promise<MLPredictionsResponse> => {
    const response = await apiClient.get<MLPredictionsResponse>('/ml/predictions', {
      params: { months }
    });
    return response.data;
  },

  // Get user insights
  getUserInsights: async (): Promise<MLInsightsResponse> => {
    const response = await apiClient.get<MLInsightsResponse>('/ml/insights');
    return response.data;
  },

  // Get insights summary
  getInsightsSummary: async (): Promise<MLInsightsSummaryResponse> => {
    const response = await apiClient.get<MLInsightsSummaryResponse>('/ml/insights/summary');
    return response.data;
  },

  // Calculate goal timeline
  calculateGoalTimeline: async (data: MLGoalTimelineRequest): Promise<MLGoalTimelineResponse> => {
    const response = await apiClient.post<MLGoalTimelineResponse>('/ml/goals/timeline', data);
    return response.data;
  },

  // Reverse plan goal
  reversePlanGoal: async (data: MLReversePlanRequest): Promise<MLReversePlanResponse> => {
    const response = await apiClient.post<MLReversePlanResponse>('/ml/goals/reverse-plan', data);
    return response.data;
  },

  // Get spending patterns
  getSpendingPatterns: async (): Promise<any> => {
    const response = await apiClient.get('/ml/patterns/spending');
    return response.data;
  },

  // Get anomalies
  getAnomalies: async (): Promise<any> => {
    const response = await apiClient.get('/ml/anomalies');
    return response.data;
  },
};

export default mlService;
