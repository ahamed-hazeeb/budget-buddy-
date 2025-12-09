import React from 'react';
import { Coffee, ShoppingCart, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { SpendingHabitsResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface SpendingHabitsProps {
  habits?: SpendingHabitsResponse;
  isLoading?: boolean;
}

const SpendingHabits: React.FC<SpendingHabitsProps> = ({ habits, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Coffee className="text-orange-600" size={24} />
          Spending Habits Analysis
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!habits || !habits.habits || habits.habits.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Coffee className="text-orange-600" size={24} />
          Spending Habits Analysis
        </h3>
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-green-400 mb-2" size={48} />
          <p className="text-slate-500">No recurring habits detected</p>
          <p className="text-sm text-slate-400 mt-1">
            Great job! Keep tracking your expenses
          </p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    if (severity === 'high') return <AlertTriangle size={16} className="text-red-600" />;
    if (severity === 'medium') return <AlertTriangle size={16} className="text-orange-600" />;
    return <Coffee size={16} className="text-slate-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Coffee className="text-orange-600" size={24} />
            Spending Habits Analysis
          </h3>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Identified</p>
            <p className="text-lg font-bold text-slate-800">{habits.total_identified || 0}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Potential Savings Summary */}
        {habits.potential_savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="text-green-600" size={20} />
              <h4 className="font-semibold text-green-800 text-sm">Potential Monthly Savings</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">
              Rs. {habits.potential_savings.toLocaleString()}
            </p>
            <p className="text-xs text-green-700 mt-1">
              By optimizing your recurring expenses
            </p>
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-3">
          {habits.habits.slice(0, 6).map((habit, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  {getSeverityIcon(habit.severity)}
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{habit.habit}</h4>
                    {habit.category && (
                      <span className="text-xs text-slate-500">{habit.category}</span>
                    )}
                  </div>
                </div>
                {habit.severity && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(habit.severity)}`}>
                    {habit.severity}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-500">Frequency: </span>
                    <span className="font-semibold text-slate-700">{habit.frequency}x/month</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Total: </span>
                    <span className="font-semibold text-orange-600">
                      Rs. {habit.total_cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suggestion */}
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-3 mt-2">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">💡 Suggestion: </span>
                  {habit.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        {habits.habits.length > 6 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all {habits.habits.length} habits →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingHabits;
