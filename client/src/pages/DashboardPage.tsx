import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import type { UserStats, User } from '../types';
import StatsCard from '../components/ui/StatsCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { StatsSkeleton } from '../components/ui/Skeleton';
import { ROLE_LABELS, ROLE_COLORS, STATUS_LABELS, STATUS_COLORS, formatDate } from '../utils/constants';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          userApi.getStats(),
          userApi.getUsers({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        ]);
        setStats(statsRes.data);
        setRecentUsers(usersRes.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.firstName} 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your team today.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            icon={<Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />}
            label="Total Users"
            value={stats.total}
            colorClass="bg-brand-100 dark:bg-brand-900/30"
          />
          <StatsCard
            icon={<UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            label="Active Users"
            value={stats.active}
            trend={stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%'}
            colorClass="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatsCard
            icon={<UserX className="w-5 h-5 text-red-600 dark:text-red-400" />}
            label="Inactive Users"
            value={stats.inactive}
            colorClass="bg-red-100 dark:bg-red-900/30"
          />
          <StatsCard
            icon={<ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            label="Admins & Managers"
            value={stats.byRole.admin + stats.byRole.manager}
            colorClass="bg-amber-100 dark:bg-amber-900/30"
          />
        </div>
      ) : null}

      {/* Role breakdown + Recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role breakdown */}
        {stats && (
          <Card className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Role Distribution
            </h3>
            <div className="space-y-4">
              {[
                { role: 'admin', count: stats.byRole.admin, color: 'bg-purple-500' },
                { role: 'manager', count: stats.byRole.manager, color: 'bg-blue-500' },
                { role: 'user', count: stats.byRole.user, color: 'bg-gray-400 dark:bg-gray-600' },
              ].map((item) => (
                <div key={item.role}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{item.role}s</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: stats.total > 0 ? `${(item.count / stats.total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent users */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Users
            </h3>
            <button
              onClick={() => navigate('/users')}
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-6 pb-6">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                No users found
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/users/${u._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar firstName={u.firstName} lastName={u.lastName} size="sm" showStatus status={u.status} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge colorClass={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                        {formatDate(u.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
