import React from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { MLInsight } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface MLInsightsProps {
  insights: MLInsight[];
  isLoading?: boolean;
}

const MLInsights: React.FC<MLInsightsProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          AI Insights
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          AI Insights
        </h3>
        <div className="text-center py-8">
          <Sparkles className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500">No insights available yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Add more transactions to get AI-powered insights
          </p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'achievement':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'suggestion':
        return <TrendingUp className="text-blue-600" size={20} />;
      default:
        return <Sparkles className="text-purple-600" size={20} />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 border-orange-100';
      case 'achievement':
        return 'bg-green-50 border-green-100';
      case 'suggestion':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-purple-50 border-purple-100';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-700',
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    );
  };

  // Sort by priority and limit to top 3
  const sortedInsights = [...insights]
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          AI Insights
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {sortedInsights.map((insight) => (
          <div
            key={insight.id}
            className={`border rounded-xl p-4 ${getInsightBgColor(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {insight.title}
                  </h4>
                  {getPriorityBadge(insight.priority)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {insight.description}
                </p>
                {insight.category && (
                  <div className="mt-2">
                    <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md">
                      {insight.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MLInsights;
