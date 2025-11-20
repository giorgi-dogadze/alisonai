import { TIME_UNIT_MULTIPLIERS, type TimeUnit } from '../constants';

export const convertToMilliseconds = (
  value: string,
  unit: TimeUnit
): number | undefined => {
  const numValue = parseInt(value, 10);

  if (isNaN(numValue) || numValue <= 0) {
    return undefined;
  }

  return numValue * TIME_UNIT_MULTIPLIERS[unit];
};
