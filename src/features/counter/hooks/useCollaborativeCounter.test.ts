import { renderHook, act } from '@testing-library/react';
import { useCollaborativeCounter } from './useCollaborativeCounter';

const mockPostMessage = jest.fn();

jest.mock('react-broadcast-sync', () => ({
  useBroadcastChannel: jest.fn(() => ({
    messages: [],
    postMessage: mockPostMessage,
  })),
}));

describe('useCollaborativeCounter', () => {
  const props = {
    sourceName: 'test-source',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes counter at 0', () => {
    const { result } = renderHook(() => useCollaborativeCounter(props));

    expect(result.current.counter).toBe(0);
  });

  it('increments counter', () => {
    const { result } = renderHook(() => useCollaborativeCounter(props));

    act(() => {
      result.current.incrementCounter();
    });

    expect(result.current.counter).toBe(1);
    expect(mockPostMessage).toHaveBeenCalledWith(
      'increment',
      expect.objectContaining({
        value: 1,
        timestamp: expect.any(Number),
      })
    );
  });

  it('decrements counter', () => {
    const { result } = renderHook(() => useCollaborativeCounter(props));

    act(() => {
      result.current.decrementCounter();
    });

    expect(result.current.counter).toBe(-1);
    expect(mockPostMessage).toHaveBeenCalledWith(
      'decrement',
      expect.objectContaining({
        value: -1,
        timestamp: expect.any(Number),
      })
    );
  });

  it('handles multiple increments', () => {
    const { result } = renderHook(() => useCollaborativeCounter(props));

    act(() => {
      result.current.incrementCounter();
    });

    act(() => {
      result.current.incrementCounter();
    });

    act(() => {
      result.current.incrementCounter();
    });

    expect(result.current.counter).toBe(3);
  });

  it('handles mixed increment and decrement', () => {
    const { result } = renderHook(() => useCollaborativeCounter(props));

    act(() => {
      result.current.incrementCounter();
    });

    act(() => {
      result.current.incrementCounter();
    });

    act(() => {
      result.current.decrementCounter();
    });

    expect(result.current.counter).toBe(1);
  });
});
