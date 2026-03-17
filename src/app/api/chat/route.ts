import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { streamText, LanguageModelV1 } from 'ai';

export const maxDuration = 60; // Allow longer responses

// Helper function to resolve the correct AI provider based on environment/settings
function resolveAiModel(modelPref: string = 'openai'): LanguageModelV1 {
  switch (modelPref) {
    case 'anthropic':
      return anthropic('claude-3-5-sonnet-latest');
    case 'local':
      // Local models don't use standard providers in the same way, but as an example using an OpenAI-compatible local AI like LM Studio
      // Make sure to set `OPENAI_BASE_URL` in .env to http://localhost:1234/v1 or similar where local AI is running.
      return openai('local-model-id');
    case 'openai':
    default:
      return openai('gpt-4o');
  }
}

export async function POST(req: Request) {
  const { messages, systemPrompt, modelPref } = await req.json();

  // In production, you would fetch model preference from the user's database settings.
  // We pass it in from the client-side for now.
  const model = resolveAiModel(modelPref);

  const result = streamText({
    model,
    messages,
    system: systemPrompt, // This contains the deceased's persona details
    temperature: 0.7,     // Keep responses creative but grounded
  });

  return result.toDataStreamResponse();
}
