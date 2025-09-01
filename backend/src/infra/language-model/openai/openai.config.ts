export const OPENAI_CONFIG = {
  API_KEY: 'OPENAI_API_KEY',
  MODEL: 'OPENAI_MODEL',
  MAX_OUTPUT_TOKENS: 'OPENAI_MAX_OUTPUT_TOKENS',
};

export const openAiConfig = () => ({
  [OPENAI_CONFIG.API_KEY]: process.env.OPENAI_API_KEY,
  [OPENAI_CONFIG.MODEL]: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  [OPENAI_CONFIG.MAX_OUTPUT_TOKENS]: Number(
    process.env.OPENAI_MAX_OUTPUT_TOKENS || '1024',
  ),
});
