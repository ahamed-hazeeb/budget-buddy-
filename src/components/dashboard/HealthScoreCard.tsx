import React from 'react';
import { Heart, TrendingUp, Shield, DollarSign, Target } from 'lucide-react';
import { FinancialHealthScore } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface HealthScoreCardProps {
  score?: FinancialHealthScore;
  isLoading?: boolean;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Heart className="text-red-500" size={24} />
          Financial Health Score
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Heart className="text-red-500" size={24} />
          Financial Health Score
        </h3>
        <div className="text-center py-8">
          <p className="text-slate-500">No health score available yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Add at least 3 months of transactions to calculate your score
          </p>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-500 text-white';
      case 'B':
        return 'bg-blue-500 text-white';
      case 'C':
        return 'bg-yellow-500 text-white';
      case 'D':
        return 'bg-orange-500 text-white';
      case 'F':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const components = [
    { label: 'Savings Rate', value: score.savings_rate_score, icon: DollarSign },
    { label: 'Expense Consistency', value: score.expense_consistency_score, icon: TrendingUp },
    { label: 'Emergency Fund', value: score.emergency_fund_score, icon: Shield },
    ...(score.debt_ratio_score !== undefined ? [{ label: 'Debt Ratio', value: score.debt_ratio_score, icon: Shield }] : []),
    ...(score.goal_progress_score !== undefined ? [{ label: 'Goal Progress', value: score.goal_progress_score, icon: Target }] : []),
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            Financial Health Score
          </h3>
          <div className={`px-4 py-2 rounded-full font-bold text-2xl ${getGradeColor(score.grade)}`}>
            {score.grade}
          </div>
        </div>

        {/* Main Score */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold ${getScoreColor(score.score)} mb-2`}>
            {score.score}
          </div>
          <p className="text-slate-600 font-medium">out of 100</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor(score.score)} transition-all duration-1000 ease-out`}
              style={{ width: `${score.score}%` }}
            />
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-3 mb-6">
          {components.map((component) => (
            <div key={component.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <component.icon size={16} className="text-slate-500" />
                <span className="text-sm text-slate-600">{component.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(component.value)}`}
                    style={{ width: `${component.value}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-10 text-right">
                  {component.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {score.recommendations && score.recommendations.length > 0 && (
          <div className="bg-white/70 rounded-xl p-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Top Recommendations</h4>
            <ul className="space-y-2">
              {score.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthScoreCard;
