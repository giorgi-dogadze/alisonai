import { useState, useEffect, useMemo, useCallback } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import type { User } from '@/types/collaboration';
import {
  generateUserId,
  generateSourceName,
  generateDefaultUsername,
} from '@/shared/utils';
import {
  BROADCAST_CONSTANTS,
  USER_ACTIVITY_CONSTANTS,
} from '@/shared/constants';

interface UseCurrentUserReturn {
  currentUser: User;
  userId: string;
  sourceName: string;
  updateUsername: (name: string) => void;
  setTyping: (isTyping: boolean) => void;
  postUserUpdate: (user: User) => void;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
  const userId = useMemo(() => generateUserId(), []);
  const sourceName = useMemo(() => generateSourceName(userId), [userId]);

  const [currentUser, setCurrentUser] = useState<User>(() => ({
    id: userId,
    name: generateDefaultUsername(userId),
    lastActivity: Date.now(),
    isTyping: false,
  }));

  const { postMessage: postUserMessage } = useBroadcastChannel(
    BROADCAST_CONSTANTS.CHANNELS.USERS,
    {
      sourceName,
      namespace: BROADCAST_CONSTANTS.NAMESPACE,
      keepLatestMessage: true,
    }
  );

  const updateUsername = useCallback(
    (name: string) => {
      const updatedUser: User = {
        ...currentUser,
        name,
        lastActivity: Date.now(),
      };
      setCurrentUser(updatedUser);
      postUserMessage(BROADCAST_CONSTANTS.ACTIONS.UPDATE, updatedUser);
    },
    [currentUser, postUserMessage]
  );

  const setTyping = useCallback((isTyping: boolean) => {
    setCurrentUser(prev => ({ ...prev, isTyping }));
  }, []);

  const postUserUpdate = useCallback(
    (user: User) => {
      postUserMessage(BROADCAST_CONSTANTS.ACTIONS.UPDATE, user);
    },
    [postUserMessage]
  );

  // Initialize and heartbeat
  useEffect(() => {
    postUserMessage(BROADCAST_CONSTANTS.ACTIONS.JOIN, currentUser);

    const heartbeat = setInterval(() => {
      setCurrentUser(prev => {
        const updated = { ...prev, lastActivity: Date.now() };
        postUserMessage(BROADCAST_CONSTANTS.ACTIONS.UPDATE, updated);
        return updated;
      });
    }, USER_ACTIVITY_CONSTANTS.HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeat);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentUser,
    userId,
    sourceName,
    updateUsername,
    setTyping,
    postUserUpdate,
  };
};
