export const isOwnMessage = (
  messageUserId: string,
  currentUserId: string
): boolean => {
  return messageUserId === currentUserId;
};

export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isMessageExpired = (
  expiresAt: number | undefined,
  currentTime = Date.now()
): boolean => {
  if (!expiresAt) return false;
  return currentTime >= expiresAt;
};
