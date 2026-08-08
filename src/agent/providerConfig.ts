import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1 } from '@ai-sdk/provider';

export type LlmProvider = 'groq' | 'anthropic' | 'openai';

// Instead of passing the real API key to the browser, we pass a dummy key.
// The Vite backend proxy (server/plugins/llm-proxy.ts) will intercept the request
// and inject the REAL api key securely. This prevents the browser from ever knowing the key.
const PROXY_KEY = 'proxy-injects-the-real-key';
const PROXY_API_BASE = '/llm';

export const getProviderInstance = (provider: LlmProvider) => {
  if (provider === 'groq') {
    // We use OpenAI compatible since Groq is OpenAI compatible. 
    // The baseURL points to OUR LOCAL PROXY, not Groq!
    const openai = createOpenAI({
      baseURL: PROXY_API_BASE,
      apiKey: PROXY_KEY,
    });
    // Force the /chat/completions endpoint which Groq requires, 
    // instead of the default /responses endpoint.
    return openai.chat;
  }
  
  throw new Error(`Provider ${provider} is not configured yet.`);
};
