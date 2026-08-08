import type { IncomingMessage } from 'node:http';
import type { Plugin } from 'vite';
import { proxyMiddleware } from '../proxy';
import * as dotenv from 'dotenv';
dotenv.config(); // Ensure env is loaded in the node process

export function llmProviderForRequest(req?: IncomingMessage): string {
  return 'groq'; // Always Groq for this lightweight version
}

export function llmTarget(req?: IncomingMessage): string {
  return 'https://api.groq.com/openai/v1';
}

export function llmHeaders(req?: IncomingMessage): Record<string, string> {
  const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) return {};
  return { authorization: `Bearer ${apiKey}` };
}

export function llmErrorMessage(status: number, req?: IncomingMessage): string {
  if (status === 401 || status === 403) {
    return `Authentication failed. Check your GROQ API Key in .env`;
  }
  return `Groq request failed with HTTP ${status}.`;
}

/** One dynamic proxy implementation shared by Vite dev and Electron production. */
export function llmProxyPlugin(): Plugin {
  return {
    name: 'openchatcut-llm-proxy',
    configureServer(server) {
      server.middlewares.use('/llm', proxyMiddleware({
        target: llmTarget,
        headers: llmHeaders,
        forceJsonContentType: true,
        errorMessage: llmErrorMessage,
      }));
    },
  };
}
