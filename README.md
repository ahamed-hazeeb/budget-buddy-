<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Budget Buddy - Personal Finance Management System

A production-ready React TypeScript frontend integrated with Node.js backend API for personal finance management.

## Prerequisites

- Node.js 18+ 
- Backend API running on `http://localhost:3000` (see [BACKEND_SETUP.md](BACKEND_SETUP.md))

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if your backend runs on a different port:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=30000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend runs on `http://localhost:3001`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Documentation

- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Backend requirements and setup
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete integration guide
- **[INTEGRATION_STATUS.md](INTEGRATION_STATUS.md)** - Implementation status
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Architecture details

## Features

✅ JWT Authentication with auto-logout
✅ React Query data management with caching
✅ TypeScript strict mode
✅ Responsive UI with Tailwind CSS
✅ Real-time toast notifications
✅ ML-powered insights (optional)
✅ Code splitting for optimal performance

## Backend Not Ready?

The frontend gracefully handles missing backend endpoints. See [BACKEND_SETUP.md](BACKEND_SETUP.md) for details.

## Troubleshooting

### TypeScript Errors
- Ensure `src/vite-env.d.ts` exists
- Run `npm install` to get type definitions

### 404 Errors in Console
- Normal if backend endpoints aren't implemented yet
- Check [BACKEND_SETUP.md](BACKEND_SETUP.md) for required endpoints
- UI will show "No data" states gracefully

### CORS Errors
- Backend must allow `http://localhost:3001` origin
- See CORS configuration in [BACKEND_SETUP.md](BACKEND_SETUP.md)
