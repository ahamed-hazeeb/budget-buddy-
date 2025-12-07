import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpCircle, ArrowDownCircle, ArrowRight } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  limit = 5 
}) => {
  const displayTransactions = transactions.slice(0, limit);

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <p className="text-slate-500">No transactions yet</p>
          <Link 
            to="/transactions" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first transaction →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
        <Link 
          to="/transactions" 
          className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="divide-y divide-slate-100">
        {displayTransactions.map((txn) => (
          <div 
            key={txn.id} 
            className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${txn.type === TransactionType.INCOME 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
                }
              `}>
                {txn.type === TransactionType.INCOME 
                  ? <ArrowUpCircle size={20} /> 
                  : <ArrowDownCircle size={20} />
                }
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{txn.category}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatDate(txn.date)}</span>
                  <span>•</span>
                  <span>{txn.account}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0 ml-4">
              <p className={`font-bold ${
                txn.type === TransactionType.INCOME 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {txn.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(txn.amount)}
              </p>
              {txn.note && (
                <p className="text-xs text-slate-400 max-w-[150px] truncate">
                  {txn.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
