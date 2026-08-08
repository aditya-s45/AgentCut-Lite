import { tool } from 'ai';
import { z } from 'zod';
import { useTimelineStore } from '../store/useTimelineStore';

// In OpenChatCut, tools execute against an AgentContext. We will inject the Zustand store methods directly here for simplicity, or we can fetch them via hook.
// Since tools.ts is outside the React tree, we will use `useTimelineStore.getState()`

export const getClientSideTools = () => {
  const store = useTimelineStore.getState();

  return {
    addTextClip: tool({
      description: 'Add a text clip to the video timeline. You must provide a JSON object with: text (string), startFrame (number), durationInFrames (number), color (string, optional), fontSize (number, optional).',
      parameters: z.object({}).catchall(z.any()),
      execute: async (args) => {
        store.addClip({
          id: `text-${Date.now()}`,
          type: 'text',
          trackIndex: 1, // Put text on track 1 (above video on track 0)
          startFrame: args.startFrame,
          durationInFrames: args.durationInFrames,
          text: args.text,
          color: args.color || 'white',
          fontSize: args.fontSize || 60,
        });
        return { success: true, message: `Added text clip: ${args.text}` };
      },
    }),
    
    applyFilter: tool({
      description: 'Apply a CSS filter to the main video clip. You must provide a JSON object with: filter (string) e.g., "grayscale(100%)", "blur(5px)".',
      parameters: z.object({}).catchall(z.any()),
      execute: async (args) => {
        const videoClip = store.clips.find(c => c.type === 'video');
        if (videoClip) {
          store.updateClip(videoClip.id, { filter: args.filter });
          return { success: true, message: `Applied filter: ${args.filter}` };
        }
        return { success: false, message: 'No video clip found to apply filter to.' };
      },
    })
  };
};
