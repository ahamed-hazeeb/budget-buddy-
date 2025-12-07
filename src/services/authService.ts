import apiClient from '../api/client';
import { AuthResponse, User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/login', credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('bb_token', response.data.token);
      localStorage.setItem('bb_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/register', data);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('bb_token', response.data.token);
      localStorage.setItem('bb_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('bb_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return localStorage.getItem('bb_token');
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('bb_token');
  }
};

export default authService;
