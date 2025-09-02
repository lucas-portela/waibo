// Bot Intent DTOs
export interface BotIntentResponse {
  id: string;
  botId: string;
  tag: string;
  name: string;
  trigger: string;
  response: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBotIntentRequest {
  tag?: string;
  name?: string;
  trigger: string;
  response: string;
}

export interface UpdateBotIntentRequest {
  tag?: string;
  name?: string;
  trigger?: string;
  response?: string;
}
