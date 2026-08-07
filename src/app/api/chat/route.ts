import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq('llama-3.1-70b-versatile'),
    system: `You are AgentCut Lite, a video editing assistant. You help users edit a video timeline. 
You can add text clips and apply filters to the video. The video is 10 seconds long (300 frames) and runs at 30 fps.
When a user asks to add something at 'N seconds', multiply N by 30 to get the start frame. 
If they don't specify a duration, make it 90 frames (3 seconds).
Be friendly and concise. Confirm what you are doing.`,
    messages,
    tools: {
      addTextClip: tool({
        description: 'Add a text overlay clip to the video timeline.',
        parameters: z.object({
          text: z.string().describe('The text to display.'),
          startFrame: z.number().describe('The frame to start displaying the text (fps is 30, so 1 second = 30 frames).'),
          durationInFrames: z.number().describe('How long to display the text in frames.'),
          color: z.string().optional().describe('Color of the text (e.g. red, #fff).'),
          fontSize: z.number().optional().describe('Font size in pixels.'),
        }),
        execute: async (args) => {
          return `Instructed the editor to add text: "${args.text}" at frame ${args.startFrame}`;
        }
      }),
      applyFilter: tool({
        description: 'Apply a CSS filter to the main video clip.',
        parameters: z.object({
          filter: z.string().describe('A valid CSS filter string (e.g., "grayscale(100%)", "sepia(100%)", "blur(5px)", "invert(100%)").'),
        }),
        execute: async ({ filter }) => {
          return `Instructed the editor to apply filter: ${filter}`;
        }
      }),
    },
  });

  return result.toDataStreamResponse();
}
