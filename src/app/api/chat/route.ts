import { groq } from '@ai-sdk/groq';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    require('fs').writeFileSync('request_log.txt', JSON.stringify(body));
    const { messages } = body;

    const modelMessages = messages.map((m: any) => {
      if (m.role === 'user' || m.role === 'assistant') {
        return {
          role: m.role,
          content: m.parts 
            ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
            : m.content || '',
          ...(m.role === 'assistant' && m.parts?.some((p: any) => p.type?.startsWith('tool'))
            ? {
                toolCalls: m.parts.filter((p: any) => p.type === 'tool-call').map((p: any) => ({
                  id: p.toolCallId,
                  type: 'function',
                  function: { name: p.toolName, arguments: JSON.stringify(p.args) }
                }))
              }
            : {})
        };
      }
      if (m.role === 'tool') {
        return {
          role: 'tool',
          content: m.parts.map((p: any) => ({
            type: 'tool-result',
            toolCallId: p.toolCallId,
            toolName: p.toolName,
            result: p.result
          }))
        };
      }
      return m;
    });

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are AgentCut Lite, a video editing assistant. You help users edit a video timeline. 
You can add text clips and apply filters to the video. The video is 10 seconds long (300 frames) and runs at 30 fps.
When a user asks to add something at 'N seconds', multiply N by 30 to get the start frame. 
If they don't specify a duration, make it 90 frames (3 seconds).
Be friendly and concise. Confirm what you are doing.`,
      messages: modelMessages,
      tools: {
        addTextClip: tool({
          description: 'Add a text overlay clip to the video timeline.',
          inputSchema: z.object({
            text: z.string().describe('The text to display.'),
            startFrame: z.number().describe('The frame to start displaying the text (fps is 30, so 1 second = 30 frames).'),
            durationInFrames: z.number().describe('How long to display the text in frames.'),
            color: z.string().optional().describe('Color of the text (e.g. red, #fff).'),
            fontSize: z.number().optional().describe('Font size in pixels.'),
          }),
        } as any),
        applyFilter: tool({
          description: 'Apply a CSS filter to the main video clip.',
          inputSchema: z.object({
            filter: z.string().describe('A valid CSS filter string (e.g., "grayscale(100%)", "sepia(100%)", "blur(5px)", "invert(100%)").'),
          }),
        } as any),
      },
      onError: (error) => {
        require('fs').writeFileSync('error_log.txt', require('util').inspect(error, { depth: null }));
        console.error("AI STREAM ONERROR:", error);
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    require('fs').writeFileSync('error_log.txt', String(error));
    console.error("AI STREAM ERROR:", error);
    return new Response(JSON.stringify({ error: error?.toString() || "Unknown error" }), { status: 500 });
  }
}
