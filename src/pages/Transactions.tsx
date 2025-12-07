import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TransactionType, Transaction } from '../types';
import { Search, Filter, Plus, X, Edit2, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories, useCreateCategory } from '../hooks/useCategories';
import { getUserId } from '../utils/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Transactions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'expense' ? TransactionType.EXPENSE : 
                      searchParams.get('type') === 'income' ? TransactionType.INCOME : 'ALL';

  // Fetch data
  const { data: transactions = [], isLoading: txnLoading } = useTransactions();
  const { data: accounts = [] } = useAccounts();
  const { data: allCategories = [] } = useCategories();
  
  // Mutations
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const createCategory = useCreateCategory();

  // State
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    account_id: '',
    note: '',
    type: TransactionType.EXPENSE
  });

  // New Category Form
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE'
  });

  // Get current user ID
  const currentUserId = getUserId();

  // Filter categories: global (user_id = null) + current user's categories
  const categories = useMemo(() => {
    return allCategories.filter(cat => {
      if (!cat.userId) return true; // Global category (null/undefined)
      const userId = parseInt(cat.userId);
      if (isNaN(userId)) return false; // Invalid userId
      return userId === currentUserId;
    });
  }, [allCategories, currentUserId]);

  // Create lookup maps
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  const accountMap = useMemo(() => {
    return accounts.reduce((acc, acc_item) => {
      acc[acc_item.id] = acc_item.name;
      return acc;
    }, {} as Record<string, string>);
  }, [accounts]);

  // Filter categories by transaction type
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.type === formData.type);
  }, [categories, formData.type]);

  useEffect(() => {
    // Set first account as default
    if (accounts.length > 0 && !formData.account_id) {
      setFormData(prev => ({ ...prev, account_id: accounts[0].id }));
    }
  }, [accounts, formData.account_id]);

  useEffect(() => {
    // Set first category of type as default
    if (filteredCategories.length > 0 && !formData.category_id) {
      setFormData(prev => ({ ...prev, category_id: filteredCategories[0].id }));
    }
  }, [filteredCategories, formData.category_id]);

  useEffect(() => {
    // Sync filter with URL param if changed manually
    const type = searchParams.get('type');
    if (type === 'expense') setFilterType(TransactionType.EXPENSE);
    else if (type === 'income') setFilterType(TransactionType.INCOME);
  }, [searchParams]);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filter by type - handle null/undefined and normalize to uppercase
      const txnType = t.type ? t.type.toString().toUpperCase() : '';
      const typeMatch = filterType === 'ALL' || txnType === filterType;
      
      // Filter by search query
      const categoryName = t.category_id ? categoryMap[t.category_id] : (t.category || '');
      const accountName = t.account_id ? accountMap[t.account_id] : (t.account || '');
      const searchMatch = !searchQuery || 
        categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery);
      
      return typeMatch && searchMatch;
    });
  }, [transactions, filterType, searchQuery, categoryMap, accountMap]);

  // Calculate stats
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => {
        const txnType = t.type ? t.type.toString().toLowerCase() : '';
        return txnType === 'income';
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = transactions
      .filter(t => {
        const txnType = t.type ? t.type.toString().toLowerCase() : '';
        return txnType === 'expense';
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category_id || !formData.account_id) return;

    const data = {
      amount: parseFloat(formData.amount),
      category_id: parseInt(formData.category_id),
      account_id: parseInt(formData.account_id),
      date: formData.date,
      note: formData.note,
      type: formData.type
    };

    if (isEditMode && editingTransactionId) {
      await updateTransaction.mutateAsync({ id: editingTransactionId, data });
    } else {
      await createTransaction.mutateAsync(data);
    }

    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingTransactionId(null);
    // Reset form partially
    setFormData(prev => ({ ...prev, amount: '', note: '' }));
  };

  const openModal = (type: TransactionType) => {
    setIsEditMode(false);
    setEditingTransactionId(null);
    setFormData(prev => ({ 
      ...prev, 
      type,
      amount: '',
      note: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0]
    }));
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setIsEditMode(true);
    setEditingTransactionId(transaction.id);
    setFormData({
      amount: transaction.amount.toString(),
      category_id: transaction.category_id?.toString() || '',
      account_id: transaction.account_id?.toString() || '',
      date: transaction.date,
      note: transaction.note || '',
      type: transaction.type.toString().toUpperCase() as TransactionType
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingTransactionId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTransactionId) return;
    await deleteTransaction.mutateAsync(deletingTransactionId);
    setIsDeleteModalOpen(false);
    setDeletingTransactionId(null);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryData.name) return;

    await createCategory.mutateAsync(newCategoryData);
    setIsCategoryModalOpen(false);
    setNewCategoryData({ name: '', type: 'EXPENSE' });
  };

  const openCreateCategoryModal = () => {
    setNewCategoryData({ name: '', type: formData.type });
    setIsCategoryModalOpen(true);
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold mt-2">Rs. {stats.income.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp size={32} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold mt-2">Rs. {stats.expenses.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingDown size={32} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Balance</p>
              <p className="text-3xl font-bold mt-2">Rs. {stats.balance.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Wallet size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
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
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {searchQuery ? 'No transactions found matching your search.' : 'No transactions found. Add your first transaction!'}
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
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((txn) => {
                  const categoryName = txn.category_id ? (categoryMap[txn.category_id] || 'Uncategorized') : (txn.category || 'Uncategorized');
                  const accountName = txn.account_id ? (accountMap[txn.account_id] || 'Unknown') : (txn.account || 'Unknown');
                  const txnType = txn.type ? txn.type.toString().toLowerCase() : '';
                  const isIncome = txnType === 'income';
                  
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{txn.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                          {categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{accountName}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{txn.note || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                        <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
                          {isIncome ? '+' : '-'} Rs. {txn.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(txn)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit transaction"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(txn.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditMode ? 'Edit' : 'Add'} {formData.type === TransactionType.INCOME ? 'Income' : 'Expense'}
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-500">Category</label>
                  <button
                    type="button"
                    onClick={openCreateCategoryModal}
                    className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={14} /> New Category
                  </button>
                </div>
                <select 
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                  name="account_id"
                  required
                  value={formData.account_id}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
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
                  disabled={createTransaction.isPending || updateTransaction.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createTransaction.isPending || updateTransaction.isPending ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Transaction</h2>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={deleteTransaction.isPending}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {deleteTransaction.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Create New Category</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Electricity, Mobile Reload"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                <select 
                  required
                  value={newCategoryData.type}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, type: e.target.value as 'INCOME' | 'EXPENSE' }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createCategory.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createCategory.isPending ? 'Creating...' : 'Create Category'}
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
