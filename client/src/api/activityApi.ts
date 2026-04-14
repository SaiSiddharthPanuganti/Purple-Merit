import api from './axios';
import type { ApiResponse } from '../types';

export interface ActivityLog {
  _id: string;
  user: { _id: string; firstName: string; lastName: string; email: string; role: string } | null;
  action: string;
  targetUser: { _id: string; firstName: string; lastName: string; email: string } | null;
  details: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export const activityApi = {
  getLogs: async (params: { page?: number; limit?: number; action?: string } = {}) => {
    const response = await api.get<ApiResponse<ActivityLog[]>>('/activity', { params });
    return response.data;
  },
};
