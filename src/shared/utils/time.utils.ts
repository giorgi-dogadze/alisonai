import { TIME_CONSTANTS } from '../constants';

export const getRelativeTime = (
  currentTime: number,
  timestamp?: number
): string => {
  if (timestamp === undefined) return '-';

  const seconds = Math.floor(
    (currentTime - timestamp) / TIME_CONSTANTS.MS_PER_SECOND
  );

  if (
    seconds <
    TIME_CONSTANTS.JUST_NOW_THRESHOLD / TIME_CONSTANTS.MS_PER_SECOND
  ) {
    return 'just now';
  }

  if (seconds < TIME_CONSTANTS.SECONDS_PER_MINUTE) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / TIME_CONSTANTS.SECONDS_PER_MINUTE);

  if (minutes < TIME_CONSTANTS.SECONDS_PER_MINUTE) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / TIME_CONSTANTS.SECONDS_PER_MINUTE);
  return `${hours}h ago`;
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getExpirationCountdown = (
  expiresAt: number | undefined,
  currentTime: number
): string | null => {
  if (!expiresAt) return null;

  const remaining = Math.max(
    0,
    Math.ceil((expiresAt - currentTime) / TIME_CONSTANTS.MS_PER_SECOND)
  );

  if (remaining === 0) return 'Expiring...';

  if (remaining < TIME_CONSTANTS.SECONDS_PER_MINUTE) {
    return `${remaining}s`;
  }

  const minutes = Math.floor(remaining / TIME_CONSTANTS.SECONDS_PER_MINUTE);
  const seconds = remaining % TIME_CONSTANTS.SECONDS_PER_MINUTE;
  return `${minutes}m ${seconds}s`;
};
