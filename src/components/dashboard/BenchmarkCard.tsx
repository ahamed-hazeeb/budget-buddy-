import React from 'react';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import { BenchmarkData } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface BenchmarkCardProps {
  benchmark?: BenchmarkData;
  isLoading?: boolean;
}

const BenchmarkCard: React.FC<BenchmarkCardProps> = ({ benchmark, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="text-indigo-600" size={24} />
          Peer Benchmark
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!benchmark) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="text-indigo-600" size={24} />
          Peer Benchmark
        </h3>
        <div className="text-center py-8">
          <p className="text-slate-500">No benchmark data available</p>
          <p className="text-sm text-slate-400 mt-1">
            Add more transactions to compare with peers
          </p>
        </div>
      </div>
    );
  }

  const getComparisonIcon = (userValue: number, peerValue: number) => {
    if (userValue > peerValue) return '📈';
    if (userValue < peerValue) return '📉';
    return '➡️';
  };

  const getComparisonColor = (userValue: number, peerValue: number, isSavingsRate = false) => {
    // For savings rate, higher is better
    if (isSavingsRate) {
      if (userValue > peerValue) return 'text-green-600';
      if (userValue < peerValue) return 'text-red-600';
    } else {
      // For expense ratio, lower is better
      if (userValue < peerValue) return 'text-green-600';
      if (userValue > peerValue) return 'text-red-600';
    }
    return 'text-blue-600';
  };

  const getRankBadgeColor = (rank: string) => {
    if (rank.includes('Top 10%')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (rank.includes('Top 25%')) return 'bg-green-100 text-green-700 border-green-300';
    if (rank.includes('Top 50%')) return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
      <div className="p-6 border-b border-indigo-100 bg-white/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={24} />
            Peer Benchmark
          </h3>
          {benchmark.comparison?.rank && (
            <div className={`px-3 py-1 rounded-full border font-semibold text-xs ${getRankBadgeColor(benchmark.comparison.rank)}`}>
              <Award size={12} className="inline mr-1" />
              {benchmark.comparison.rank}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Comparison Metrics */}
        <div className="space-y-4 mb-6">
          {/* Savings Rate */}
          <div className="bg-white/70 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-green-600" />
                <h4 className="font-semibold text-slate-800 text-sm">Savings Rate</h4>
              </div>
              <span className="text-xl">
                {getComparisonIcon(benchmark.user_metrics.savings_rate, benchmark.peer_average.savings_rate)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">You</p>
                <p className={`text-xl font-bold ${getComparisonColor(benchmark.user_metrics.savings_rate, benchmark.peer_average.savings_rate, true)}`}>
                  {benchmark.user_metrics.savings_rate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Peer Avg</p>
                <p className="text-xl font-bold text-slate-600">
                  {benchmark.peer_average.savings_rate.toFixed(1)}%
                </p>
              </div>
            </div>
            {benchmark.comparison?.savings_rate_percentile !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Percentile</span>
                  <span className="font-semibold">{benchmark.comparison.savings_rate_percentile.toFixed(0)}th</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${benchmark.comparison.savings_rate_percentile}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Expense Ratio */}
          <div className="bg-white/70 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" />
                <h4 className="font-semibold text-slate-800 text-sm">Expense Ratio</h4>
              </div>
              <span className="text-xl">
                {getComparisonIcon(benchmark.peer_average.expense_ratio, benchmark.user_metrics.expense_ratio)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">You</p>
                <p className={`text-xl font-bold ${getComparisonColor(benchmark.user_metrics.expense_ratio, benchmark.peer_average.expense_ratio)}`}>
                  {benchmark.user_metrics.expense_ratio.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Peer Avg</p>
                <p className="text-xl font-bold text-slate-600">
                  {benchmark.peer_average.expense_ratio.toFixed(1)}%
                </p>
              </div>
            </div>
            {benchmark.comparison?.expense_ratio_percentile !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Percentile</span>
                  <span className="font-semibold">{benchmark.comparison.expense_ratio_percentile.toFixed(0)}th</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${benchmark.comparison.expense_ratio_percentile}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Monthly Surplus */}
          <div className="bg-white/70 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-semibold text-slate-800 text-sm">Monthly Surplus</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">You</p>
                <p className="text-xl font-bold text-purple-600">
                  Rs. {benchmark.user_metrics.monthly_surplus.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Peer Avg</p>
                <p className="text-xl font-bold text-slate-600">
                  Rs. {benchmark.peer_average.monthly_surplus.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {benchmark.insights && benchmark.insights.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-900 text-sm mb-2 flex items-center gap-2">
              <Award size={16} />
              Key Insights
            </h4>
            <ul className="space-y-2">
              {benchmark.insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-xs text-indigo-800 flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkCard;
