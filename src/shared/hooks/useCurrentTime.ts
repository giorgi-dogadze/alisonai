import { useState, useEffect } from 'react';
import { TIME_CONSTANTS } from '../constants';

export const useCurrentTime = (
  updateInterval = TIME_CONSTANTS.RELATIVE_TIME_UPDATE_INTERVAL
): number => {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return currentTime;
};
