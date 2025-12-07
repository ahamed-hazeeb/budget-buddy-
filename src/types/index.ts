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
  type: TransactionType | string;  // Backend returns lowercase strings: "income", "expense", "savings"
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
  name: string;
  type: 'Cash' | 'Bank' | 'Card' | 'Other';
  balance: number;
  userId?: string;
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
