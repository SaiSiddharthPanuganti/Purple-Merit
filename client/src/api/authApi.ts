import api from './axios';
import type { ApiResponse, LoginCredentials, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  refresh: async () => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
      '/auth/refresh'
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },
};
