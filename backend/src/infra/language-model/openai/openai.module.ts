import { Global, Module } from '@nestjs/common';
import { LANGUAGE_MODEL_SERVICE } from 'src/application/bot/tokens';
import { OpenAiService } from './openai.service';

@Global()
@Module({
  providers: [
    {
      provide: LANGUAGE_MODEL_SERVICE,
      useClass: OpenAiService,
    },
  ],
  exports: [LANGUAGE_MODEL_SERVICE],
})
export class OpenAiModule {}
