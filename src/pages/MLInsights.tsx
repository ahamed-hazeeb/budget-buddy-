import React from 'react';
import { Brain, TrendingUp, Award, BarChart3, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Components
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import ExpenseForecastChart from '../components/dashboard/ExpenseForecastChart';
import BudgetRecommendations from '../components/dashboard/BudgetRecommendations';
import SpendingHabits from '../components/dashboard/SpendingHabits';
import BenchmarkCard from '../components/dashboard/BenchmarkCard';
import BehaviorNudges from '../components/dashboard/BehaviorNudges';

// Hooks
import {
  useHealthScore,
  useHealthTrends,
  useAdvancedExpenseForecast,
  useBudgetRecommendations,
  useBudgetAlerts,
  useSpendingHabits,
  useSavingsOpportunities,
  useBenchmark,
  useBehaviorNudges,
  useModelPerformance,
  useTrainMLModel,
} from '../hooks/useMLInsights';
import { useBudgets } from '../hooks/useBudget';

const MLInsights: React.FC = () => {
  // Fetch all ML data
  const { data: healthScore, isLoading: healthScoreLoading } = useHealthScore();
  const { data: healthTrends, isLoading: trendsLoading } = useHealthTrends();
  const { data: expenseForecast, isLoading: forecastLoading } = useAdvancedExpenseForecast(12);
  const { data: spendingHabits, isLoading: habitsLoading } = useSpendingHabits();
  const { data: savingsOpportunities, isLoading: opportunitiesLoading } = useSavingsOpportunities();
  const { data: benchmark, isLoading: benchmarkLoading } = useBenchmark();
  const { data: behaviorNudges, isLoading: nudgesLoading } = useBehaviorNudges();
  const { data: budgetAlerts, isLoading: alertsLoading } = useBudgetAlerts();
  const { data: modelPerformance, isLoading: performanceLoading } = useModelPerformance();
  
  const { data: budgets = [] } = useBudgets();
  const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.limit), 0);
  const { data: budgetRecommendations, isLoading: recommendationsLoading } = useBudgetRecommendations(totalBudget);
  
  const trainModel = useTrainMLModel();

  const handleTrainModel = () => {
    trainModel.mutate();
  };

  const isAnyLoading = healthScoreLoading || forecastLoading || habitsLoading || 
                       benchmarkLoading || nudgesLoading || recommendationsLoading ||
                       trendsLoading || opportunitiesLoading || alertsLoading || performanceLoading;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="text-purple-600" size={32} />
            AI Financial Insights
          </h1>
          <p className="text-slate-500 mt-1">
            Advanced machine learning insights and predictions for your financial health
          </p>
        </div>
        <button
          onClick={handleTrainModel}
          disabled={trainModel.isPending}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={18} />
          {trainModel.isPending ? 'Training...' : 'Retrain ML Model'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award size={24} />
            <span className="text-3xl font-bold">
              {healthScore?.grade || '?'}
            </span>
          </div>
          <p className="text-green-100 text-sm">Financial Health Grade</p>
          <p className="text-2xl font-bold mt-1">{healthScore?.score || 0}/100</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">12 months</span>
          </div>
          <p className="text-blue-100 text-sm">Expense Forecast</p>
          <p className="text-2xl font-bold mt-1">
            {expenseForecast?.predictions?.length || 0} predictions
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={24} />
            <span className="text-3xl">☕</span>
          </div>
          <p className="text-orange-100 text-sm">Spending Habits</p>
          <p className="text-2xl font-bold mt-1">
            {spendingHabits?.total_identified || 0} detected
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Sparkles size={24} />
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-purple-100 text-sm">Potential Savings</p>
          <p className="text-2xl font-bold mt-1">
            Rs. {(savingsOpportunities?.total_potential_savings || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Loading State */}
      {isAnyLoading && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="text-slate-500 mt-4">Loading AI insights...</p>
        </div>
      )}

      {/* Financial Health Score */}
      <HealthScoreCard score={healthScore} isLoading={healthScoreLoading} />

      {/* Health Trends Chart */}
      {healthTrends && healthTrends.trends && healthTrends.trends.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Health Score Trends</h3>
          <div className="space-y-2">
            {healthTrends.trends.slice(0, 6).map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{trend.grade}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{trend.date}</p>
                    <p className="text-xs text-slate-500">
                      Savings: {trend.savings_rate.toFixed(1)}% | Consistency: {trend.expense_consistency.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{trend.score}</p>
                  <p className="text-xs text-slate-500">Score</p>
                </div>
              </div>
            ))}
          </div>
          {healthTrends.improvement !== undefined && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">
                Overall improvement: 
                <span className={`font-bold ml-1 ${healthTrends.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {healthTrends.improvement > 0 ? '+' : ''}{healthTrends.improvement.toFixed(1)}%
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Advanced Expense Forecast */}
      <ExpenseForecastChart forecast={expenseForecast} isLoading={forecastLoading} />

      {/* Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetRecommendations 
          recommendations={budgetRecommendations} 
          isLoading={recommendationsLoading}
        />
        
        {/* Budget Alerts */}
        {budgetAlerts && budgetAlerts.alerts && budgetAlerts.alerts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Budget Alerts</h3>
            <div className="space-y-3">
              {budgetAlerts.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 ${
                    alert.status === 'critical' 
                      ? 'bg-red-50 border-red-200' 
                      : alert.status === 'warning'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-800 text-sm">{alert.category}</h4>
                    <span className="text-xs font-bold">
                      {alert.percentage_used.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{alert.message}</p>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        alert.status === 'critical' ? 'bg-red-500' : 
                        alert.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(alert.percentage_used, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spending Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingHabits habits={spendingHabits} isLoading={habitsLoading} />
        
        {/* Savings Opportunities */}
        {savingsOpportunities && savingsOpportunities.opportunities && savingsOpportunities.opportunities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Savings Opportunities</h3>
            <div className="space-y-3">
              {savingsOpportunities.opportunities.slice(0, 5).map((opp, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{opp.opportunity}</h4>
                      <p className="text-xs text-slate-500">{opp.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {opp.difficulty}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {opp.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{opp.description}</p>
                  <p className="text-sm font-bold text-green-600">
                    Save Rs. {opp.potential_monthly_savings.toLocaleString()}/month
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Benchmark & Nudges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BenchmarkCard benchmark={benchmark} isLoading={benchmarkLoading} />
        <BehaviorNudges nudges={behaviorNudges} isLoading={nudgesLoading} />
      </div>

      {/* Model Performance */}
      {modelPerformance && modelPerformance.models && modelPerformance.models.length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">ML Model Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelPerformance.models.map((model, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-800 text-sm mb-2">{model.model_name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Accuracy</span>
                    <span className="font-bold text-green-600">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Predictions</span>
                    <span className="font-bold text-slate-800">{model.predictions_made}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Training Data</span>
                    <span className="font-bold text-slate-800">{model.training_data_size}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Last trained: {new Date(model.last_trained).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {modelPerformance.overall_performance && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">
                Overall accuracy: 
                <span className="font-bold text-green-600 ml-1">
                  {(modelPerformance.overall_performance.average_accuracy * 100).toFixed(1)}%
                </span>
                {' '}| Total predictions: 
                <span className="font-bold text-slate-800 ml-1">
                  {modelPerformance.overall_performance.total_predictions}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MLInsights;
