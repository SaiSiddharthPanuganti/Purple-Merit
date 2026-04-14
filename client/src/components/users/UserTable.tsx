import { Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { ROLE_LABELS, ROLE_COLORS, STATUS_LABELS, STATUS_COLORS, formatDate } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {users.map((user) => (
            <tr
              key={user._id}
              className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    avatar={user.avatar}
                    size="md"
                    showStatus
                    status={user.status}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <Badge colorClass={ROLE_COLORS[user.role]}>
                  {ROLE_LABELS[user.role]}
                </Badge>
              </td>
              <td className="py-3.5 px-4">
                <Badge colorClass={STATUS_COLORS[user.status]}>
                  {STATUS_LABELS[user.status]}
                </Badge>
              </td>
              <td className="py-3.5 px-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.createdAt)}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/users/${user._id}`)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {(isAdmin || (currentUser?.role === 'manager' && user.role === 'user')) && (
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Edit user"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {isAdmin && user._id !== currentUser?._id && (
                    <button
                      onClick={() => onDelete(user)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Deactivate user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
