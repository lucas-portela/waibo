import { MessageChannelStatus, PairingType } from "./common.dto";

// Message Channel DTOs
export interface MessageChannelResponse {
  id: string;
  name: string;
  contact: string;
  type: string;
  status: MessageChannelStatus;
  userId: string;
  botId: string;
  sessionId: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMessageChannelRequest {
  name: string;
  contact: string;
  type: string;
  botId: string;
}

export interface UpdateMessageChannelRequest {
  name?: string;
  contact?: string;
  type?: string;
  botId?: string;
}

export interface MessageChannelTypeResponse {
  type: string;
  name: string;
}

export interface PairingDataResponse {
  channelId: string;
  channelType: string;
  type: PairingType;
  data: string;
}

export interface BindSessionRequest {
  sessionId: string;
}
