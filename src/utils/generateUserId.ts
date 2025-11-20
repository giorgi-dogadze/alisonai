export const generateUserId = (): string => {
  return `user-${Math.random().toString(36).substr(2, 9)}`;
};
