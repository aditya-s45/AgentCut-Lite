'use client';

import { useTimelineStore } from '../store/useTimelineStore';

export const TimelineUI = () => {
  const { clips, durationInFrames } = useTimelineStore();
  
  // A simple visualization of the timeline
  return (
    <div className="w-full h-48 bg-[#111] border border-white/10 rounded-lg p-4 overflow-y-auto flex flex-col gap-2">
      <div className="text-xs text-white/50 mb-2 uppercase tracking-wider font-mono">
        Timeline Workspace
      </div>
      
      {/* Video Track */}
      <div className="flex bg-[#1a1a1a] rounded h-12 relative w-full overflow-hidden border border-white/5">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#222] border-r border-white/10 flex items-center justify-center text-[10px] text-white/40 font-mono z-10">
          V1
        </div>
        <div className="ml-16 relative w-full h-full">
          {clips.filter(c => c.type === 'video').map(clip => {
            const left = `${(clip.startFrame / durationInFrames) * 100}%`;
            const width = `${(clip.durationInFrames / durationInFrames) * 100}%`;
            return (
              <div 
                key={clip.id} 
                className="absolute h-full bg-blue-900/50 border border-blue-500/50 rounded flex items-center px-2"
                style={{ left, width }}
              >
                <span className="text-[10px] text-blue-200 truncate">{clip.id}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text Track */}
      <div className="flex bg-[#1a1a1a] rounded h-12 relative w-full overflow-hidden border border-white/5 mt-1">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#222] border-r border-white/10 flex items-center justify-center text-[10px] text-white/40 font-mono z-10">
          T1
        </div>
        <div className="ml-16 relative w-full h-full">
          {clips.filter(c => c.type === 'text').map(clip => {
            const left = `${(clip.startFrame / durationInFrames) * 100}%`;
            const width = `${(clip.durationInFrames / durationInFrames) * 100}%`;
            return (
              <div 
                key={clip.id} 
                className="absolute h-full bg-orange-900/50 border border-orange-500/50 rounded flex items-center px-2"
                style={{ left, width }}
              >
                <span className="text-[10px] text-orange-200 truncate">{clip.type === 'text' ? clip.text : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
