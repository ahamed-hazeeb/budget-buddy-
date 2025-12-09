import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Brain, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// New components
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import MLInsights from '../components/dashboard/MLInsights';
import LoadingSpinner from '../components/common/LoadingSpinner';

// NEW ML Components
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import ExpenseForecastChart from '../components/dashboard/ExpenseForecastChart';
import BudgetRecommendations from '../components/dashboard/BudgetRecommendations';
import SpendingHabits from '../components/dashboard/SpendingHabits';
import BenchmarkCard from '../components/dashboard/BenchmarkCard';
import BehaviorNudges from '../components/dashboard/BehaviorNudges';

// Hooks
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudget';
import { 
  useMLInsights,
  useHealthScore,
  useAdvancedExpenseForecast,
  useBudgetRecommendations,
  useSpendingHabits,
  useBenchmark,
  useBehaviorNudges,
} from '../hooks/useMLInsights';

// Utils
import accountService from '../services/accountService';
import categoryService from '../services/categoryService';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../utils/constants';
import { TransactionType } from '../types';

const Dashboard: React.FC = () => {
  // Fetch data using React Query hooks
  const { data: transactions = [], isLoading: txnLoading } = useTransactions();
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: mlInsightsData, isLoading: mlLoading } = useMLInsights();
  
  // NEW: Advanced ML hooks
  const { data: healthScore, isLoading: healthScoreLoading } = useHealthScore();
  const { data: expenseForecast, isLoading: forecastLoading } = useAdvancedExpenseForecast(12);
  const { data: spendingHabits, isLoading: habitsLoading } = useSpendingHabits();
  const { data: benchmark, isLoading: benchmarkLoading } = useBenchmark();
  const { data: behaviorNudges, isLoading: nudgesLoading } = useBehaviorNudges();
  
  // Calculate total budget for recommendations
  const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.limit), 0);
  const { data: budgetRecommendations, isLoading: recommendationsLoading } = useBudgetRecommendations(totalBudget);
  
  // Fetch categories for chart data mapping
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: categoryService.getAll,
  });
  
  // Fetch accounts for balance calculation
  const { data: accounts = [] } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: accountService.getAll,
  });

  const isLoading = txnLoading || budgetsLoading || categoriesLoading;

  // Calculate summary from transactions
  // Note: Backend returns lowercase types ("income", "expense", "savings")
  const totalIncome = transactions
    .filter(t => t.type?.toString().toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type?.toString().toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Prepare chart data
  const pieData = [
    { name: 'Income', value: totalIncome || 0, color: '#22c55e' },
    { name: 'Expense', value: totalExpenses || 0, color: '#ef4444' },
  ];

  // DEBUG: Log data to verify
  console.log('📊 Dashboard Data:', {
    transactions: transactions.length,
    categories: categories.length,
    sampleTransaction: transactions[0],
    sampleCategory: categories[0]
  });

  // Create category ID to name lookup map
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string | number, string>);

  console.log('🗂️ Category Map:', categoryMap);

  // Expense breakdown by category - FIX: Use category_id with lookup
  // Note: Backend returns lowercase types ("income", "expense", "savings")
  const expensesByCategory = transactions
    .filter(t => t.type?.toString().toLowerCase() === 'expense')
    .reduce((acc, t) => {
      // Get category name from category_id using lookup map
      const categoryName = t.category_id 
        ? (categoryMap[t.category_id] || 'Uncategorized')
        : (t.category || 'Uncategorized');
      
      console.log(`💸 Expense: ${t.amount} → ${categoryName} (category_id: ${t.category_id})`);
      
      // Ensure amount is treated as a number to avoid string concatenation
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  console.log('📈 Expenses by Category:', expensesByCategory);

  const barData = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5 categories

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/transactions?type=income" 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> Add Income
          </Link>
          <Link 
            to="/transactions?type=expense" 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> Add Expense
          </Link>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats
        income={totalIncome}
        expenses={totalExpenses}
        balance={totalBalance}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Income vs Expenses</h3>
          {totalIncome === 0 && totalExpenses === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <p className="mb-2">No transactions yet</p>
              <Link to="/transactions" className="text-blue-600 hover:underline text-sm">
                Add your first transaction →
              </Link>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-slate-600">
                Income: Rs. {totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-slate-600">
                Expenses: Rs. {totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Expense Categories</h3>
          {barData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <p className="mb-2">No expense categories yet</p>
              <Link to="/transactions?type=expense" className="text-blue-600 hover:underline text-sm">
                Add an expense →
              </Link>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} 
                  />
                  <Tooltip 
                    formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Grid Section - Recent Transactions, Budget, ML Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions - spans 2 columns */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} limit={5} />
        </div>

        {/* Budget Progress - 1 column */}
        <div>
          <BudgetProgress budgets={budgets} limit={3} />
        </div>
      </div>

      {/* ML Insights Section */}
      {mlInsightsData?.insights && (
        <MLInsights 
          insights={mlInsightsData.insights} 
          isLoading={mlLoading} 
        />
      )}

      {/* NEW: Financial Health Score - Prominent placement */}
      <HealthScoreCard score={healthScore} isLoading={healthScoreLoading} />

      {/* NEW: Advanced ML Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Forecast */}
        <ExpenseForecastChart forecast={expenseForecast} isLoading={forecastLoading} />
        
        {/* Budget Recommendations */}
        <BudgetRecommendations 
          recommendations={budgetRecommendations} 
          isLoading={recommendationsLoading}
        />
      </div>

      {/* NEW: Spending Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Habits */}
        <SpendingHabits habits={spendingHabits} isLoading={habitsLoading} />
        
        {/* Peer Benchmark */}
        <BenchmarkCard benchmark={benchmark} isLoading={benchmarkLoading} />
      </div>

      {/* NEW: Behavior Nudges */}
      <BehaviorNudges nudges={behaviorNudges} isLoading={nudgesLoading} />

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={24} />
              <h3 className="text-xl font-bold">AI-Powered Insights</h3>
            </div>
            <p className="text-blue-100">
              Get personalized financial recommendations and predictions based on your spending patterns
            </p>
          </div>
          <Link
            to="/ml-insights"
            className="bg-white text-purple-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <TrendingUp size={18} />
            View All AI Insights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
