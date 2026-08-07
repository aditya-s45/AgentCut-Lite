'use client';

import { Player } from '@remotion/player';
import { MainComposition } from '../remotion/Composition';
import { useTimelineStore } from '../store/useTimelineStore';
import { useEffect, useState } from 'react';

export const VideoPlayer = () => {
  const { durationInFrames, fps, width, height } = useTimelineStore();
  
  // To avoid hydration mismatch since Zustand state might differ on initial load
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return <div className="w-full aspect-video bg-gray-900 animate-pulse rounded-lg" />;

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
      <Player
        component={MainComposition}
        durationInFrames={durationInFrames}
        compositionWidth={width}
        compositionHeight={height}
        fps={fps}
        controls
        autoPlay
        loop
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
