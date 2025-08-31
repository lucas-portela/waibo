export const MESSAGE_CHANNEL_PAIRING_DATA = ({
  channelType,
  channelId,
}: {
  channelType: string;
  channelId: string;
}) => `message-channel.${channelType}.pairing-data.${channelId}`;

export const MESSAGE_CHANNEL_REQUEST_PAIRING = (channelType) =>
  `message-channel.${channelType}.request-pairing`;

export const MESSAGE_CHANNEL_UNPAIR = (channelType: string) =>
  `message-channel.${channelType}.unpair`;

export const MESSAGE_CHANNEL_STATUS_UPDATE = ({
  channelId,
  channelType,
}: {
  channelId: string;
  channelType: string;
}) => `message-channel.${channelType}.status-update.${channelId}`;

export const MESSAGE_CHANNEL_OUTPUT_EVENT = (channelType: string) =>
  `message-channel.${channelType}.output-event`;

export const MESSAGE_CHANNEL_INPUT_EVENT = (channelType: string) =>
  `message-channel.${channelType}.input-event`;
