import { getInitials, getAvatarColor } from '../../utils/constants';

interface AvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  status?: 'active' | 'inactive';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const statusSizeClasses = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
};

export default function Avatar({
  firstName,
  lastName,
  avatar,
  size = 'md',
  showStatus = false,
  status = 'active',
}: AvatarProps) {
  const initials = getInitials(firstName, lastName);
  const colorClass = getAvatarColor(`${firstName}${lastName}`);

  return (
    <div className="relative inline-flex">
      {avatar ? (
        <img
          src={avatar}
          alt={`${firstName} ${lastName}`}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-900`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-gray-900`}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 block ${statusSizeClasses[size]} rounded-full ring-2 ring-white dark:ring-gray-900 ${
            status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
}
