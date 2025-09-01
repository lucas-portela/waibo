import {
  AdvancedPrompt,
  LanguageModelService,
} from 'src/application/bot/ports/language-model.service';
import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { InvalidConfigurationError } from 'src/core/error/invalid-configuration-error';
import { OPENAI_CONFIG } from './openai.config';
import { Injectable, Logger } from '@nestjs/common';
import { LanguageModelQuotaExceededError } from 'src/core/error/language-model-quota-exceeded.error';
import { LanguageModelMisconfiguredError } from 'src/core/error/language-model-misconfigured.error';
import { LanguageModelServerError } from 'src/core/error/language-model-server.error';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAiService implements LanguageModelService {
  private readonly logger = new Logger(OpenAiService.name);
  private openai: OpenAIProvider;
  private model: ReturnType<ReturnType<typeof createOpenAI>>;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.openai = createOpenAI({
      apiKey: this._getApiKey(),
    });
    this.model = this.openai(this._getModelName());

    this.logger.log(`Initialized with model ${this._getModelName()}`);
    this.logger.log(`Max output tokens: ${this._getMaxOutputTokens()}`);
  }

  async generate(prompt: AdvancedPrompt): Promise<string> {
    const maxOutputTokens = this._getMaxOutputTokens();
    try {
      const { text } = await generateText({
        model: this.model,
        system: prompt.system,
        prompt: prompt.user,
        maxOutputTokens,
      });
      return text;
    } catch (err) {
      this._handleError(err);
      throw err;
    }
  }

  async generateSimple(prompt: string): Promise<string> {
    const maxOutputTokens = this._getMaxOutputTokens();
    try {
      const { text } = await generateText({
        model: this.model,
        prompt,
        maxOutputTokens,
      });
      return text;
    } catch (err) {
      this._handleError(err);
      throw err;
    }
  }

  // Helpers
  private _getApiKey() {
    const apiKey = this.config.get<string>(OPENAI_CONFIG.API_KEY);
    if (!apiKey) {
      throw new InvalidConfigurationError(OPENAI_CONFIG.API_KEY);
    }
    return apiKey;
  }

  private _getModelName() {
    const model = this.config.get<string>(OPENAI_CONFIG.MODEL);
    if (!model) {
      throw new InvalidConfigurationError(OPENAI_CONFIG.MODEL);
    }
    return model;
  }

  private _getMaxOutputTokens() {
    const maxOutputTokens = this.config.get<number>(
      OPENAI_CONFIG.MAX_OUTPUT_TOKENS,
    );
    if (!maxOutputTokens || maxOutputTokens <= 0) {
      throw new InvalidConfigurationError(OPENAI_CONFIG.MAX_OUTPUT_TOKENS);
    }
    return maxOutputTokens;
  }

  private _handleError(err: any) {
    if (err.status === 401) {
      throw new LanguageModelMisconfiguredError();
    } else if (err.status === 429) {
      throw new LanguageModelQuotaExceededError();
    } else if (err.status >= 500) {
      throw new LanguageModelServerError();
    }
  }
}
