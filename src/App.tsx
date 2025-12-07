import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Layout from the old structure
import Layout from '../components/Layout';

// Import pages - use new Dashboard, keep old pages for now
import Dashboard from './pages/Dashboard';
import Transactions from '../pages/Transactions';
import BudgetPage from '../pages/Budget';
import GoalsPage from '../pages/Goals';
import Reminders from '../pages/Reminders';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Accounts from '../pages/Accounts';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/budget" element={
            <ProtectedRoute>
              <Layout>
                <BudgetPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/goals" element={
            <ProtectedRoute>
              <Layout>
                <GoalsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/reminders" element={
            <ProtectedRoute>
              <Layout>
                <Reminders />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/bills" element={
            <ProtectedRoute>
              <Layout>
                <Reminders />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/accounts" element={
            <ProtectedRoute>
              <Layout>
                <Accounts />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
