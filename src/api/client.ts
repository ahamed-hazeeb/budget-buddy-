import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { AUTH_MESSAGES } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Log configuration on startup
console.log('%c🚀 Budget Buddy Frontend Started', 'color: #3b82f6; font-size: 14px; font-weight: bold');
console.log(`%c📡 API Base URL: ${API_BASE_URL}`, 'color: #059669; font-size: 12px');
console.log('%c💡 Seeing 404 errors? Read TROUBLESHOOTING.md', 'color: #f59e0b; font-size: 12px');
console.log('%c   Backend must be running on http://localhost:3000', 'color: #6b7280; font-size: 11px');
console.log('%c   All routes must have /api prefix', 'color: #6b7280; font-size: 11px');
console.log('');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('bb_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 - Unauthorized
      if (status === 401) {
        localStorage.removeItem('bb_token');
        localStorage.removeItem('bb_user');
        window.location.href = '/login';
        toast.error(AUTH_MESSAGES.SESSION_EXPIRED);
        return Promise.reject(error);
      }

      // Handle 404 - Not Found (suppress toast for backend endpoints that might not be implemented yet)
      if (status === 404) {
        console.warn(`❌ API endpoint not found: ${error.config?.url}`);
        console.warn(`💡 This usually means:`);
        console.warn(`   1. Backend endpoint not implemented yet`);
        console.warn(`   2. Backend using different path (check BACKEND_SETUP.md)`);
        console.warn(`   3. Backend not running on http://localhost:3000`);
        // Don't show toast for 404s - let the component handle it
        return Promise.reject(error);
      }

      // Handle 400 - Bad Request (often from ML endpoints that need data first)
      if (status === 400) {
        console.warn(`⚠️ Bad request to: ${error.config?.url}`, (data as any)?.message);
        // Don't show toast for 400s - let the component handle it
        return Promise.reject(error);
      }

      // Handle 500 - Internal Server Error
      if (status === 500) {
        console.error(`🔥 Backend error at: ${error.config?.url}`);
        console.error(`   Message: ${(data as any)?.message || 'Internal server error'}`);
        console.error(`   Check your backend logs for details`);
        toast.error(`Backend error: ${(data as any)?.message || 'Internal server error'}`);
        return Promise.reject(error);
      }

      // Handle other errors
      const message = (data as any)?.message || AUTH_MESSAGES.UNEXPECTED_ERROR;
      toast.error(message);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      toast.error(AUTH_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Request error:', error.message);
      toast.error(AUTH_MESSAGES.UNEXPECTED_ERROR);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
