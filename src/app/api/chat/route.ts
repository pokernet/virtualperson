import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { streamText, LanguageModelV1 } from 'ai';
import { createClient } from '@/utils/supabase/server';
import { saveMessage, getOrCreateChat } from '@/utils/supabase/chat';

export const maxDuration = 60;

function resolveAiModel(modelPref: string = 'openai'): LanguageModelV1 {
  const localUrl = process.env.LOCAL_AI_URL || 'http://localhost:1234/v1';
  
  switch (modelPref) {
    case 'anthropic':
      return anthropic('claude-3-5-sonnet-latest');
    case 'local':
      return openai('local-model-id', {
        baseURL: localUrl,
      });
    case 'openai':
    default:
      return openai('gpt-4o');
  }
}

export async function POST(req: Request) {
  const { messages, systemPrompt, modelPref, personaId } = await req.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = resolveAiModel(modelPref || process.env.AI_MODEL_PREFERENCE);

  // Get or create the chat session
  const chatId = await getOrCreateChat(personaId, user.id);

  // Save the user's latest message
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage && lastUserMessage.role === 'user') {
    await saveMessage(chatId, 'user', lastUserMessage.content);
  }

  const result = streamText({
    model,
    messages,
    system: systemPrompt,
    temperature: 0.7,
    onFinish: async (event) => {
      // Save the assistant's response when finished
      await saveMessage(chatId, 'assistant', event.text);
    }
  });

  return result.toDataStreamResponse();
}

