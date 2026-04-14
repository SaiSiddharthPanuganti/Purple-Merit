import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import type { User, UserQueryParams, PaginationInfo, CreateUserData, UpdateUserData } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { TableSkeleton } from '../components/ui/Skeleton';
import UserTable from '../components/users/UserTable';
import UserFilters from '../components/users/UserFilters';
import UserForm from '../components/users/UserForm';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params: UserQueryParams = {
        page,
        limit: 10,
        search: debouncedSearch,
        role: roleFilter as UserQueryParams['role'],
        status: statusFilter as UserQueryParams['status'],
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const response = await userApi.getUsers(params);
      setUsers(response.data);
      if (response.pagination) setPagination(response.pagination);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleCreate = async (data: CreateUserData | UpdateUserData) => {
    try {
      await userApi.createUser(data as CreateUserData);
      toast.success('User created successfully');
      fetchUsers(1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
      throw error;
    }
  };

  const handleEdit = async (data: CreateUserData | UpdateUserData) => {
    if (!editingUser) return;
    try {
      await userApi.updateUser(editingUser._id, data as UpdateUserData);
      toast.success('User updated successfully');
      fetchUsers(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await userApi.deleteUser(deletingUser._id);
      toast.success('User deactivated successfully');
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      fetchUsers(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const openDelete = (user: User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all users in your organization
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Filters */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={roleFilter}
        onRoleChange={setRoleFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Table */}
      <Card padding={false}>
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users found"
            description={
              debouncedSearch || roleFilter || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first user'
            }
            action={
              isAdmin && !debouncedSearch && !roleFilter && !statusFilter ? (
                <Button onClick={openCreate} size="sm">
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <UserTable users={users} onEdit={openEdit} onDelete={openDelete} />
            <div className="border-t border-gray-200 dark:border-gray-800 px-4">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={(page) => fetchUsers(page)}
              />
            </div>
          </>
        )}
      </Card>

      {/* User Form Modal */}
      <UserForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEdit : handleCreate}
        user={editingUser}
        isAdmin={isAdmin}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDelete}
        title="Deactivate User"
        message={`Are you sure you want to deactivate ${deletingUser?.firstName} ${deletingUser?.lastName}? They will no longer be able to access the system.`}
        confirmLabel="Deactivate"
        isLoading={isDeleting}
      />
    </div>
  );
}
