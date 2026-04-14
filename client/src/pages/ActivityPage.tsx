import { useState, useEffect } from 'react';
import {
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  UserCog,
  UserMinus,
  KeyRound,
  UserCircle,
} from 'lucide-react';
import { activityApi, type ActivityLog } from '../api/activityApi';
import type { PaginationInfo } from '../types';
import Card from '../components/ui/Card';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import Avatar from '../components/ui/Avatar';
import { formatDateTime } from '../utils/constants';

const ACTION_CONFIG: Record<string, { label: string; icon: typeof Activity; color: string }> = {
  USER_LOGIN: { label: 'Login', icon: LogIn, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
  USER_LOGOUT: { label: 'Logout', icon: LogOut, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
  USER_CREATED: { label: 'User Created', icon: UserPlus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
  USER_UPDATED: { label: 'User Updated', icon: UserCog, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  USER_DELETED: { label: 'User Deactivated', icon: UserMinus, color: 'text-red-500 bg-red-50 dark:bg-red-900/30' },
  PROFILE_UPDATED: { label: 'Profile Updated', icon: UserCircle, color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/30' },
  PASSWORD_CHANGED: { label: 'Password Changed', icon: KeyRound, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30' },
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const params: { page: number; limit: number; action?: string } = { page, limit: 20 };
      if (actionFilter) params.action = actionFilter;
      const res = await activityApi.getLogs(params);
      setLogs(res.data);
      if (res.pagination) setPagination(res.pagination);
    } catch {
      // silently handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [actionFilter]);

  const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'USER_LOGIN', label: 'Login' },
    { value: 'USER_LOGOUT', label: 'Logout' },
    { value: 'USER_CREATED', label: 'User Created' },
    { value: 'USER_UPDATED', label: 'User Updated' },
    { value: 'USER_DELETED', label: 'User Deactivated' },
    { value: 'PROFILE_UPDATED', label: 'Profile Updated' },
    { value: 'PASSWORD_CHANGED', label: 'Password Changed' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            Activity Logs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track all actions performed in the system
          </p>
        </div>
        <Select
          value={actionFilter}
          onChange={setActionFilter}
          options={actionOptions}
        />
      </div>

      <Card padding={false}>
        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : logs.length === 0 ? (
          <EmptyState
            title="No activity logs"
            description="Activity will appear here as users interact with the system"
          />
        ) : (
          <>
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {logs.map((log) => {
                const config = ACTION_CONFIG[log.action] || {
                  label: log.action,
                  icon: Activity,
                  color: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
                };
                const Icon = config.icon;

                return (
                  <div
                    key={log._id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {log.details}
                      </p>
                      {log.user && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar
                            firstName={log.user.firstName}
                            lastName={log.user.lastName}
                            size="sm"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {log.user.firstName} {log.user.lastName}
                          </span>
                        </div>
                      )}
                    </div>
                    {log.targetUser && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400 dark:text-gray-500">Target</p>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {log.targetUser.firstName} {log.targetUser.lastName}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 px-4">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={(page) => fetchLogs(page)}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
