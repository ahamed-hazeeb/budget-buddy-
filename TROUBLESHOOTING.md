# Troubleshooting Backend Connection Issues

## Problem: Getting 404 Errors for All Endpoints

If you're seeing console warnings like:
```
❌ API endpoint not found: /transactions
❌ API endpoint not found: /budgets
❌ API endpoint not found: /accounts
```

This means the frontend cannot find your backend endpoints. Here's how to fix it:

---

## Step 1: Verify Backend is Running

```bash
# Check if backend is running on port 3000
curl http://localhost:3000

# Or try
curl http://localhost:3000/api

# You should get a response, not "Connection refused"
```

If you get "Connection refused", **your backend is not running**.

---

## Step 2: Check Backend Routes

The frontend expects these exact paths:

### ✅ With /api prefix:
```
http://localhost:3000/api/users/login
http://localhost:3000/api/transactions
http://localhost:3000/api/budgets
http://localhost:3000/api/accounts
```

### Common Backend Mistakes:

#### ❌ Wrong: Routes without /api prefix
```javascript
// Backend: app.js or server.js
app.get('/transactions', ...)  // ❌ Missing /api
```

#### ✅ Correct: Routes with /api prefix
```javascript
// Backend: app.js or server.js
app.use('/api', routes);  // ✅ All routes under /api

// OR

app.get('/api/transactions', ...)  // ✅ Include /api in each route
```

---

## Step 3: Test Backend Endpoints Manually

```bash
# Test if your backend responds to these URLs:

# 1. Test base URL
curl http://localhost:3000/api
# Should return something, not 404

# 2. Test transactions endpoint
curl http://localhost:3000/api/transactions
# Should return [] or list of transactions

# 3. Test with authentication (if required)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/transactions
```

---

## Step 4: Check CORS Configuration

Your backend MUST allow requests from `http://localhost:3001`:

### Express.js Example:
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

### Check Browser Console:
If you see CORS errors like:
```
Access to XMLHttpRequest at 'http://localhost:3000/api/transactions' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

This means CORS is not configured correctly in your backend.

---

## Step 5: Verify Frontend Configuration

Check your `.env` file:
```bash
cat .env
```

Should contain:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

**Important:** After changing `.env`, you MUST restart the frontend:
```bash
# Stop the frontend (Ctrl+C)
# Start again
npm run dev
```

---

## Step 6: Common Backend Structures

### Option A: All routes under /api prefix
```javascript
// server.js
const express = require('express');
const app = express();

// Import your route files
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');

// Mount all routes under /api
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/users', userRoutes);

app.listen(3000, () => console.log('Server on port 3000'));
```

### Option B: Use API router
```javascript
// server.js
const express = require('express');
const app = express();
const apiRouter = express.Router();

// Define routes on apiRouter
apiRouter.get('/transactions', transactionController.getAll);
apiRouter.get('/budgets', budgetController.getAll);
apiRouter.get('/accounts', accountController.getAll);
apiRouter.post('/users/login', authController.login);

// Mount apiRouter under /api
app.use('/api', apiRouter);

app.listen(3000, () => console.log('Server on port 3000'));
```

---

## Step 7: Quick Backend Test Server

If you don't have a backend yet, here's a minimal test server:

```javascript
// test-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// Test endpoints
app.post('/api/users/login', (req, res) => {
  res.json({
    token: 'test-token-123',
    user: { id: '1', name: 'Test User', email: req.body.email }
  });
});

app.get('/api/transactions', (req, res) => {
  res.json([
    { id: '1', date: '2025-01-01', amount: 100, category: 'Food', type: 'EXPENSE' }
  ]);
});

app.get('/api/budgets', (req, res) => {
  res.json([]);
});

app.get('/api/accounts', (req, res) => {
  res.json([
    { id: '1', name: 'Cash', type: 'Cash', balance: 1000 }
  ]);
});

app.listen(3000, () => {
  console.log('✅ Test backend running on http://localhost:3000');
  console.log('Test with: curl http://localhost:3000/api/transactions');
});
```

Run it:
```bash
node test-server.js
```

---

## Step 8: Check Network Tab in Browser

1. Open your app in browser (`http://localhost:3001`)
2. Press F12 to open DevTools
3. Go to "Network" tab
4. Login to your app
5. Look at the requests:

### What to check:
- **Request URL**: Should be `http://localhost:3000/api/transactions`
  - If different, check your `.env` file
  
- **Status Code**: 
  - `404` = Backend endpoint doesn't exist at that path
  - `500` = Backend error (check backend logs)
  - `CORS error` = CORS not configured
  - `ERR_CONNECTION_REFUSED` = Backend not running

- **Response Tab**: Shows what the backend returned

---

## Step 9: 500 Internal Server Error

If you see:
```
🔥 Backend error at: /api/ml/insights
```

This means:
1. ✅ Backend IS running
2. ✅ Endpoint exists
3. ❌ Backend code has an error

**Action:** Check your backend console/logs for the error details.

Common causes:
- Database not connected
- Missing environment variables
- Code error in the endpoint handler
- Missing dependencies

---

## Step 10: Still Not Working?

### Checklist:
- [ ] Backend running on port 3000? (`curl http://localhost:3000`)
- [ ] Backend routes have `/api` prefix?
- [ ] CORS configured for `http://localhost:3001`?
- [ ] `.env` file exists and has correct `VITE_API_BASE_URL`?
- [ ] Restarted frontend after changing `.env`?
- [ ] Checked Network tab in browser DevTools?
- [ ] Checked backend logs for errors?

### Get Help:
1. Share your backend route configuration
2. Share the output of: `curl http://localhost:3000/api/transactions`
3. Share screenshot of Network tab in browser DevTools
4. Share backend console logs

---

## Summary

**The frontend is working correctly.** The console warnings are telling you that the backend endpoints are not responding as expected. Follow the steps above to:

1. Verify backend is running
2. Fix backend route paths (must include `/api` prefix)
3. Configure CORS
4. Test endpoints manually with curl
5. Check backend logs for 500 errors
