export const isOwnMessage = ({
  currentUserId,
  messageUserId,
}: {
  messageUserId: string;
  currentUserId: string;
}) => {
  return messageUserId === currentUserId;
};
