/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 * Ready for backend integration - currently works with mock services
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // TODO: Implement token refresh logic when backend is ready
      // const refreshToken = localStorage.getItem('refresh_token');
      // if (refreshToken) {
      //   try {
      //     const response = await axios.post('/api/auth/refresh', { refreshToken });
      //     localStorage.setItem('auth_token', response.data.token);
      //     return apiClient(originalRequest);
      //   } catch (refreshError) {
      //     localStorage.removeItem('auth_token');
      //     localStorage.removeItem('refresh_token');
      //     window.location.href = '/login';
      //   }
      // }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
