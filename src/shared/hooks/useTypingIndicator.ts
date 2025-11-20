import { useRef, useEffect, useCallback } from 'react';
import { USER_ACTIVITY_CONSTANTS } from '../constants';

interface UseTypingIndicatorProps {
  onTypingChange: (isTyping: boolean) => void;
}

export const useTypingIndicator = ({
  onTypingChange,
}: UseTypingIndicatorProps) => {
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTypingChangeRef = useRef(onTypingChange);

  useEffect(() => {
    onTypingChangeRef.current = onTypingChange;
  }, [onTypingChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        onTypingChangeRef.current(false);
      }
    };
  }, []);

  const triggerTyping = useCallback(() => {
    onTypingChangeRef.current(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingChangeRef.current(false);
    }, USER_ACTIVITY_CONSTANTS.TYPING_TIMEOUT);
  }, []);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    onTypingChangeRef.current(false);
  }, []);

  return { triggerTyping, stopTyping };
};
