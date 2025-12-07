import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface DashboardStatsProps {
  income: number;
  expenses: number;
  balance: number;
  savings?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  income, 
  expenses, 
  balance, 
  savings 
}) => {
  const calculatedSavings = savings !== undefined ? savings : income - expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Balance */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-100 text-sm font-medium">Total Balance</span>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Wallet size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1">{formatCurrency(balance)}</p>
        <p className="text-blue-100 text-xs">Current account balance</p>
      </div>

      {/* Total Income */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600 text-sm font-medium">Total Income</span>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <ArrowUpCircle className="text-green-600" size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(income)}</p>
        <p className="text-slate-500 text-xs">This month</p>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600 text-sm font-medium">Total Expenses</span>
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <ArrowDownCircle className="text-red-600" size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(expenses)}</p>
        <p className="text-slate-500 text-xs">This month</p>
      </div>

      {/* Savings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600 text-sm font-medium">Savings</span>
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-purple-600" size={20} />
          </div>
        </div>
        <p className={`text-3xl font-bold mb-1 ${calculatedSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(calculatedSavings)}
        </p>
        <p className="text-slate-500 text-xs">
          {calculatedSavings >= 0 ? 'Positive balance' : 'Deficit'}
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;
