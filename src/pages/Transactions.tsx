import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TransactionType } from '../types';
import { Search, Filter, Plus, X } from 'lucide-react';
import { useTransactions, useCreateTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Transactions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'expense' ? TransactionType.EXPENSE : 
                      searchParams.get('type') === 'income' ? TransactionType.INCOME : 'ALL';

  const { data: transactions = [], isLoading: txnLoading } = useTransactions();
  const { data: accounts = [] } = useAccounts();
  const createTransaction = useCreateTransaction();

  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>(initialType);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    account: '',
    note: '',
    type: TransactionType.EXPENSE
  });

  useEffect(() => {
    // Set first account as default
    if (accounts.length > 0 && !formData.account) {
      setFormData(prev => ({ ...prev, account: accounts[0].name }));
    }
  }, [accounts, formData.account]);

  useEffect(() => {
    // Sync filter with URL param if changed manually
    const type = searchParams.get('type');
    if (type === 'expense') setFilterType(TransactionType.EXPENSE);
    else if (type === 'income') setFilterType(TransactionType.INCOME);
  }, [searchParams]);

  const filteredTransactions = transactions.filter(t => 
    filterType === 'ALL' ? true : t.type === filterType
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    await createTransaction.mutateAsync({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      account: formData.account,
      note: formData.note,
      type: formData.type
    });

    setIsModalOpen(false);
    // Reset form partially
    setFormData(prev => ({ ...prev, amount: '', note: '' }));
  };

  const openModal = (type: TransactionType) => {
    setFormData(prev => ({ ...prev, type }));
    setIsModalOpen(true);
  };

  if (txnLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500">Track all your income and expenses.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => openModal(TransactionType.INCOME)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={18} /> Add Income
          </button>
          <button 
            onClick={() => openModal(TransactionType.EXPENSE)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <button 
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'ALL' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilterType(TransactionType.INCOME)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === TransactionType.INCOME ? 'bg-green-100 text-green-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Income
        </button>
        <button 
          onClick={() => setFilterType(TransactionType.EXPENSE)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === TransactionType.EXPENSE ? 'bg-red-100 text-red-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No transactions found. Add your first transaction!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{txn.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{txn.account}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{txn.note || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      <span className={txn.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}>
                        {txn.type === TransactionType.INCOME ? '+' : '-'} Rs. {txn.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                Add {formData.type === TransactionType.INCOME ? 'Income' : 'Expense'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Amount</label>
                <input 
                  type="number" 
                  name="amount"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <input 
                  type="text" 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Groceries, Salary"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Account</label>
                <select 
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.name}>{acc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Note (Optional)</label>
                <textarea 
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Add a note..."
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
                  disabled={createTransaction.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createTransaction.isPending ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
