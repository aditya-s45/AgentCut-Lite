// Simplified provider config matching OpenChatCut's dynamic selection structure
import { createOpenAI } from '@ai-sdk/openai';

export type LlmProvider = 'groq' | 'openai' | 'anthropic';

// Since this is a local app, we will use Vite env vars for the default key
// In a full implementation, we'd read this from localStorage or Electron secure store
const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export const PROVIDER: LlmProvider = 'groq';

export function getProviderInstance(provider: LlmProvider = PROVIDER) {
  if (provider === 'groq') {
    return createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: DEFAULT_GROQ_KEY,
    });
  }
  
  if (provider === 'openai') {
    return createOpenAI({
      apiKey: 'test-key',
    });
  }
  
  throw new Error(`Unsupported provider: ${provider}`);
}
