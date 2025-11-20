import { renderHook, act } from '@testing-library/react';
import { useTypingIndicator } from './useTypingIndicator';

describe('useTypingIndicator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('triggers typing status', () => {
    const mockOnTypingChange = jest.fn();
    const { result } = renderHook(() =>
      useTypingIndicator({ onTypingChange: mockOnTypingChange })
    );

    act(() => {
      result.current.triggerTyping();
    });

    expect(mockOnTypingChange).toHaveBeenCalledWith(true);
  });

  it('stops typing status after timeout', () => {
    const mockOnTypingChange = jest.fn();
    const { result } = renderHook(() =>
      useTypingIndicator({ onTypingChange: mockOnTypingChange })
    );

    act(() => {
      result.current.triggerTyping();
    });

    expect(mockOnTypingChange).toHaveBeenCalledWith(true);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockOnTypingChange).toHaveBeenCalledWith(false);
  });

  it('stops typing manually', () => {
    const mockOnTypingChange = jest.fn();
    const { result } = renderHook(() =>
      useTypingIndicator({ onTypingChange: mockOnTypingChange })
    );

    act(() => {
      result.current.triggerTyping();
    });

    expect(mockOnTypingChange).toHaveBeenCalledWith(true);

    act(() => {
      result.current.stopTyping();
    });

    expect(mockOnTypingChange).toHaveBeenCalledWith(false);
  });

  it('resets timeout on multiple trigger calls', () => {
    const mockOnTypingChange = jest.fn();
    const { result } = renderHook(() =>
      useTypingIndicator({ onTypingChange: mockOnTypingChange })
    );

    act(() => {
      result.current.triggerTyping();
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    act(() => {
      result.current.triggerTyping();
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    const falseCalls = mockOnTypingChange.mock.calls.filter(
      call => call[0] === false
    );
    expect(falseCalls.length).toBe(0);
  });

  it('cleans up on unmount', () => {
    const mockOnTypingChange = jest.fn();
    const { result, unmount } = renderHook(() =>
      useTypingIndicator({ onTypingChange: mockOnTypingChange })
    );

    act(() => {
      result.current.triggerTyping();
    });

    unmount();

    expect(mockOnTypingChange).toHaveBeenCalledWith(false);
  });
});
