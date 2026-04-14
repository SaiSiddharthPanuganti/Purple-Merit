import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Shield,
  Clock,
  Calendar,
  UserCircle,
  Edit3,
} from 'lucide-react';
import { userApi } from '../api/userApi';
import type { User } from '../types';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import {
  ROLE_LABELS,
  ROLE_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  formatDateTime,
} from '../utils/constants';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const res = await userApi.getUser(id);
        setUser(res.data);
      } catch {
        navigate('/users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <div className="flex gap-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  const infoItems = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: ROLE_LABELS[user.role], badge: true, badgeColor: ROLE_COLORS[user.role] },
    { icon: UserCircle, label: 'Status', value: STATUS_LABELS[user.status], badge: true, badgeColor: STATUS_COLORS[user.status] },
    { icon: Clock, label: 'Last Login', value: formatDateTime(user.lastLogin) },
    { icon: Calendar, label: 'Created', value: formatDateTime(user.createdAt) },
    { icon: Calendar, label: 'Updated', value: formatDateTime(user.updatedAt) },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/users')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User profile card */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            avatar={user.avatar}
            size="lg"
            showStatus
            status={user.status}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/users')}>
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge colorClass={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
              <Badge colorClass={STATUS_COLORS[user.status]}>{STATUS_LABELS[user.status]}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            User Information
          </h3>
          <div className="space-y-4">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    {item.badge ? (
                      <Badge colorClass={item.badgeColor || ''}>{item.value}</Badge>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Audit information */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Audit Trail
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created By</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.createdBy ? `${user.createdBy.firstName} ${user.createdBy.lastName}` : 'System'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDateTime(user.createdAt)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated By</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.updatedBy ? `${user.updatedBy.firstName} ${user.updatedBy.lastName}` : 'System'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDateTime(user.updatedAt)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Login</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateTime(user.lastLogin)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
