import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Plus, X } from 'lucide-react';
import { useBudgets, useCreateBudget } from '../hooks/useBudget';
import { useMLInsights } from '../hooks/useMLInsights';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Budget: React.FC = () => {
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: mlInsightsData, isLoading: mlLoading } = useMLInsights();
  const createBudget = useCreateBudget();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Overall',
    limit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.limit) return;

    await createBudget.mutateAsync({
      category: formData.category,
      limit: parseFloat(formData.limit),
      startDate: formData.startDate,
      endDate: formData.endDate
    });

    setIsModalOpen(false);
    setFormData({
      category: 'Overall',
      limit: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const calculatePercentage = (spent: number, limit: number) => {
    return Math.min(100, Math.round((spent / limit) * 100));
  };

  if (budgetsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budget & AI Planning</h1>
          <p className="text-slate-500">Track your spending limits and get AI recommendations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} /> Set Budget
        </button>
      </div>

      {/* AI Insights Section */}
      {mlInsightsData?.insights && mlInsightsData.insights.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-2 text-indigo-200">
              <Sparkles size={20} />
              <span className="font-semibold uppercase tracking-wider text-xs">AI-Powered Insights</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Smart Financial Recommendations</h2>
            <p className="text-indigo-100 mb-6">
              Our Machine Learning model analyzes your spending patterns to provide personalized insights.
            </p>
            
            <div className="space-y-3">
              {mlInsightsData.insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-indigo-100">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 opacity-10 p-8">
            <TrendingUp size={200} />
          </div>
        </div>
      )}

      {/* Budget List */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No budgets set yet</h3>
          <p className="text-slate-500 mb-4">Create your first budget to start tracking your spending.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus size={18} /> Set Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = calculatePercentage(budget.spent, budget.limit);
            const isOverBudget = budget.spent > budget.limit;

            return (
              <div key={budget.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Spent</span>
                      <span className="font-semibold text-slate-900">Rs. {budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Budget Limit</span>
                    <span className="font-semibold text-slate-900">Rs. {budget.limit.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Remaining</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      Rs. {Math.max(0, budget.limit - budget.spent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Set Budget</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <input 
                  type="text" 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Overall, Food, Transport"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Budget Limit</label>
                <input 
                  type="number" 
                  name="limit"
                  step="0.01"
                  required
                  value={formData.limit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                <input 
                  type="date" 
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                <input 
                  type="date" 
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createBudget.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createBudget.isPending ? 'Creating...' : 'Create Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
