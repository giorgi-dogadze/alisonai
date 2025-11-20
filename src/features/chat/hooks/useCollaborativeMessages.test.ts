import { renderHook, act, waitFor } from '@testing-library/react';
import { useCollaborativeMessages } from './useCollaborativeMessages';

const mockPostMessage = jest.fn();

jest.mock('react-broadcast-sync', () => ({
  useBroadcastChannel: jest.fn(() => ({
    messages: [],
    postMessage: mockPostMessage,
  })),
}));

describe('useCollaborativeMessages', () => {
  const props = {
    sourceName: 'test-source',
    userId: 'user-123',
    username: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useCollaborativeMessages(props));

    expect(result.current.messages).toEqual([]);
  });

  it('sends a message', () => {
    const { result } = renderHook(() => useCollaborativeMessages(props));

    act(() => {
      result.current.sendMessage('Hello world');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello world');
    expect(result.current.messages[0].userId).toBe('user-123');
    expect(result.current.messages[0].username).toBe('Test User');
  });

  it('sends message with expiration', () => {
    const { result } = renderHook(() => useCollaborativeMessages(props));

    act(() => {
      result.current.sendMessage('Temporary message', 5000);
    });

    expect(result.current.messages[0].expiresAt).toBeDefined();
    expect(mockPostMessage).toHaveBeenCalledWith(
      'send',
      expect.objectContaining({
        content: 'Temporary message',
        expiresAt: expect.any(Number),
      })
    );
  });

  it('auto-deletes expired messages', async () => {
    const { result } = renderHook(() => useCollaborativeMessages(props));

    act(() => {
      result.current.sendMessage('Expiring message', 1000);
    });

    expect(result.current.messages).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(0);
    });
  });

  it('deletes own message', () => {
    const { result } = renderHook(() => useCollaborativeMessages(props));

    act(() => {
      result.current.sendMessage('Test message');
    });

    const messageId = result.current.messages[0].id;

    act(() => {
      result.current.deleteMessage(messageId);
    });

    expect(result.current.messages).toHaveLength(0);
    expect(mockPostMessage).toHaveBeenCalledWith('delete', {
      messageId,
    });
  });

  it('does not delete message from other users', () => {
    const { result } = renderHook(() => useCollaborativeMessages(props));

    act(() => {
      result.current.sendMessage('Test message');
    });

    act(() => {
      result.current.deleteMessage('non-existent-id');
    });

    expect(result.current.messages).toHaveLength(1);
  });
});
