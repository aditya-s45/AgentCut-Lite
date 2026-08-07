'use client';

import { useChat } from '@ai-sdk/react';
import { useTimelineStore, TextClip, VideoClip } from '../store/useTimelineStore';
import { useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';

export const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  
  const { addClip, updateClip, removeClip, clips } = useTimelineStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Execute tool calls on the client
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.role === 'assistant' && lastMessage.toolInvocations) {
      lastMessage.toolInvocations.forEach((toolInvocation) => {
        if (toolInvocation.state === 'result') return; // already executed
        
        // Execute the tool locally
        if (toolInvocation.toolName === 'addTextClip') {
          const { text, startFrame, durationInFrames, color, fontSize } = toolInvocation.args;
          const newClip: TextClip = {
            id: `text-${Date.now()}`,
            type: 'text',
            trackIndex: 1,
            text,
            startFrame,
            durationInFrames,
            color: color || 'white',
            fontSize: fontSize || 60,
          };
          addClip(newClip);
        }
        
        if (toolInvocation.toolName === 'applyFilter') {
          const { filter } = toolInvocation.args;
          // Apply to the first video clip for simplicity
          const videoClip = clips.find(c => c.type === 'video');
          if (videoClip) {
            updateClip(videoClip.id, { filter });
          }
        }
      });
    }
  }, [messages, addClip, updateClip, clips]);

  return (
    <div className="flex flex-col h-full bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-[#1a1a1a]">
        <h2 className="font-semibold text-white/90 flex items-center gap-2">
          <Bot size={18} className="text-[#ef7438]" />
          Agent Editor
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-[#222] border border-white/10'}`}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-[#ef7438]" />}
            </div>
            
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#222] text-white/80 border border-white/10'
            }`}>
              {m.content}
              
              {/* Display Tool Executions */}
              {m.toolInvocations?.map((tool) => (
                <div key={tool.toolCallId} className="mt-2 text-xs font-mono bg-black/40 p-2 rounded border border-white/5 text-[#ef7438]">
                  &gt; Executing {tool.toolName}({JSON.stringify(tool.args)})
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-[#1a1a1a] border-t border-white/10 flex gap-2">
        <input
          className="flex-1 bg-black border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ef7438]/50"
          value={input}
          onChange={handleInputChange}
          placeholder="E.g., Add a red title saying 'Subscribe' at 2s"
        />
        <button 
          type="submit"
          className="bg-white text-black px-4 rounded-md font-medium hover:bg-[#ef7438] hover:text-white transition-colors flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
