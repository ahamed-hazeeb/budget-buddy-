import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';
import { BehaviorNudgesResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface BehaviorNudgesProps {
  nudges?: BehaviorNudgesResponse;
  isLoading?: boolean;
}

const BehaviorNudges: React.FC<BehaviorNudgesProps> = ({ nudges, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="text-purple-600" size={24} />
          Behavior Nudges
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!nudges || !nudges.nudges || nudges.nudges.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="text-purple-600" size={24} />
          Behavior Nudges
        </h3>
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-green-400 mb-2" size={48} />
          <p className="text-slate-500">You're doing great!</p>
          <p className="text-sm text-slate-400 mt-1">
            No urgent actions needed
          </p>
        </div>
      </div>
    );
  }

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} className="text-orange-600" />;
      case 'positive':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'reminder':
        return <Info size={20} className="text-blue-600" />;
      default:
        return <Bell size={20} className="text-purple-600" />;
    }
  };

  const getNudgeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'reminder':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${colors[urgency as keyof typeof colors]}`}>
        {urgency === 'high' ? '🔥' : urgency === 'medium' ? '⚡' : '💡'} {urgency}
      </span>
    );
  };

  // Sort by urgency: high -> medium -> low
  const sortedNudges = [...nudges.nudges].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-purple-600" size={24} />
            Behavior Nudges
          </h3>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span className="text-sm text-slate-600">{nudges.nudges.length} nudges</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {sortedNudges.slice(0, 5).map((nudge, index) => (
          <div
            key={index}
            className={`border rounded-xl p-4 ${getNudgeColor(nudge.type)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNudgeIcon(nudge.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {nudge.message}
                  </p>
                  {getUrgencyBadge(nudge.urgency)}
                </div>

                {nudge.action_required && (
                  <div className="bg-white/70 rounded-lg p-3 mt-2 border border-slate-200">
                    <p className="text-xs text-slate-700">
                      <span className="font-semibold">Action Required: </span>
                      {nudge.action_required}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedNudges.length > 5 && (
          <div className="text-center pt-2">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View all {sortedNudges.length} nudges →
            </button>
          </div>
        )}
      </div>

      {nudges.generated_at && (
        <div className="px-6 pb-4">
          <p className="text-xs text-slate-400 text-center">
            Generated {new Date(nudges.generated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default BehaviorNudges;
