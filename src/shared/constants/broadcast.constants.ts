export const BROADCAST_CONSTANTS = {
  NAMESPACE: 'collab-app',
  CHANNELS: {
    COUNTER: 'counter',
    MESSAGES: 'messages',
    USERS: 'users',
    TYPING: 'typing',
  },
  ACTIONS: {
    JOIN: 'join',
    UPDATE: 'update',
    SEND: 'send',
    DELETE: 'delete',
    INCREMENT: 'increment',
    DECREMENT: 'decrement',
    STATUS: 'status',
  },
} as const;
