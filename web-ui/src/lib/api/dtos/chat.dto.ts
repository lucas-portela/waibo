import { ChatSender } from "./common.dto";

// Chat DTOs
export interface ChatResponse {
  id: string;
  name: string;
  contact: string;
  botMemory?: string;
  internalIdentifier: string;
  messageChannelId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessageResponse {
  id: string;
  chatId: string;
  sender: ChatSender;
  content: string;
  createdAt: string;
}

export interface SendMessageRequest {
  chatInternalIdentifier: string;
  content: string;
}

export interface UpdateChatRequest {
  name?: string;
  contact?: string;
  botMemory?: string;
}
