import { useTimelineStore, type TimelineClip } from '../store/useTimelineStore';
import { Film, Type, Music, Image as ImageIcon, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Timeline() {
  const { clips, durationInFrames, removeClip } = useTimelineStore();
  
  // Group clips by trackIndex
  const tracks: { [key: number]: TimelineClip[] } = {};
  clips.forEach(clip => {
    if (!tracks[clip.trackIndex]) tracks[clip.trackIndex] = [];
    tracks[clip.trackIndex].push(clip);
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <Film className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      default: return <Film className="w-4 h-4" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-600/80 border-blue-400';
      case 'text': return 'bg-emerald-600/80 border-emerald-400';
      case 'audio': return 'bg-purple-600/80 border-purple-400';
      case 'image': return 'bg-orange-600/80 border-orange-400';
      default: return 'bg-neutral-600 border-neutral-400';
    }
  };

  return (
    <div className="w-full bg-neutral-900 border-t border-neutral-800 p-4 overflow-x-auto">
      <div className="min-w-[800px] flex flex-col gap-2 relative">
        {/* Time ruler (simplified) */}
        <div className="h-6 flex border-b border-neutral-800 text-xs text-neutral-500 mb-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-neutral-800 pl-1">
              {i}s
            </div>
          ))}
        </div>

        {/* Tracks */}
        {[0, 1, 2].map(trackIndex => (
          <div key={trackIndex} className="h-20 bg-neutral-950/50 rounded-lg relative overflow-hidden border border-neutral-800/50 flex items-center">
            {/* Track Label */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-neutral-900 border-r border-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-500 z-10">
              V{trackIndex + 1}
            </div>

            {/* Clips on this track */}
            <div className="absolute left-16 right-0 top-0 bottom-0 relative">
              {(tracks[trackIndex] || []).map(clip => {
                const leftPercent = (clip.startFrame / durationInFrames) * 100;
                const widthPercent = (clip.durationInFrames / durationInFrames) * 100;

                return (
                  <div
                    key={clip.id}
                    className={cn(
                      "absolute top-2 bottom-2 rounded-md border flex flex-col px-2 py-1 shadow-sm transition-all group overflow-hidden",
                      getColorForType(clip.type)
                    )}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white/90 font-medium text-xs">
                        {getIconForType(clip.type)}
                        <span className="truncate max-w-[100px]">
                          {clip.type === 'text' ? clip.text : clip.id}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeClip(clip.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded transition"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
