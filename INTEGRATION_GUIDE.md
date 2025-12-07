# Budget Buddy - Frontend Backend Integration Guide

This guide explains how to integrate the React TypeScript frontend with the Node.js backend API.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:3000`
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=30000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend runs on `http://localhost:3001`

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
budget-buddy-/
├── src/                          # New architecture (integrated)
│   ├── api/
│   │   └── client.ts            # Axios instance with interceptors
│   ├── services/                # API service layer
│   │   ├── authService.ts
│   │   ├── transactionService.ts
│   │   ├── budgetService.ts
│   │   ├── goalService.ts
│   │   ├── billService.ts
│   │   ├── categoryService.ts
│   │   ├── accountService.ts
│   │   └── mlService.ts
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── hooks/                   # React Query hooks
│   │   ├── useTransactions.ts
│   │   ├── useBudget.ts
│   │   ├── useGoals.ts
│   │   └── useMLInsights.ts
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   ├── dashboard/           # Dashboard-specific
│   │   ├── transactions/        # (To be implemented)
│   │   └── ml/                  # (To be implemented)
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── pages/
│   │   └── Dashboard.tsx        # Integrated example
│   ├── App.tsx
│   └── main.tsx                 # Entry point with providers
├── pages/                        # Old pages (to be migrated)
├── components/                   # Old components
├── context/                      # Old context (compatibility)
├── services/api.ts              # Old mock API
├── types.ts                     # Old types
├── vite.config.ts
├── package.json
└── .env.example
```

## 🔧 Key Features

### 1. API Client (`src/api/client.ts`)
- Automatic JWT token injection
- 401 error handling with auto-redirect
- Toast notifications for errors
- TypeScript typed responses

### 2. Service Layer
Each service handles a specific domain:
```typescript
// Example: Transaction Service
import transactionService from './services/transactionService';

// Get all transactions
const transactions = await transactionService.getAll();

// Create transaction
const newTxn = await transactionService.create({
  date: '2025-01-01',
  amount: 1000,
  category: 'Food',
  account: 'Cash',
  type: 'EXPENSE'
});
```

### 3. React Query Hooks
Simplified data fetching with caching:
```typescript
import { useTransactions, useCreateTransaction } from './hooks/useTransactions';

function MyComponent() {
  // Fetch data
  const { data: transactions, isLoading } = useTransactions();
  
  // Mutations
  const createMutation = useCreateTransaction();
  
  const handleCreate = () => {
    createMutation.mutate(transactionData);
  };
}
```

### 4. Authentication Flow
```typescript
import { useAuth } from './contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    await login({ email, password });
    // Token automatically stored and used for all requests
  };
}
```

## 🎨 Component Usage

### Dashboard Stats
```typescript
import DashboardStats from './components/dashboard/DashboardStats';

<DashboardStats
  income={totalIncome}
  expenses={totalExpenses}
  balance={totalBalance}
/>
```

### Recent Transactions
```typescript
import RecentTransactions from './components/dashboard/RecentTransactions';

<RecentTransactions 
  transactions={transactions} 
  limit={5} 
/>
```

### Budget Progress
```typescript
import BudgetProgress from './components/dashboard/BudgetProgress';

<BudgetProgress 
  budgets={budgets} 
  limit={3} 
/>
```

### ML Insights
```typescript
import MLInsights from './components/dashboard/MLInsights';

<MLInsights 
  insights={mlInsightsData?.insights} 
  isLoading={mlLoading} 
/>
```

## 🔐 Security Features

1. **Strong Password Validation**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

2. **Token Management**
   - JWT tokens stored securely in localStorage
   - Automatic token injection in requests
   - Auto-logout on 401 responses

3. **Error Handling**
   - Centralized error handling
   - User-friendly error messages
   - No sensitive data in client logs

## 📊 Data Flow

```
User Action → Component → React Query Hook → Service → API Client → Backend
                                     ↓
                              Cache Update
                                     ↓
                          UI Auto-Refresh
```

## 🧪 Testing the Integration

### 1. Start Backend
```bash
cd backend
npm start
# Backend runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd budget-buddy-
npm run dev
# Frontend runs on http://localhost:3001
```

### 3. Test Flow
1. Navigate to `http://localhost:3001`
2. Register a new account
3. Login with credentials
4. View dashboard with real data
5. Test CRUD operations

### 4. Monitor Network
- Open browser DevTools → Network tab
- See API calls to `/api/*` proxied to backend
- Verify JWT token in Authorization headers

## 📝 Migration Guide

To migrate existing pages to use the new architecture:

1. **Replace old API service**
   ```typescript
   // Old
   import { ApiService } from '../services/api';
   const data = await ApiService.getTransactions();
   
   // New
   import { useTransactions } from '../src/hooks/useTransactions';
   const { data } = useTransactions();
   ```

2. **Add React Query**
   - Replace useState/useEffect with React Query hooks
   - Benefits: auto-caching, loading states, error handling

3. **Update types**
   ```typescript
   // Import from new types
   import { Transaction, TransactionType } from '../src/types';
   ```

4. **Use new utilities**
   ```typescript
   import { formatCurrency, formatDate } from '../src/utils/formatters';
   ```

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend has CORS enabled for `http://localhost:3001`
- Check Vite proxy configuration in `vite.config.ts`

### 401 Errors
- Check token is being stored: `localStorage.getItem('bb_token')`
- Verify backend accepts Bearer token format
- Check token expiration

### Network Errors
- Verify backend is running on port 3000
- Check `.env` configuration
- Inspect browser console for errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## 📚 Additional Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [Vite Docs](https://vitejs.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## 🤝 Contributing

When adding new features:

1. Add types in `src/types/index.ts`
2. Create service in `src/services/`
3. Create React Query hooks in `src/hooks/`
4. Create components in `src/components/`
5. Update pages to use new components

## 📄 License

This project is part of Budget Buddy application.

---

For more details, see `INTEGRATION_STATUS.md`
