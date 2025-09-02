// Bot DTOs
export interface BotResponse {
  id: string;
  name: string;
  prompt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBotRequest {
  name: string;
  prompt: string;
  intents: { trigger: string; response: string }[];
}

export interface UpdateBotRequest {
  name?: string;
  prompt?: string;
}
