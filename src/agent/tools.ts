import { tool } from 'ai';
import { z } from 'zod';
import { useTimelineStore } from '../store/useTimelineStore';

// In OpenChatCut, tools execute against an AgentContext. We will inject the Zustand store methods directly here for simplicity, or we can fetch them via hook.
// Since tools.ts is outside the React tree, we will use `useTimelineStore.getState()`

export const getClientSideTools = () => {
  const store = useTimelineStore.getState();

  return {
    addTextClip: tool({
      description: 'Add a text clip to the video timeline',
      parameters: z.object({
        text: z.string().describe('The text to display'),
        startFrame: z.number().describe('Start frame of the clip (30 frames = 1 second)'),
        durationInFrames: z.number().describe('Duration of the clip in frames (30 frames = 1 second)'),
        color: z.string().optional().describe('Color of the text (e.g., "red", "#ffffff")'),
        fontSize: z.number().optional().describe('Font size in pixels'),
      }),
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
      description: 'Apply a CSS filter to the main video clip',
      parameters: z.object({
        filter: z.string().describe('CSS filter string (e.g., "grayscale(100%)", "blur(5px)")'),
      }),
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
