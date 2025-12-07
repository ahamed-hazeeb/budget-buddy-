import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Banknote, Plus, X, Trash2 } from 'lucide-react';
import { useAccounts, useCreateAccount, useDeleteAccount } from '../hooks/useAccounts';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Accounts: React.FC = () => {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();
  const [totalBalance, setTotalBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Cash' as const,
    balance: ''
  });

  useEffect(() => {
    const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    setTotalBalance(total);
  }, [accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.balance) return;

    await createAccount.mutateAsync({
      name: newAccount.name,
      type: newAccount.type,
      balance: parseFloat(newAccount.balance)
    });

    setIsModalOpen(false);
    setNewAccount({ name: '', type: 'Cash', balance: '' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteAccount.mutateAsync(id);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Bank': return <Landmark size={24} />;
      case 'Card': return <CreditCard size={24} />;
      default: return <Banknote size={24} />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'Bank': return 'bg-purple-100 text-purple-600';
      case 'Card': return 'bg-blue-100 text-blue-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-500">Manage your financial sources.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} /> Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500 font-medium mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold text-slate-900">Rs. {totalBalance.toLocaleString()}</h2>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No accounts yet</h3>
          <p className="text-slate-500 mb-4">Add your first account to start tracking your finances.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus size={18} /> Add Your First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColor(acc.type)}`}>
                  {getIcon(acc.type)}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getColor(acc.type)}`}>
                  {acc.type}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">{acc.name}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-2">Rs. {acc.balance.toLocaleString()}</p>
              
              <button 
                onClick={() => handleDelete(acc.id, acc.name)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Add New Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Account Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. HNB Savings"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Account Type</label>
                <select 
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({...newAccount, type: e.target.value as any})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current Balance</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
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
                  disabled={createAccount.isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {createAccount.isPending ? 'Adding...' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
