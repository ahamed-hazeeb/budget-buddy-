import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPage from './pages/Budget';
import GoalsPage from './pages/Goals';

// Placeholder components for routes not fully detailed in this iteration
const Reminders = () => (
  <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100">
    <h2 className="text-xl font-bold mb-2">Bill Reminders</h2>
    <p className="text-slate-500">Feature coming soon. Will list upcoming bills.</p>
  </div>
);

const Accounts = () => (
   <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100">
    <h2 className="text-xl font-bold mb-2">My Accounts</h2>
    <p className="text-slate-500">Manage Bank, Cash, and Card accounts here.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
