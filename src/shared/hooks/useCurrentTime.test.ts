import { renderHook, act } from '@testing-library/react';
import { useCurrentTime } from './useCurrentTime';

describe('useCurrentTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with current time', () => {
    const { result } = renderHook(() => useCurrentTime());

    expect(result.current).toBeGreaterThan(0);
    expect(typeof result.current).toBe('number');
  });

  it('updates time at specified interval', () => {
    const { result } = renderHook(() => useCurrentTime(1000));
    const initialTime = result.current;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBeGreaterThan(initialTime);
  });

  it('updates time multiple times', () => {
    const { result } = renderHook(() => useCurrentTime(1000));
    const times: number[] = [result.current];

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    times.push(result.current);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    times.push(result.current);

    expect(times[1]).toBeGreaterThan(times[0]);
    expect(times[2]).toBeGreaterThan(times[1]);
  });

  it('uses default interval when not specified', () => {
    const { result } = renderHook(() => useCurrentTime());
    const initialTime = result.current;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBeGreaterThan(initialTime);
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = renderHook(() => useCurrentTime(1000));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
