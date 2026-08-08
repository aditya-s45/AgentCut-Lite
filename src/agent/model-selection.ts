import { LlmProvider } from './providerConfig';

export interface AgentModelChoice {
  id: string;
  provider: LlmProvider;
  requestModel: string;
}

export function getActiveAgentModelChoice(): AgentModelChoice {
  return {
    id: 'groq-llama-3.3-70b',
    provider: 'groq',
    requestModel: 'llama-3.3-70b-versatile',
  };
}
