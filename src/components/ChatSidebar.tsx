import { Send, Bot, User, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAgent } from '../agent/useAgent';

export default function ChatSidebar() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAgent();

  return (
    <div className="w-80 border-l border-neutral-800 bg-neutral-900 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center gap-2">
        <Bot className="w-5 h-5 text-indigo-400" />
        <h2 className="font-semibold text-neutral-200">Agent Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-neutral-800 text-neutral-300'}`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`flex-1 rounded-2xl p-3 text-sm ${msg.role === 'assistant' ? 'bg-neutral-800/50 text-neutral-300' : 'bg-indigo-600 text-white'}`}>
              <div className="prose prose-invert max-w-none prose-p:leading-snug prose-p:mt-0 prose-p:mb-0">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
              
              {/* Render Tool Invocations */}
              {msg.parts?.map((part: any, idx: number) => (
                <div key={idx} className="mt-2 text-xs bg-neutral-950 p-2 rounded border border-neutral-700/50 text-emerald-400 font-mono">
                  &gt; Executing {part.toolInvocation.toolName}(...)
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-neutral-900 border-t border-neutral-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="E.g., Add a red title saying 'Subscribe' at 2s"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-full py-2.5 pl-4 pr-12 text-sm text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-full text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
