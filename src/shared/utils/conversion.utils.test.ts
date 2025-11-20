import { convertToMilliseconds } from './conversion.utils';

describe('convertToMilliseconds', () => {
  it('converts seconds to milliseconds', () => {
    expect(convertToMilliseconds('30', 'seconds')).toBe(30000);
    expect(convertToMilliseconds('1', 'seconds')).toBe(1000);
  });

  it('converts minutes to milliseconds', () => {
    expect(convertToMilliseconds('1', 'minutes')).toBe(60000);
    expect(convertToMilliseconds('5', 'minutes')).toBe(300000);
  });

  it('converts hours to milliseconds', () => {
    expect(convertToMilliseconds('1', 'hours')).toBe(3600000);
    expect(convertToMilliseconds('2', 'hours')).toBe(7200000);
  });

  it('returns undefined for invalid input', () => {
    expect(convertToMilliseconds('abc', 'seconds')).toBeUndefined();
    expect(convertToMilliseconds('', 'seconds')).toBeUndefined();
  });

  it('returns undefined for zero or negative values', () => {
    expect(convertToMilliseconds('0', 'seconds')).toBeUndefined();
    expect(convertToMilliseconds('-5', 'seconds')).toBeUndefined();
  });

  it('handles large numbers', () => {
    expect(convertToMilliseconds('100', 'minutes')).toBe(6000000);
  });

  it('parses numeric strings correctly', () => {
    expect(convertToMilliseconds('10.5', 'seconds')).toBe(10000);
    expect(convertToMilliseconds('5.9', 'seconds')).toBe(5000);
  });
});
