import { AbsoluteFill, OffthreadVideo, Sequence } from 'remotion';
import { useTimelineStore } from '../store/useTimelineStore';

export const MainComposition = () => {
  const clips = useTimelineStore((state) => state.clips);
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {clips.map((clip) => {
        if (clip.type === 'video') {
          return (
            <Sequence
              key={clip.id}
              from={clip.startFrame}
              durationInFrames={clip.durationInFrames}
              name={clip.id}
            >
              <AbsoluteFill>
                <OffthreadVideo 
                  src={clip.url} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    filter: clip.filter || 'none'
                  }} 
                />
              </AbsoluteFill>
            </Sequence>
          );
        }
        
        if (clip.type === 'text') {
          return (
            <Sequence
              key={clip.id}
              from={clip.startFrame}
              durationInFrames={clip.durationInFrames}
              name={clip.id}
            >
              <AbsoluteFill
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: clip.yPosition ? `${clip.yPosition}%` : 'auto',
                }}
              >
                <h1
                  style={{
                    color: clip.color,
                    fontSize: clip.fontSize,
                    fontFamily: 'sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                  }}
                >
                  {clip.text}
                </h1>
              </AbsoluteFill>
            </Sequence>
          );
        }
        
        return null;
      })}
    </AbsoluteFill>
  );
};
