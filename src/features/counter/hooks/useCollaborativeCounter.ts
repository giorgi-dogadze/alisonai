import { useState, useEffect, useCallback, useRef } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import type { CounterState } from '@/types/collaboration';
import { BROADCAST_CONSTANTS } from '@/shared/constants';

interface UseCollaborativeCounterProps {
  sourceName: string;
}

interface UseCollaborativeCounterReturn {
  counter: number;
  incrementCounter: () => void;
  decrementCounter: () => void;
}

export const useCollaborativeCounter = ({
  sourceName,
}: UseCollaborativeCounterProps): UseCollaborativeCounterReturn => {
  const [localCounter, setLocalCounter] = useState<number>(0);
  const lastTimestampRef = useRef<number>(0);

  const { messages: counterMessages, postMessage: postCounterMessage } =
    useBroadcastChannel(BROADCAST_CONSTANTS.CHANNELS.COUNTER, {
      sourceName,
      namespace: BROADCAST_CONSTANTS.NAMESPACE,
      keepLatestMessage: true,
    });

  // Sync counter from broadcast (timestamp-based resolution)
  useEffect(() => {
    const latestMessage = counterMessages[counterMessages.length - 1];
    if (latestMessage?.message) {
      const state = latestMessage.message as CounterState;
      if (state.timestamp > lastTimestampRef.current) {
        lastTimestampRef.current = state.timestamp;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalCounter(state.value);
      }
    }
  }, [counterMessages]);

  const incrementCounter = useCallback(() => {
    const newValue = localCounter + 1;
    const timestamp = Date.now();
    lastTimestampRef.current = timestamp;
    setLocalCounter(newValue);
    postCounterMessage(BROADCAST_CONSTANTS.ACTIONS.INCREMENT, {
      value: newValue,
      timestamp,
    });
  }, [localCounter, postCounterMessage]);

  const decrementCounter = useCallback(() => {
    const newValue = localCounter - 1;
    const timestamp = Date.now();
    lastTimestampRef.current = timestamp;
    setLocalCounter(newValue);
    postCounterMessage(BROADCAST_CONSTANTS.ACTIONS.DECREMENT, {
      value: newValue,
      timestamp,
    });
  }, [localCounter, postCounterMessage]);

  return {
    counter: localCounter,
    incrementCounter,
    decrementCounter,
  };
};
