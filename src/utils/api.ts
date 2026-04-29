import axios from 'axios';
import { tokenManager } from './storage.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BACKEND_URL,
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const tokens = tokenManager.getTokens();
  if (tokens) {
    config.headers.Authorization = `Bearer ${tokens.access_token}`;
  }
  config.headers['X-API-Version'] = '1';
  return config;
});

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we have a refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = tokenManager.getTokens();

      if (tokens?.refresh_token) {
        try {
          const { data } = await axios.post(`${BACKEND_URL}/auth/refresh`, {
            refresh_token: tokens.refresh_token
          });

          tokenManager.saveTokens(data.data);
          
          originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          tokenManager.clear();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
