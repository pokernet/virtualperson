import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText, LanguageModel } from 'ai';
import { createClient } from '@/utils/supabase/server';
import { saveMessage, getOrCreateChat } from '@/utils/supabase/chat';

export const maxDuration = 60;

function resolveAiModel(modelPref: string = 'openai'): LanguageModel {
  const localUrl = process.env.LOCAL_AI_URL || 'http://localhost:1234/v1';
  
  switch (modelPref) {
    case 'anthropic':
      return anthropic('claude-3-5-sonnet-latest');
    case 'local': {
      const localAi = createOpenAI({
        baseURL: localUrl,
        apiKey: 'not-needed',
      });
      return localAi('local-model-id');
    }
    case 'openai':
    default:
      return openai('gpt-4o');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let { messages, systemPrompt, modelPref, personaId } = body;

    const lastMessage = messages?.[messages.length - 1];
    if (!personaId && lastMessage?.metadata?.personaId) {
      personaId = lastMessage.metadata.personaId;
    }
    if (!systemPrompt && lastMessage?.metadata?.systemPrompt) {
      systemPrompt = lastMessage.metadata.systemPrompt;
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Token Limit Check
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let tokenLimitExceeded = false;
    let tokenLimitMessage = '';
    const modelType = modelPref === 'anthropic' ? 'anthropic' :
                     modelPref === 'local' ? 'local' : 'openai';

    if (!profileError && profile) {
      const currentTokens = (profile as any)[`${modelType}_tokens`] as number || 0;
      const maxTokens = (profile as any)[`max_${modelType}_tokens`] as number || 1000000;

      if (currentTokens >= maxTokens) {
        tokenLimitExceeded = true;
        tokenLimitMessage = `You have reached your ${modelType} token limit (${maxTokens}). Please contact an administrator.`;
      }
    }

    if (tokenLimitExceeded) {
      return new Response(JSON.stringify({
        error: 'Token limit exceeded',
        message: tokenLimitMessage
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedMessages = messages.map((m: any) => {
      let content = m.content || '';
      if (!content && m.parts) {
        content = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('\n');
      }
      return { role: m.role, content };
    });

    const model = resolveAiModel(modelPref || (process.env.AI_MODEL_PREFERENCE as string));

    let chatId: string | null = null;
    if (personaId) {
      try {
        chatId = await getOrCreateChat(personaId, user.id);
        const lastUserMsg = normalizedMessages[normalizedMessages.length - 1];
        if (lastUserMsg?.role === 'user' && lastUserMsg.content) {
          await saveMessage(chatId, 'user', lastUserMsg.content);
        }
      } catch (err) {
        console.error('Error saving user message:', err);
      }
    }

    const result = streamText({
      model,
      messages: normalizedMessages,
      system: systemPrompt,
      temperature: 0.7,
      onFinish: async (event) => {
        if (chatId) {
          await saveMessage(chatId, 'assistant', event.text);
        }
        
        if (event.usage && profile) {
          const totalTokens = event.usage.totalTokens || 0;
          const column = modelType === 'anthropic' ? 'anthropic_tokens' :
                        modelType === 'local' ? 'local_tokens' : 'openai_tokens';
          const currentTokens = (profile as any)[column] as number || 0;
          
          await supabase
            .from('profiles')
            .update({ [column]: currentTokens + totalTokens })
            .eq('id', user.id);
        }
      }
    });

    // For AI SDK v6, use toUIMessageStreamResponse() which provides the structured format
    // needed by the useChat hook. Fallback to toTextStreamResponse if needed.
    return (result as any).toUIMessageStreamResponse?.() || (result as any).toTextStreamResponse?.();

  } catch (err) {
    console.error('Chat API Error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response('API is operational. Use POST to interact.', { status: 200 });
}
