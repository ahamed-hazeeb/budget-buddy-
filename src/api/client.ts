import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { AUTH_MESSAGES } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

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
        console.warn(`API endpoint not found: ${error.config?.url}`);
        // Don't show toast for 404s - let the component handle it
        return Promise.reject(error);
      }

      // Handle 400 - Bad Request (often from ML endpoints that need data first)
      if (status === 400) {
        console.warn(`Bad request to: ${error.config?.url}`, (data as any)?.message);
        // Don't show toast for 400s - let the component handle it
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
