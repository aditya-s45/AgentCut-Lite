import { AbsoluteFill, Audio, Video, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { useTimelineStore } from '../store/useTimelineStore';

export const MainComposition = () => {
  const { clips } = useTimelineStore();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-black flex items-center justify-center">
      {clips.map((clip) => {
        return (
          <Sequence
            key={clip.id}
            from={clip.startFrame}
            durationInFrames={clip.durationInFrames}
          >
            {clip.type === 'video' && clip.src && (
              <AbsoluteFill>
                <Video
                  src={clip.src}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: clip.filter,
                  }}
                />
              </AbsoluteFill>
            )}
            {clip.type === 'text' && (
              <AbsoluteFill className="flex items-center justify-center pointer-events-none">
                <h1
                  style={{
                    color: clip.color || 'white',
                    fontSize: clip.fontSize || 60,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {clip.text}
                </h1>
              </AbsoluteFill>
            )}
            {clip.type === 'audio' && clip.src && (
              <Audio src={clip.src} volume={clip.volume ?? 1} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
