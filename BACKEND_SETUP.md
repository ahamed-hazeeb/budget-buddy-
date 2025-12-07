# Backend Setup Instructions

## Prerequisites

The frontend expects a Node.js/Express backend running on `http://localhost:3000` with the following API endpoints:

### Authentication Endpoints
- `POST /api/users/login` - Login with email and password
- `POST /api/users/register` - Register new user
- `GET /api/users/profile` - Get user profile (requires JWT)

### Data Endpoints
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account

### ML Endpoints (Optional)
- `GET /api/ml/health` - Check ML service health
- `POST /api/ml/train` - Train ML model
- `GET /api/ml/predictions` - Get savings predictions
- `GET /api/ml/insights` - Get AI insights
- `GET /api/ml/insights/summary` - Get insights summary
- `POST /api/ml/goals/timeline` - Calculate goal timeline
- `POST /api/ml/goals/reverse-plan` - Create reverse plan for goal

## Backend Not Ready Yet?

If your backend is not fully implemented, the frontend will gracefully handle missing endpoints:

1. **404 errors** are logged to console but don't show error toasts
2. **Empty data** - Components show "No data" states
3. **ML endpoints** - Optional, dashboard works without them

### Development Mode

The frontend will continue to work with mock data if backend endpoints return 404. React Query will:
- Cache failed requests and not retry
- Return empty arrays (`[]`) as fallback
- Components will show "Add your first..." messages

### Setting Up Environment

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Update `.env` with your backend URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

3. Start your backend on port 3000

4. Start the frontend:
```bash
npm run dev
```

The frontend runs on port 3001 and proxies `/api` requests to your backend.

## CORS Configuration

Your backend must allow CORS from `http://localhost:3001`:

```javascript
// Express.js example
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

## Authentication

The frontend expects JWT tokens in responses:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

The token is:
- Stored in `localStorage` as `bb_token`
- Automatically sent in `Authorization: Bearer <token>` header
- Cleared on 401 responses (auto-logout)

## Debugging

### Console Warnings

If you see these warnings in the console, it means backend endpoints are not implemented:

```
API endpoint not found: /api/transactions
Bad request to: /api/ml/insights
```

This is **expected during development** and won't break the UI.

### Network Tab

Check the browser's Network tab to see:
- Which endpoints return 404
- Request/response headers
- JWT token in Authorization header

### Testing Backend Connectivity

```bash
# Test if backend is running
curl http://localhost:3000/api/health

# Test login endpoint
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Next Steps

1. Implement backend endpoints one by one
2. The frontend will automatically start using real data
3. No frontend changes needed as backend becomes available
4. ML endpoints are optional - implement last

See `INTEGRATION_GUIDE.md` for more details.
