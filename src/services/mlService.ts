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
  // New types
  FinancialHealthScore,
  AdvancedExpenseForecast,
  BudgetRecommendationsResponse,
  BudgetAlertsResponse,
  BudgetOptimizationResponse,
  SpendingHabitsResponse,
  SavingsOpportunitiesResponse,
  BehaviorNudgesResponse,
  BenchmarkData,
  ModelPerformanceResponse,
  HealthTrendsResponse,
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

  // NEW ADVANCED ML ENDPOINTS

  // Get advanced expense forecast (6-24 months)
  getAdvancedExpenseForecast: async (months: number = 12): Promise<AdvancedExpenseForecast> => {
    const response = await apiClient.post<AdvancedExpenseForecast>(
      '/ml/predictions/expense/advanced',
      { months }
    );
    return response.data;
  },

  // Get financial health score (0-100 with grade A-F)
  getHealthScore: async (): Promise<FinancialHealthScore> => {
    const response = await apiClient.get<FinancialHealthScore>('/ml/insights/health-score');
    return response.data;
  },

  // Get health score trends over time
  getHealthTrends: async (): Promise<HealthTrendsResponse> => {
    const userId = 'me'; // Backend will use authenticated user
    const response = await apiClient.get<HealthTrendsResponse>(`/ml/insights/trends/${userId}`);
    return response.data;
  },

  // Compare with peer benchmarks
  getBenchmark: async (): Promise<BenchmarkData> => {
    const userId = 'me';
    const response = await apiClient.get<BenchmarkData>(`/ml/insights/benchmark/${userId}`);
    return response.data;
  },

  // Get AI budget recommendations (50/30/20 rule)
  getBudgetRecommendations: async (totalBudget: number): Promise<BudgetRecommendationsResponse> => {
    const response = await apiClient.post<BudgetRecommendationsResponse>(
      '/ml/budget/recommend',
      { total_budget: totalBudget }
    );
    return response.data;
  },

  // Get real-time budget overspending alerts
  getBudgetAlerts: async (): Promise<BudgetAlertsResponse> => {
    const response = await apiClient.post<BudgetAlertsResponse>('/ml/budget/alerts', {});
    return response.data;
  },

  // Get budget optimization suggestions
  optimizeBudget: async (): Promise<BudgetOptimizationResponse> => {
    const response = await apiClient.post<BudgetOptimizationResponse>('/ml/budget/optimize', {});
    return response.data;
  },

  // Get spending habit analysis
  getSpendingHabits: async (): Promise<SpendingHabitsResponse> => {
    const userId = 'me';
    const response = await apiClient.get<SpendingHabitsResponse>(`/ml/recommendations/habits/${userId}`);
    return response.data;
  },

  // Get savings opportunities
  getSavingsOpportunities: async (): Promise<SavingsOpportunitiesResponse> => {
    const userId = 'me';
    const response = await apiClient.get<SavingsOpportunitiesResponse>(`/ml/recommendations/opportunities/${userId}`);
    return response.data;
  },

  // Get behavior nudges
  getBehaviorNudges: async (): Promise<BehaviorNudgesResponse> => {
    const userId = 'me';
    const response = await apiClient.get<BehaviorNudgesResponse>(`/ml/recommendations/nudges/${userId}`);
    return response.data;
  },

  // Get model performance metrics
  getModelPerformance: async (): Promise<ModelPerformanceResponse> => {
    const userId = 'me';
    const response = await apiClient.get<ModelPerformanceResponse>(`/ml/models/performance/${userId}`);
    return response.data;
  },
};

export default mlService;
