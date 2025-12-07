import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

const Goals: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 max-w-md">
        <Construction size={64} className="mx-auto text-yellow-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Goals Page - Under Development
        </h2>
        <p className="text-slate-600 mb-6">
          This page is being migrated to use the real backend API.
          The mock data version has been removed to prevent confusion.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Goals;
