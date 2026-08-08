import { useState, useCallback, useRef } from 'react';
import { streamText, type CoreMessage } from 'ai';
import { getProviderInstance } from './providerConfig';
import { getActiveAgentModelChoice } from './model-selection';
import { getClientSideTools } from './tools';

export type DisplayMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts?: any[];
};

export function useAgent() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const coreMessagesRef = useRef<CoreMessage[]>([]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    coreMessagesRef.current.push({ role: 'user', content: input });
    setInput('');
    setIsLoading(true);

    const activeModel = getActiveAgentModelChoice();
    const providerInstance = getProviderInstance(activeModel.provider);
    
    // Add empty assistant message to append to
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', parts: [] }]);

    try {
      const result = await streamText({
        model: providerInstance(activeModel.requestModel),
        messages: coreMessagesRef.current,
        system: `You are AgentCut Pro, a powerful AI video editing agent running entirely on the client side. 
        You control a timeline. The user will ask you to edit a video. 
        You have tools to modify the timeline. Always use your tools to fulfill the user's request.
        Assume 30 frames per second. If the user says 'at 2 seconds for 3 seconds', startFrame=60, durationInFrames=90.`,
        tools: getClientSideTools(),
        maxSteps: 3,
      });

      let fullText = '';
      const toolInvocations: any[] = [];

      for await (const chunk of result.fullStream) {
        if (chunk.type === 'text-delta') {
          fullText += chunk.textDelta;
          setMessages((prev) => {
            const newMessages = [...prev];
            const last = newMessages[newMessages.length - 1];
            if (last.id === assistantId) {
              last.content = fullText;
            }
            return newMessages;
          });
        } else if (chunk.type === 'tool-call') {
          const invocation = {
            toolName: chunk.toolName,
            args: chunk.args,
          };
          toolInvocations.push(invocation);
          setMessages((prev) => {
            const newMessages = [...prev];
            const last = newMessages[newMessages.length - 1];
            if (last.id === assistantId) {
              last.parts = [...(last.parts || []), { type: 'tool-call', toolInvocation: invocation }];
            }
            return newMessages;
          });
        }
      }

      // Add to core history
      coreMessagesRef.current.push({ role: 'assistant', content: fullText });
    } catch (error: any) {
      console.error('Agent error:', error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: `**Error:** ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return {
    messages,
    input,
    handleInputChange: (e: any) => setInput(e.target.value),
    handleSubmit,
    isLoading,
  };
}
