import api from './axios';
import type {
  ApiResponse,
  User,
  UserStats,
  UserQueryParams,
  CreateUserData,
  UpdateUserData,
  UpdateProfileData,
} from '../types';

export const userApi = {
  getUsers: async (params: UserQueryParams = {}) => {
    const response = await api.get<ApiResponse<User[]>>('/users', { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<UserStats>>('/users/stats');
    return response.data;
  },
};
