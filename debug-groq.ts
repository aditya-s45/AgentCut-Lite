import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

async function main() {
  const provider = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.VITE_GROQ_API_KEY,
  });

  try {
    const result = await generateText({
      model: provider('llama-3.3-70b-versatile'),
      messages: [{ role: 'user', content: 'test' }],
      tools: {
        testTool: {
          description: 'A test tool',
          parameters: z.object({ value: z.string() }),
          execute: async ({value}) => value,
        }
      }
    });
    console.log("Success:", result.text);
  } catch (err: any) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error(await err.response.text());
    }
  }
}

main();
