import { renderHook } from '@testing-library/react';
import { useCollaborativeSession } from './useCollaborativeSession';

jest.mock('@/features/user-presence', () => ({
  useCurrentUser: jest.fn(() => ({
    currentUser: {
      id: 'user-1',
      name: 'Test User',
      lastActivity: Date.now(),
      isTyping: false,
    },
    userId: 'user-1',
    sourceName: 'source-user-1',
    updateUsername: jest.fn(),
    setTyping: jest.fn(),
  })),
  useCollaborativeUsers: jest.fn(() => ({
    users: [],
    postTypingStatus: jest.fn(),
  })),
}));

jest.mock('@/features/chat', () => ({
  useCollaborativeMessages: jest.fn(() => ({
    messages: [],
    sendMessage: jest.fn(),
    deleteMessage: jest.fn(),
  })),
}));

jest.mock('@/features/counter', () => ({
  useCollaborativeCounter: jest.fn(() => ({
    counter: 0,
    incrementCounter: jest.fn(),
    decrementCounter: jest.fn(),
  })),
}));

describe('useCollaborativeSession', () => {
  it('initializes collaborative session', () => {
    const { result } = renderHook(() => useCollaborativeSession());

    expect(result.current.currentUser).toBeDefined();
    expect(result.current.users).toBeDefined();
    expect(result.current.messages).toBeDefined();
    expect(result.current.counter).toBeDefined();
    expect(result.current.isInitialized).toBe(true);
  });

  it('provides all action functions', () => {
    const { result } = renderHook(() => useCollaborativeSession());

    expect(result.current.updateUsername).toBeDefined();
    expect(result.current.sendMessage).toBeDefined();
    expect(result.current.deleteMessage).toBeDefined();
    expect(result.current.incrementCounter).toBeDefined();
    expect(result.current.decrementCounter).toBeDefined();
    expect(result.current.markTyping).toBeDefined();
  });

  it('returns counter state with metadata', () => {
    const { result } = renderHook(() => useCollaborativeSession());

    expect(result.current.counter.value).toBe(0);
    expect(result.current.counter.timestamp).toBeDefined();
    expect(result.current.counter.lastActionBy).toBe('Test User');
    expect(result.current.counter.lastActionTimestamp).toBeDefined();
  });
});
