// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// LocalStorage Keys
export const STORAGE_KEYS = {
  TOKEN: 'bb_token',
  USER: 'bb_user',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

// Account Types
export const ACCOUNT_TYPES = ['Cash', 'Bank', 'Card', 'Other'] as const;

// Category Types
export const CATEGORY_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

// Default Categories
export const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Freelance',
  'Investment',
  'Bonus',
  'Other Income',
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Rent',
  'Groceries',
  'Utilities',
  'Travel',
  'Other Expense',
];

// Date Formats
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_LONG: 'MMMM dd, yyyy',
  MONTH_YEAR: 'MMMM yyyy',
} as const;

// Chart Colors
export const CHART_COLORS = {
  INCOME: '#22c55e',
  EXPENSE: '#ef4444',
  SAVINGS: '#3b82f6',
  BUDGET: '#f59e0b',
  GOAL: '#8b5cf6',
};

// Insight Types
export const INSIGHT_TYPES = {
  WARNING: 'warning',
  SUGGESTION: 'suggestion',
  ACHIEVEMENT: 'achievement',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  BILLS: 'bills',
  CATEGORIES: 'categories',
  ACCOUNTS: 'accounts',
  USER_PROFILE: 'userProfile',
  ML_PREDICTIONS: 'mlPredictions',
  ML_INSIGHTS: 'mlInsights',
  ML_INSIGHTS_SUMMARY: 'mlInsightsSummary',
  ML_HEALTH: 'mlHealth',
  DASHBOARD_SUMMARY: 'dashboardSummary',
  // New ML Query Keys
  ML_HEALTH_SCORE: 'ml-health-score',
  ML_HEALTH_TRENDS: 'ml-health-trends',
  ML_BENCHMARK: 'ml-benchmark',
  ML_BUDGET_RECOMMENDATIONS: 'ml-budget-recommendations',
  ML_BUDGET_ALERTS: 'ml-budget-alerts',
  ML_BUDGET_OPTIMIZE: 'ml-budget-optimize',
  ML_SPENDING_HABITS: 'ml-spending-habits',
  ML_SAVINGS_OPPORTUNITIES: 'ml-savings-opportunities',
  ML_BEHAVIOR_NUDGES: 'ml-behavior-nudges',
  ML_ADVANCED_FORECAST: 'ml-advanced-forecast',
  ML_MODEL_PERFORMANCE: 'ml-model-performance',
} as const;

// Pagination
export const ITEMS_PER_PAGE = 10;

// Toast Duration
export const TOAST_DURATION = 3000;

// Authentication Messages
export const AUTH_MESSAGES = {
  SESSION_EXPIRED: 'Session expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
} as const;

// Percentage Constants
export const MAX_PERCENTAGE = 100;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  TRANSACTIONS: '/transactions',
  BUDGET: '/budget',
  GOALS: '/goals',
  REMINDERS: '/reminders',
  ACCOUNTS: '/accounts',
  ML_INSIGHTS: '/ml-insights',
} as const;
