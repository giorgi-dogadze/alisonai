export interface UseCollaborativeUsersProps {
  sourceName: string;
}

export interface UseCollaborativeUsersReturn {
  users: User[];
  postTypingStatus: (userId: string, isTyping: boolean) => void;
}

export interface User {
  id: string;
  name: string;
  lastActivity: number;
  isTyping: boolean;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  expiresAt?: number; // Optional expiration timestamp
}

export interface CounterState {
  value: number;
  timestamp: number;
  lastActionBy?: string; // username (optional for backward compatibility)
  lastActionTimestamp?: number; // (optional for backward compatibility)
}

export type BroadcastAction =
  | { type: 'USER_JOIN'; payload: User }
  | { type: 'USER_UPDATE'; payload: User }
  | { type: 'USER_LEAVE'; payload: { userId: string } }
  | { type: 'MESSAGE_SEND'; payload: Message }
  | { type: 'MESSAGE_DELETE'; payload: { messageId: string; userId: string } }
  | { type: 'COUNTER_UPDATE'; payload: CounterState }
  | { type: 'TYPING_START'; payload: { userId: string } }
  | { type: 'TYPING_STOP'; payload: { userId: string } };

export interface CollaborativeState {
  users: Record<string, User>;
  messages: Message[];
  counter: CounterState;
  responderId?: string; // ID of the tab responding with state
}

export interface UseCollaborativeSession {
  // State
  currentUser: User;
  users: User[];
  messages: Message[];
  counter: CounterState;
  isInitialized: boolean;

  // Actions
  updateUsername: (name: string) => void;
  sendMessage: (content: string, expiresIn?: number) => void;
  deleteMessage: (messageId: string) => void;
  incrementCounter: () => void;
  decrementCounter: () => void;
  markTyping: (isTyping: boolean) => void;
}
