export const getTimeAgo = ({
  currentTime,
  timestamp,
}: {
  currentTime: number;
  timestamp?: number;
}) => {
  if (timestamp === undefined) return '-';
  const seconds = Math.floor((currentTime - timestamp) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
};
