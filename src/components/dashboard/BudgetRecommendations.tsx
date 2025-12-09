import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { BudgetRecommendationsResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface BudgetRecommendationsProps {
  recommendations?: BudgetRecommendationsResponse;
  isLoading?: boolean;
  onApply?: () => void;
}

const BudgetRecommendations: React.FC<BudgetRecommendationsProps> = ({ 
  recommendations, 
  isLoading,
  onApply 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          AI Budget Recommendations
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!recommendations || !recommendations.recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          AI Budget Recommendations
        </h3>
        <div className="text-center py-8">
          <p className="text-slate-500">No recommendations available yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Set your total budget to get AI-powered allocation suggestions
          </p>
        </div>
      </div>
    );
  }

  const { recommendations: recs, total_budget, rule_applied, summary } = recommendations;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-sm border border-yellow-100 overflow-hidden">
      <div className="p-6 border-b border-yellow-100 bg-white/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={24} />
            AI Budget Recommendations
          </h3>
          {rule_applied && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
              {rule_applied} Rule
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Total Budget */}
        <div className="bg-white/70 rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-600 mb-1">Total Monthly Budget</p>
          <p className="text-2xl font-bold text-slate-900">
            Rs. {total_budget?.toLocaleString() || 0}
          </p>
        </div>

        {/* Summary if available (50/30/20 breakdown) */}
        {summary && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600 mb-1">Needs (50%)</p>
              <p className="text-lg font-bold text-green-600">
                Rs. {summary.needs?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600 mb-1">Wants (30%)</p>
              <p className="text-lg font-bold text-blue-600">
                Rs. {summary.wants?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600 mb-1">Savings (20%)</p>
              <p className="text-lg font-bold text-purple-600">
                Rs. {summary.savings?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        )}

        {/* Category Recommendations */}
        <div className="space-y-3 mb-4">
          <h4 className="font-semibold text-slate-800 text-sm">Category Allocations</h4>
          {recs.slice(0, 5).map((rec, index) => {
            const isDifferent = rec.recommended_amount !== rec.current_spending;
            const isOverspending = rec.current_spending > rec.recommended_amount;

            return (
              <div key={index} className="bg-white/70 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 text-sm">{rec.category}</span>
                    {!isDifferent && (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                  </div>
                  {isDifferent && (
                    <div className="flex items-center gap-1">
                      {isOverspending ? (
                        <TrendingDown size={16} className="text-red-500" />
                      ) : (
                        <TrendingUp size={16} className="text-green-500" />
                      )}
                      <span className={`text-xs font-semibold ${isOverspending ? 'text-red-600' : 'text-green-600'}`}>
                        {Math.abs(rec.variance).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Current: </span>
                    <span className={`font-semibold ${isOverspending ? 'text-red-600' : 'text-slate-700'}`}>
                      Rs. {rec.current_spending.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Recommended: </span>
                    <span className="font-semibold text-blue-600">
                      Rs. {rec.recommended_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${isOverspending ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ 
                      width: `${Math.min((rec.current_spending / rec.recommended_amount) * 100, 100)}%` 
                    }}
                  />
                </div>

                {rec.reasoning && (
                  <p className="text-xs text-slate-500 mt-2 italic">
                    {rec.reasoning}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Apply Button */}
        {onApply && (
          <button
            onClick={onApply}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Apply Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetRecommendations;
