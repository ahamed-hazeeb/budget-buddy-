import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Goal } from '../types';
import { Target, Calendar, Trash2 } from 'lucide-react';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    ApiService.getGoals().then(setGoals);
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Future Plans</h1>
          <p className="text-slate-500">Set savings goals and track your progress.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
          + Add New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          
          return (
            <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Target size={24} />
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{goal.name}</h3>
              <div className="flex items-center gap-1 text-slate-400 text-sm mb-6">
                <Calendar size={14} />
                <span>Target: {goal.targetDate}</span>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-2">
                   <span className="font-semibold text-slate-700">Rs. {goal.currentAmount.toLocaleString()}</span>
                   <span className="text-slate-500">of Rs. {goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Monthly Savings Needed</p>
                  <p className="text-lg font-bold text-blue-600">Rs. {goal.monthlyContribution.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsPage;
