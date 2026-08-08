import VideoPlayer from './components/VideoPlayer';
import Timeline from './components/Timeline';
import { Layers } from 'lucide-react';

function App() {
  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      
      {/* Topbar */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-900 flex items-center px-6 justify-between flex-shrink-0 drag-region">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            AgentCut Pro
          </h1>
        </div>
        <div className="text-xs text-neutral-500 font-medium px-2 py-1 bg-neutral-800 rounded-md">
          Phase 2: Core Video Engine
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-h-0">
        
        {/* Top: Video Player & Controls */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <VideoPlayer />
        </div>

        {/* Bottom: Timeline */}
        <div className="h-72 border-t border-neutral-800 flex-shrink-0 bg-neutral-900 shadow-2xl">
          <Timeline />
        </div>
        
      </main>
    </div>
  );
}

export default App;
