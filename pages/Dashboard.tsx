import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ApiService } from '../services/api';
import { MonthlySummary, Transaction, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Plus, Wallet, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumData, txnData] = await Promise.all([
          ApiService.getSummary(),
          ApiService.getTransactions()
        ]);
        setSummary(sumData);
        setRecentTxns(txnData.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Income', value: summary.income, color: '#22c55e' }, // Green
    { name: 'Expense', value: summary.expenses, color: '#ef4444' }, // Red
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/transactions?type=income" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={18} /> Add Income
          </Link>
          <Link to="/transactions?type=expense" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={18} /> Add Expense
          </Link>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 font-medium mb-1">Current Balance</p>
          <h2 className="text-4xl font-bold mb-6">Rs. {summary.balance.toLocaleString()}</h2>
          <div className="flex gap-8">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-green-500/20 rounded-full">
                <ArrowUpCircle className="text-green-300" size={24} />
              </div>
              <div>
                <p className="text-xs text-blue-100">Income</p>
                <p className="font-semibold text-lg">Rs. {summary.income.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="p-2 bg-red-500/20 rounded-full">
                <ArrowDownCircle className="text-red-300" size={24} />
              </div>
              <div>
                <p className="text-xs text-blue-100">Expenses</p>
                <p className="font-semibold text-lg">Rs. {summary.expenses.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Wallet size={180} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Income vs Expenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm font-medium text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Status Bar (Simplified representation of breakdown) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Expense Breakdown</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                        { name: 'Rent', amount: 45000 },
                        { name: 'Groceries', amount: 35000 },
                        { name: 'Utils', amount: 12000 },
                        { name: 'Travel', amount: 8000 },
                        { name: 'Shop', amount: 15000 },
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                        <Tooltip 
                            formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
          <Link to="/transactions" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentTxns.map((txn) => (
            <div key={txn.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${txn.type === TransactionType.INCOME ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                `}>
                  {txn.type === TransactionType.INCOME ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{txn.category}</p>
                  <p className="text-xs text-slate-500">{txn.date} • {txn.account}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${txn.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type === TransactionType.INCOME ? '+' : '-'} Rs. {txn.amount.toLocaleString()}
                </p>
                {txn.note && <p className="text-xs text-slate-400 max-w-[150px] truncate">{txn.note}</p>}
              </div>
            </div>
          ))}
          {recentTxns.length === 0 && (
            <div className="p-8 text-center text-slate-500">No transactions found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
