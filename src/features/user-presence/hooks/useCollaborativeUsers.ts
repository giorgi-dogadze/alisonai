import { useState, useEffect } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import type {
  UseCollaborativeUsersProps,
  UseCollaborativeUsersReturn,
  User,
} from '@/types/collaboration';
import {
  BROADCAST_CONSTANTS,
  USER_ACTIVITY_CONSTANTS,
} from '@/shared/constants';

export const useCollaborativeUsers = ({
  sourceName,
}: UseCollaborativeUsersProps): UseCollaborativeUsersReturn => {
  const [localUsers, setLocalUsers] = useState<Record<string, User>>({});

  const { messages: userMessages } = useBroadcastChannel(
    BROADCAST_CONSTANTS.CHANNELS.USERS,
    {
      sourceName,
      namespace: BROADCAST_CONSTANTS.NAMESPACE,
      keepLatestMessage: true,
    }
  );

  const { messages: typingMessages, postMessage: postTypingMessage } =
    useBroadcastChannel(BROADCAST_CONSTANTS.CHANNELS.TYPING, {
      sourceName,
      namespace: BROADCAST_CONSTANTS.NAMESPACE,
      keepLatestMessage: true,
    });

  // Sync users from broadcast
  useEffect(() => {
    const latestMessage = userMessages[userMessages.length - 1];
    if (latestMessage?.message) {
      const user = latestMessage.message as User;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalUsers(prev => ({ ...prev, [user.id]: user }));
    }
  }, [userMessages]);

  // Sync typing status from broadcast
  useEffect(() => {
    const latestMessage = typingMessages[typingMessages.length - 1];
    if (latestMessage?.message) {
      const { userId: typingUserId, isTyping } = latestMessage.message as {
        userId: string;
        isTyping: boolean;
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalUsers(prev => {
        const user = prev[typingUserId];
        if (!user) return prev;
        return { ...prev, [typingUserId]: { ...user, isTyping } };
      });
    }
  }, [typingMessages]);

  // Cleanup inactive users
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();

      setLocalUsers(prev => {
        const active: Record<string, User> = {};
        Object.entries(prev).forEach(([id, user]) => {
          if (
            now - user.lastActivity <
            USER_ACTIVITY_CONSTANTS.INACTIVE_THRESHOLD
          ) {
            active[id] = user;
          }
        });
        return active;
      });
    }, USER_ACTIVITY_CONSTANTS.CLEANUP_INTERVAL);

    return () => clearInterval(cleanup);
  }, []);

  const postTypingStatus = (userId: string, isTyping: boolean) => {
    postTypingMessage(BROADCAST_CONSTANTS.ACTIONS.STATUS, { userId, isTyping });
  };

  return {
    users: Object.values(localUsers),
    postTypingStatus,
  };
};
