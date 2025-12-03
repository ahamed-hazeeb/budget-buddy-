import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { Transaction, TransactionType, Account } from '../types';
import { Search, Filter, Plus, Camera, X } from 'lucide-react';

const Transactions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'expense' ? TransactionType.EXPENSE : 
                      searchParams.get('type') === 'income' ? TransactionType.INCOME : 'ALL';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
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

  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
      // Sync filter with URL param if changed manually
      const type = searchParams.get('type');
      if(type === 'expense') setFilterType(TransactionType.EXPENSE);
      else if (type === 'income') setFilterType(TransactionType.INCOME);
  }, [searchParams]);

  const loadData = async () => {
    const [txns, accs] = await Promise.all([
      ApiService.getTransactions(),
      ApiService.getAccounts()
    ]);
    setTransactions(txns);
    setAccounts(accs);
    if(accs.length > 0) setFormData(prev => ({ ...prev, account: accs[0].name }));
  };

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

    await ApiService.addTransaction({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      account: formData.account,
      note: formData.note,
      type: formData.type
    });

    setIsModalOpen(false);
    loadData();
    // Reset form partially
    setFormData(prev => ({ ...prev, amount: '', note: '' }));
  };

  const simulateOCR = () => {
    setOcrLoading(true);
    // Mimic the "Scan Receipt" feature from PDF
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        amount: '1250',
        category: 'Groceries',
        note: 'Scanned Receipt: Supermarket',
        type: TransactionType.EXPENSE
      }));
      setOcrLoading(false);
    }, 1500);
  };

  const openModal = (type: TransactionType) => {
    setFormData(prev => ({ ...prev, type }));
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500">Manage your income and expenses.</p>
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter size={18} />
          <span className="font-medium">Filter:</span>
        </div>
        <div className="flex gap-2">
          {['ALL', TransactionType.INCOME, TransactionType.EXPENSE].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterType === type 
                  ? 'bg-blue-100 text-blue-700 border-blue-200 border' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All' : type === TransactionType.INCOME ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>
        <div className="ml-auto relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Account</th>
                <th className="p-4 font-semibold">Note</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 font-medium">{t.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      t.type === TransactionType.INCOME ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{t.account}</td>
                  <td className="p-4 text-slate-500 truncate max-w-xs">{t.note || '-'}</td>
                  <td className={`p-4 text-right font-bold ${
                    t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} Rs. {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No transactions found fitting criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {formData.type === TransactionType.INCOME ? 'Add Income' : 'Add Expense'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {formData.type === TransactionType.EXPENSE && (
                <div className="mb-4">
                  <button 
                    type="button" 
                    onClick={simulateOCR}
                    disabled={ocrLoading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {ocrLoading ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></span>
                    ) : (
                      <>
                        <Camera size={20} />
                        Scan Receipt (AI-Powered)
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-slate-400 mt-2">Simulates Tesseract.js OCR extraction</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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
                     {accounts.map(acc => (
                       <option key={acc.id} value={acc.name}>{acc.name}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <select 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {formData.type === TransactionType.INCOME 
                    ? ['Salary', 'Business', 'Bonus', 'Freelance', 'Other'].map(c => <option key={c} value={c}>{c}</option>)
                    : ['Food', 'Transport', 'Rent', 'Groceries', 'Bills', 'Travel', 'Shopping'].map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
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

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Note (Optional)</label>
                <textarea 
                  name="note"
                  rows={2}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition-transform active:scale-95 ${
                    formData.type === TransactionType.INCOME ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {formData.type === TransactionType.INCOME ? 'Add Income' : 'Add Expense'}
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
