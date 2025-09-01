export type AdvancedPrompt = {
  system: string;
  user: string;
};

export interface LanguageModelService {
  generate(prompt: AdvancedPrompt): Promise<string>;
  generateSimple(prompt: string): Promise<string>;
}
