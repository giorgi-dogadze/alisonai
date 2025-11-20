import { getTimeAgo } from './getTimeAgo';

describe('getTimeAgo', () => {
  it('returns "-" for undefined timestamp', () => {
    expect(getTimeAgo({ currentTime: Date.now(), timestamp: undefined })).toBe(
      '-'
    );
  });

  it('returns "just now" for very recent times', () => {
    const now = Date.now();
    expect(getTimeAgo({ currentTime: now, timestamp: now })).toBe('just now');
    expect(getTimeAgo({ currentTime: now, timestamp: now - 3000 })).toBe(
      'just now'
    );
  });

  it('returns seconds ago for times under a minute', () => {
    const now = Date.now();
    expect(getTimeAgo({ currentTime: now, timestamp: now - 10000 })).toBe(
      '10s ago'
    );
    expect(getTimeAgo({ currentTime: now, timestamp: now - 30000 })).toBe(
      '30s ago'
    );
  });

  it('returns minutes ago for longer times', () => {
    const now = Date.now();
    expect(getTimeAgo({ currentTime: now, timestamp: now - 120000 })).toBe(
      '2m ago'
    );
    expect(getTimeAgo({ currentTime: now, timestamp: now - 300000 })).toBe(
      '5m ago'
    );
  });

  it('handles edge cases at boundaries', () => {
    const now = Date.now();
    expect(getTimeAgo({ currentTime: now, timestamp: now - 4999 })).toBe(
      'just now'
    );
    expect(getTimeAgo({ currentTime: now, timestamp: now - 5000 })).toBe(
      '5s ago'
    );
    expect(getTimeAgo({ currentTime: now, timestamp: now - 59999 })).toBe(
      '59s ago'
    );
    expect(getTimeAgo({ currentTime: now, timestamp: now - 60000 })).toBe(
      '1m ago'
    );
  });
});
