import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Budget } from '../types';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    ApiService.getBudgets().then(setBudgets);
  }, []);

  const handlePredictBudget = async () => {
    setIsPredicting(true);
    // Simulate getting recent income to base prediction on
    const suggested = await ApiService.predictBudget(300000); // Mock monthly income
    setPrediction(suggested);
    setIsPredicting(false);
  };

  const calculatePercentage = (spent: number, limit: number) => {
    return Math.min(100, Math.round((spent / limit) * 100));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Budget & AI Planning</h1>
        <p className="text-slate-500">Track your spending limits and get AI recommendations.</p>
      </div>

      {/* AI Prediction Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-indigo-200">
            <Sparkles size={20} />
            <span className="font-semibold uppercase tracking-wider text-xs">AI-Powered Insights</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Not sure how much to budget?</h2>
          <p className="text-indigo-100 mb-6">
            Our Machine Learning model analyzes your past 6 months of spending behavior and income stability to suggest an optimal monthly budget.
          </p>
          
          {prediction !== null ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 animate-fade-in">
              <p className="text-sm text-indigo-200 mb-1">Predicted Safe Budget</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">Rs. {prediction.toLocaleString()}</span>
                <span className="text-sm text-indigo-200 mb-1">/ month</span>
              </div>
              <button className="mt-3 text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50">
                Apply This Budget
              </button>
            </div>
          ) : (
            <button 
              onClick={handlePredictBudget}
              disabled={isPredicting}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              {isPredicting ? (
                <>Analyzing Spending Patterns...</>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Predict Monthly Budget
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 opacity-10 p-8">
          <TrendingUp size={200} />
        </div>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const percentage = calculatePercentage(budget.spent, budget.limit);
          const isOverBudget = budget.spent > budget.limit;

          return (
            <div key={budget.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{budget.category} Budget</h3>
                  <p className="text-xs text-slate-500">
                    {budget.startDate} to {budget.endDate}
                  </p>
                </div>
                {isOverBudget && (
                  <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertCircle size={14} /> Exceeded
                  </div>
                )}
              </div>

              <div className="mb-2 flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-500">Spent</p>
                  <p className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
                    Rs. {budget.spent.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Limit</p>
                  <p className="text-lg font-semibold text-slate-700">Rs. {budget.limit.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage >= 100 ? 'bg-red-500' : percentage > 75 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-right text-xs text-slate-400 mt-2">{percentage}% Used</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPage;
