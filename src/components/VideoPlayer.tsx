import { Player } from '@remotion/player';
import { MainComposition } from '../remotion/MainComposition';
import { useTimelineStore } from '../store/useTimelineStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useRef, useState } from 'react';
import type { PlayerRef } from '@remotion/player';

export default function VideoPlayer() {
  const { fps, durationInFrames } = useTimelineStore();
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full max-w-4xl mx-auto p-4">
      <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl aspect-video">
        <Player
          ref={playerRef}
          component={MainComposition}
          durationInFrames={durationInFrames}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={fps}
          style={{ width: '100%', height: '100%' }}
          controls={true}
          autoPlay={false}
          loop
          acknowledgeRemotionLicense
        />
      </div>
      
      {/* Custom Controls (Optional since Remotion has built-in controls, but good for Agent interaction) */}
      <div className="flex items-center justify-center gap-4 bg-neutral-900 p-3 rounded-lg border border-neutral-800">
        <button 
          onClick={() => playerRef.current?.seekTo(0)}
          className="p-2 hover:bg-neutral-800 rounded-full transition"
        >
          <SkipBack className="w-5 h-5 text-neutral-400 hover:text-white" />
        </button>
        <button 
          onClick={togglePlay}
          className="p-3 bg-white text-black hover:bg-neutral-200 rounded-full transition shadow-lg"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
        </button>
        <button 
          onClick={() => playerRef.current?.seekTo(durationInFrames - 1)}
          className="p-2 hover:bg-neutral-800 rounded-full transition"
        >
          <SkipForward className="w-5 h-5 text-neutral-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
