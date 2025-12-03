import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Reminder } from '../types';
import { Bell, Calendar, Mail, Plus, X, CheckCircle, Clock } from 'lucide-react';

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    amount: '',
    sendEmail: false
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getReminders();
      setReminders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate || !formData.amount) return;

    await ApiService.addReminder({
      title: formData.title,
      dueDate: formData.dueDate,
      amount: parseFloat(formData.amount),
      sendEmail: formData.sendEmail
    });

    setIsModalOpen(false);
    setFormData({ title: '', dueDate: '', amount: '', sendEmail: false });
    loadReminders();
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
    return `In ${days} days`;
  };

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

      {loading ? (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
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

                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                    {reminder.sendEmail ? (
                        <>
                            <Mail size={16} className="text-blue-500" />
                            <span className="text-blue-600 font-medium">Email Alert Enabled</span>
                        </>
                    ) : (
                        <>
                            <Mail size={16} className="text-slate-300" />
                            <span className="text-slate-400">No Email Alert</span>
                        </>
                    )}
                </div>
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
                <label className="block text-xs font-semibold text-slate-500 mb-1">Amount (Rs)</label>
                <input 
                  type="number" 
                  name="amount"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <input 
                  type="checkbox" 
                  id="sendEmail"
                  name="sendEmail"
                  checked={formData.sendEmail}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendEmail" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                    Send Email Notification
                    <p className="text-xs text-slate-400 font-normal">Receive an alert 2 days before due date</p>
                </label>
                <Mail className="text-blue-400" size={20} />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-transform active:scale-95"
                >
                  Save Reminder
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