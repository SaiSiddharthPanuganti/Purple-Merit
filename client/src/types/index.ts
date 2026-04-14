export type Role = 'admin' | 'manager' | 'user';
export type Status = 'active' | 'inactive';

export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: Role;
  status: Status;
  avatar: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { _id: string; firstName: string; lastName: string; email?: string } | null;
  updatedBy: { _id: string; firstName: string; lastName: string; email?: string } | null;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    manager: number;
    user: number;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationInfo;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
  status?: Status;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  status?: Status;
  password?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role | '';
  status?: Status | '';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
