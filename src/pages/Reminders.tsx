import React, { useState } from 'react';
import { Bell, Calendar, Mail, Plus, X } from 'lucide-react';
import { useBills, useCreateBill } from '../hooks/useBills';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Reminders: React.FC = () => {
  const { data: reminders = [], isLoading } = useBills();
  const createBill = useCreateBill();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    amount: '',
    category: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate || !formData.amount) return;

    await createBill.mutateAsync({
      title: formData.title,
      dueDate: formData.dueDate,
      amount: parseFloat(formData.amount),
      category: formData.category
    });

    setIsModalOpen(false);
    setFormData({ title: '', dueDate: '', amount: '', category: '' });
  };

  // Helper to determine status style
  const getStatusColor = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dueDate < today) return 'bg-red-100 text-red-600'; // Overdue
    if (dueDate === today) return 'bg-orange-100 text-orange-600'; // Due Today
    return 'bg-blue-100 text-blue-600'; // Upcoming
  };

  const getStatusText = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dueDate < today) return 'Overdue';
    if (dueDate === today) return 'Due Today';
    const days = Math.ceil((new Date(dueDate).getTime() - new Date(today).getTime()) / (1000 * 3600 * 24));
    return `In ${days} ${days === 1 ? 'day' : 'days'}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bill Reminders</h1>
          <p className="text-slate-500">Track upcoming bills and get email notifications.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} /> Add Reminder
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Bell size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No bill reminders yet</h3>
          <p className="text-slate-500 mb-4">Add your first bill reminder to never miss a payment.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus size={18} /> Add Your First Reminder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden hover:shadow-md transition-shadow">
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${getStatusColor(reminder.dueDate)}`}>
                {getStatusText(reminder.dueDate)}
              </div>

              <div className="flex items-start gap-4 mb-4 mt-2">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{reminder.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Calendar size={14} />
                    <span>{reminder.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Amount Due</p>
                  <p className="text-2xl font-bold text-slate-900">Rs. {reminder.amount.toLocaleString()}</p>
                </div>
              </div>

              {reminder.isPaid && (
                <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium text-center">
                  ✓ Paid
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Add New Reminder</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Bill Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="e.g. Electricity Bill"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                <input 
                  type="date" 
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Amount</label>
                <input 
                  type="number" 
                  name="amount"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category (Optional)</label>
                <input 
                  type="text" 
                  name="category"
                  placeholder="e.g. Utilities"
                  value={formData.category}
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
                  disabled={createBill.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createBill.isPending ? 'Adding...' : 'Add Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
