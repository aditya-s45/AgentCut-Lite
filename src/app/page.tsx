import { Chat } from '@/components/Chat';
import { TimelineUI } from '@/components/TimelineUI';
import { VideoPlayer } from '@/components/VideoPlayer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white p-4 font-sans">
      <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-4">
        
        {/* Left Side: Video & Timeline */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-3 py-2">
            <span className="bg-white px-2 py-1 text-xs font-black tracking-tighter text-black rounded-sm">OPEN</span>
            <h1 className="text-xl font-bold tracking-tight text-white/90">AgentCut Lite</h1>
          </div>
          
          <div className="w-full flex-1 min-h-[40vh] flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/50 backdrop-blur text-xs rounded border border-white/10 font-mono text-white/60">
              Preview / Remotion
            </div>
            <div className="w-full h-full p-8 flex items-center justify-center">
              <VideoPlayer />
            </div>
          </div>
          
          <TimelineUI />
        </div>
        
        {/* Right Side: Agent Chat */}
        <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 h-[400px] md:h-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
