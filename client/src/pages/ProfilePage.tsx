import { useState } from 'react';
import { Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import {
  ROLE_LABELS,
  ROLE_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  formatDateTime,
} from '../utils/constants';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) return null;

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Name fields are required');
      return;
    }
    setIsSaving(true);
    try {
      await userApi.updateProfile({ firstName, lastName });
      toast.success('Profile updated successfully');
      await refreshUser();
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 4) {
      toast.error('New password must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSaving(true);
    try {
      await userApi.updateProfile({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setIsPasswordMode(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            avatar={user.avatar}
            size="lg"
            showStatus
            status={user.status}
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex gap-2 mt-3">
              <Badge colorClass={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
              <Badge colorClass={STATUS_COLORS[user.status]}>{STATUS_LABELS[user.status]}</Badge>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Last login: {formatDateTime(user.lastLogin)}</p>
            <p>Member since: {formatDateTime(user.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Edit profile */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h3>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFirstName(user.firstName);
                  setLastName(user.lastName);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} isLoading={isSaving}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">First Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Role</p>
              <Badge colorClass={ROLE_COLORS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Change password */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </h3>
          {!isPasswordMode && (
            <Button variant="secondary" size="sm" onClick={() => setIsPasswordMode(true)}>
              Change Password
            </Button>
          )}
        </div>

        {isPasswordMode ? (
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsPasswordMode(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleChangePassword} isLoading={isSaving}>
                Update Password
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use a strong password to protect your account. You'll need your current password to set a new one.
          </p>
        )}
      </Card>
    </div>
  );
}
