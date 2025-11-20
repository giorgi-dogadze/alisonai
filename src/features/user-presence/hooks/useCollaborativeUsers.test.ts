import { renderHook } from '@testing-library/react';
import { useCollaborativeUsers } from './useCollaborativeUsers';

const mockPostMessage = jest.fn();

jest.mock('react-broadcast-sync', () => ({
  useBroadcastChannel: jest.fn(() => ({
    messages: [],
    postMessage: mockPostMessage,
  })),
}));

describe('useCollaborativeUsers', () => {
  const props = {
    sourceName: 'test-source',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with empty users list', () => {
    const { result } = renderHook(() => useCollaborativeUsers(props));

    expect(result.current.users).toEqual([]);
  });

  it('provides postTypingStatus function', () => {
    const { result } = renderHook(() => useCollaborativeUsers(props));

    expect(result.current.postTypingStatus).toBeDefined();
    expect(typeof result.current.postTypingStatus).toBe('function');
  });
});
