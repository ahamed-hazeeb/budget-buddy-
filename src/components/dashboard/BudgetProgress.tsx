import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, AlertCircle } from 'lucide-react';
import { Budget } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { MAX_PERCENTAGE } from '../../utils/constants';

interface BudgetProgressProps {
  budgets: Budget[];
  limit?: number;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets, limit = 3 }) => {
  const displayBudgets = budgets.slice(0, limit);

  if (budgets.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Budget Overview</h3>
        <div className="text-center py-8">
          <p className="text-slate-500">No budgets set yet</p>
          <Link 
            to="/budget" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first budget →
          </Link>
        </div>
      </div>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-orange-100';
    if (percentage >= 50) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Budget Overview</h3>
        <Link 
          to="/budget" 
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {displayBudgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;

          return (
            <div key={budget.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getProgressColor(percentage)}`} />
                  <span className="font-semibold text-slate-900">{budget.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                  </p>
                  <p className={`text-xs ${remaining >= 0 ? 'text-slate-500' : 'text-red-600'}`}>
                    {remaining >= 0 
                      ? `${formatCurrency(remaining)} left` 
                      : `${formatCurrency(Math.abs(remaining))} over`
                    }
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`w-full h-2 rounded-full ${getProgressBarColor(percentage)} overflow-hidden`}>
                <div
                  className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, MAX_PERCENTAGE)}%` }}
                />
              </div>

              {/* Warning for over budget */}
              {percentage > MAX_PERCENTAGE && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle size={14} />
                  <span>Over budget by {formatPercentage(percentage - MAX_PERCENTAGE)}</span>
                </div>
              )}

              {/* Warning for near limit */}
              {percentage >= 90 && percentage <= MAX_PERCENTAGE && (
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                  <TrendingDown size={14} />
                  <span>Approaching limit ({formatPercentage(percentage)})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;
