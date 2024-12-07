import { UserStatus } from './types';

export const statusConfig: Record<UserStatus, { color: string; label: string }> = {
  online: { color: 'bg-green-500', label: 'En ligne' },
  offline: { color: 'bg-gray-400', label: 'Hors ligne' },
  away: { color: 'bg-yellow-500', label: 'Absent' },
  busy: { color: 'bg-red-500', label: 'Occupé' },
};