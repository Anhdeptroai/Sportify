import axios from 'axios';
import { toast } from 'react-hot-toast';

// API Configuration
export const API_BASE_URL = 'http://13.215.205.59:8000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau.');
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/token/',
    REGISTER: '/api/register/',
    REFRESH_TOKEN: '/api/token/refresh/',
  },
  USER: {
    PROFILE: '/api/user/profile/',
    UPDATE_PROFILE: '/api/user/profile/update/',
  },
  // Add other endpoints as needed
}; 