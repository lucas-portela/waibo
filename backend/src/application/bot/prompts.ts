import { ChatSender } from '@prisma/client';
import { ChatMessageDto } from '../chat/dtos/chat-message.dto';
import { BotIntentDto } from './dtos/bot-intent.dto';

export const BOT_SYSTEM_PROMPT = ({
  taskDescription,
  memory,
  intents,
  history,
}: {
  taskDescription: string;
  memory: string | null;
  intents: BotIntentDto[];
  history: ChatMessageDto[];
}) => {
  let prompt =
    `You are an AI assistant designed to help users with a specific task.` +
    `To accomplish this, you should follow your task instructions carefully,` +
    `make use of your memories and answer in the predefined and structured format.` +
    `You also have access to some predefined "intents", that are tags with specific triggers.` +
    `To save up computational resources, whenever a intent is triggered, you will output the intent` +
    `tag instead of the full response.`;
  prompt += `\n\nYour task is: ${taskDescription}\n\n`;

  if (memory) {
    prompt += `Your memory is: ${memory}\n\n`;
  }

  if (history && history.length > 0) {
    prompt += `The recent conversation history is:\n`;
    prompt += history
      .map(
        (msg) =>
          `${msg.sender === ChatSender.RECIPIENT ? 'User' : 'Assistant'}: ${msg.content}\n`,
      )
      .join('\n');
    prompt += `\n\n`;
  }

  if (intents && intents.length > 0) {
    prompt += `The intents are (format: - <tag>: <trigger>):\n`;
    prompt += `${intents.map((intent) => `- ${intent.tag}: ${intent.trigger}`).join('\n')}\n\n`;
  }

  prompt +=
    `IMPORTANT: It is very important to remember every usefull information the user provides you, and store it in your memory` +
    `to keep the context and the flow without resetting the conversation.\n\n`;

  prompt += `When you respond, use the following format:\n
  {
    "triggered_intent": "<tag of the triggered intent or null if no intent was triggered>",
    "memory_update": "<a short text to be saved in memory or null if no memory update is needed>",
    "response": "<your full response to the user, or null if an intent was triggered>"
  }\n`;
  return prompt;
};
