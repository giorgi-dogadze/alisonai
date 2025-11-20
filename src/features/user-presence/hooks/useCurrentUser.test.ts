import { renderHook, act } from '@testing-library/react';
import { useCurrentUser } from './useCurrentUser';

const mockPostMessage = jest.fn();

jest.mock('react-broadcast-sync', () => ({
  useBroadcastChannel: jest.fn(() => ({
    messages: [],
    postMessage: mockPostMessage,
  })),
}));

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with default user', () => {
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.currentUser).toBeDefined();
    expect(result.current.currentUser.id).toBeDefined();
    expect(result.current.currentUser.name).toBeDefined();
    expect(result.current.currentUser.isTyping).toBe(false);
  });

  it('generates unique userId and sourceName', () => {
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.userId).toBeDefined();
    expect(result.current.sourceName).toBeDefined();
    expect(result.current.sourceName).toBeDefined();
  });

  it('updates username', () => {
    const { result } = renderHook(() => useCurrentUser());

    act(() => {
      result.current.updateUsername('New Username');
    });

    expect(result.current.currentUser.name).toBe('New Username');
    expect(mockPostMessage).toHaveBeenCalledWith(
      'update',
      expect.objectContaining({
        name: 'New Username',
      })
    );
  });

  it('sets typing status', () => {
    const { result } = renderHook(() => useCurrentUser());

    act(() => {
      result.current.setTyping(true);
    });

    expect(result.current.currentUser.isTyping).toBe(true);

    act(() => {
      result.current.setTyping(false);
    });

    expect(result.current.currentUser.isTyping).toBe(false);
  });

  it('posts user update', () => {
    const { result } = renderHook(() => useCurrentUser());

    const updatedUser = {
      ...result.current.currentUser,
      name: 'Updated Name',
    };

    act(() => {
      result.current.postUserUpdate(updatedUser);
    });

    expect(mockPostMessage).toHaveBeenCalledWith('update', updatedUser);
  });
});
