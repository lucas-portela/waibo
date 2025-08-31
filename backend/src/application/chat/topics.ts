export const MESSAGE_CHANNEL_CREATED = (channelType: string) =>
  `message-channel.${channelType}.created`;

export const MESSAGE_CHANNEL_PAIRING_CODE = ({
  channelType,
  channelId,
}: {
  channelType: string;
  channelId: string;
}) => `message-channel.${channelType}.pairing-data.${channelId}`;

export const MESSAGE_CHANNEL_REQUEST_PAIRING = (channelType) =>
  `message-channel.${channelType}.request-pairing`;

export const MESSAGE_CHANNEL_REMOVED = (channelType: string) =>
  `message-channel.${channelType}.removed`;
