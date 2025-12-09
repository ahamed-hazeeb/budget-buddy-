export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO Date string (YYYY-MM-DD)
  amount: number;
  category?: string;        // Optional: category name from JOIN
  category_id?: number;     // Category ID reference
  account?: string;         // Optional: account name from JOIN  
  account_id?: number;      // Account ID reference
  type: TransactionType | 'income' | 'expense' | 'savings' | 'bill';  // Backend returns lowercase strings
  note?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  startDate: string;
  endDate: string;
  userId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bill {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  category?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  sendEmail: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  userId?: string;
}

export interface Account {
  id: string;
  name?: string; // Optional: for display purposes
  account_type?: string; // Backend field
  type?: 'Cash' | 'Bank' | 'Card' | 'Other'; // Frontend field
  balance: number | string; // Backend returns string
  user_id?: number;
  userId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
}

// ML Response Types
export interface MLHealthResponse {
  status: string;
  message: string;
}

export interface MLTrainResponse {
  message: string;
  metrics?: {
    accuracy?: number;
    loss?: number;
  };
}

export interface MLPrediction {
  month: number;
  year: number;
  predictedSavings: number;
  confidence?: number;
}

export interface MLPredictionsResponse {
  predictions: MLPrediction[];
  metadata?: {
    modelVersion?: string;
    trainedAt?: string;
  };
}

export interface MLInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  actionable?: boolean;
  createdAt: string;
}

export interface MLInsightsResponse {
  insights: MLInsight[];
  summary?: {
    totalInsights: number;
    highPriority: number;
    categories: string[];
  };
}

export interface MLInsightsSummaryResponse {
  totalInsights: number;
  categories: {
    warnings: number;
    suggestions: number;
    achievements: number;
  };
  lastUpdated: string;
}

export interface MLGoalTimelineRequest {
  goalAmount: number;
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface MLGoalTimelineResponse {
  estimatedMonths: number;
  estimatedDate: string;
  monthlySavingsRequired: number;
  feasibility: 'high' | 'medium' | 'low';
  recommendations?: string[];
}

export interface MLReversePlanRequest {
  goalAmount: number;
  targetDate: string;
  currentSavings: number;
  monthlyIncome: number;
}

export interface MLReversePlanResponse {
  requiredMonthlySavings: number;
  savingsRate: number;
  isAchievable: boolean;
  adjustments?: {
    reduceExpensesBy?: number;
    increaseIncomeBy?: number;
  };
  milestones?: Array<{
    month: number;
    targetAmount: number;
  }>;
}

// New ML Advanced Types
export interface FinancialHealthScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  savings_rate_score: number;
  expense_consistency_score: number;
  emergency_fund_score: number;
  debt_ratio_score?: number;
  goal_progress_score?: number;
  recommendations: string[];
  timestamp?: string;
}

export interface AdvancedExpenseForecast {
  predictions: Array<{
    month: string;
    predicted_expense: number;
    confidence: number;
    category_breakdown?: Record<string, number>;
    trend?: 'increasing' | 'decreasing' | 'stable';
  }>;
  metadata?: {
    accuracy?: number;
    modelVersion?: string;
  };
}

export interface BudgetRecommendation {
  category: string;
  recommended_amount: number;
  current_spending: number;
  variance: number;
  reasoning?: string;
}

export interface BudgetRecommendationsResponse {
  recommendations: BudgetRecommendation[];
  total_budget: number;
  rule_applied?: string; // e.g., "50/30/20"
  summary?: {
    needs: number;
    wants: number;
    savings: number;
  };
}

export interface SpendingHabit {
  habit: string;
  frequency: number;
  total_cost: number;
  suggestion: string;
  category?: string;
  severity?: 'high' | 'medium' | 'low';
}

export interface SpendingHabitsResponse {
  habits: SpendingHabit[];
  total_identified: number;
  potential_savings: number;
}

export interface SavingsOpportunity {
  opportunity: string;
  category: string;
  potential_monthly_savings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface SavingsOpportunitiesResponse {
  opportunities: SavingsOpportunity[];
  total_potential_savings: number;
}

export interface BehaviorNudge {
  message: string;
  type: 'positive' | 'warning' | 'reminder';
  urgency: 'high' | 'medium' | 'low';
  action_required?: string;
  icon?: string;
}

export interface BehaviorNudgesResponse {
  nudges: BehaviorNudge[];
  generated_at: string;
}

export interface BenchmarkData {
  user_metrics: {
    savings_rate: number;
    expense_ratio: number;
    monthly_surplus: number;
  };
  peer_average: {
    savings_rate: number;
    expense_ratio: number;
    monthly_surplus: number;
  };
  comparison: {
    savings_rate_percentile: number;
    expense_ratio_percentile: number;
    rank: string; // e.g., "Top 25%"
  };
  insights: string[];
}

export interface BudgetAlert {
  category: string;
  budget_limit: number;
  current_spending: number;
  percentage_used: number;
  status: 'warning' | 'critical' | 'normal';
  message: string;
}

export interface BudgetAlertsResponse {
  alerts: BudgetAlert[];
  total_alerts: number;
  critical_count: number;
}

export interface BudgetOptimization {
  category: string;
  current_allocation: number;
  optimized_allocation: number;
  change_amount: number;
  change_percentage: number;
  reasoning: string;
}

export interface BudgetOptimizationResponse {
  optimizations: BudgetOptimization[];
  total_reallocation: number;
  expected_improvement: string;
}

export interface ModelPerformance {
  model_name: string;
  accuracy: number;
  precision?: number;
  recall?: number;
  last_trained: string;
  training_data_size: number;
  predictions_made: number;
}

export interface ModelPerformanceResponse {
  models: ModelPerformance[];
  overall_performance: {
    average_accuracy: number;
    total_predictions: number;
  };
}

export interface HealthTrend {
  date: string;
  score: number;
  grade: string;
  savings_rate: number;
  expense_consistency: number;
}

export interface HealthTrendsResponse {
  trends: HealthTrend[];
  period: string;
  improvement: number;
  insights: string[];
}
