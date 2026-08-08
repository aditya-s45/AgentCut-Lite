'use client';

import { useChat } from '@ai-sdk/react';
import { useTimelineStore, TextClip, VideoClip } from '../store/useTimelineStore';
import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export const Chat = () => {
  const { messages, sendMessage, addToolResult } = useChat();
  
  const [input, setInput] = useState('');
  
  const { addClip, updateClip, removeClip, clips } = useTimelineStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Execute tool calls on the client
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.role === 'assistant') {
      const partsToProcess = lastMessage.parts || [];
      // Handle AI SDK 4/7 parts array
      partsToProcess.forEach((part: any) => {
        if (part.type?.startsWith('tool-') || ('toolName' in part) || ('toolInvocation' in part)) {
          const toolInvocation = part.toolInvocation || part;
          if (toolInvocation.state === 'result') return; // already executed
          
          const toolName = toolInvocation.toolName || toolInvocation.name;
          const args = toolInvocation.args || toolInvocation.arguments;
          
          if (toolName === 'addTextClip') {
            const { text, startFrame, durationInFrames, color, fontSize } = args;
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
            if (addToolResult) addToolResult({ toolCallId: toolInvocation.toolCallId || toolInvocation.id, tool: toolName, output: 'Success' } as any);
          }
          
          if (toolName === 'applyFilter') {
            const { filter } = args;
            const videoClip = clips.find(c => c.type === 'video');
            if (videoClip) {
              updateClip(videoClip.id, { filter });
            }
            if (addToolResult) addToolResult({ toolCallId: toolInvocation.toolCallId || toolInvocation.id, tool: toolName, output: 'Success' } as any);
          }
        }
      });
    }
  }, [messages, addClip, updateClip, clips, addToolResult]);

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
            
            <div className={`max-w-[80%] rounded-lg p-3 text-sm flex flex-col gap-2 ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#222] text-white/80 border border-white/10'
            }`}>
              {/* Render parts instead of content */}
              {m.parts ? m.parts.map((part, i) => {
                if (part.type === 'text') {
                  return <div key={i}>{part.text}</div>;
                }
                
                if (part.type?.startsWith('tool-') || ('toolName' in part) || ('toolInvocation' in part)) {
                  const tool = (part as any).toolInvocation || part;
                  return (
                    <div key={i} className="text-xs font-mono bg-black/40 p-2 rounded border border-white/5 text-[#ef7438]">
                      &gt; Executing {tool.toolName || tool.name}({JSON.stringify(tool.args || tool.arguments)})
                      <br/>
                      <span className="text-gray-500 opacity-50">Debug: {JSON.stringify(part)}</span>
                    </div>
                  );
                }
                return null;
              }) : (
                <div className="italic text-gray-500">Processing...</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { 
        e.preventDefault(); 
        if (!input.trim()) return;
        // AI SDK 7 expects parts for user messages, or a string for simple text messages
        sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] } as any);
        setInput('');
      }} className="p-3 bg-[#1a1a1a] border-t border-white/10 flex gap-2">
        <input
          className="flex-1 bg-black border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ef7438]/50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
