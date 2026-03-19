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
        apiKey: 'not-needed', // Local models often don't need real keys
      });
      return localAi('local-model-id');
    }
    case 'openai':
    default:
      return openai('gpt-4o');
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  let { messages, systemPrompt, modelPref, personaId } = body;

  // Robust extraction: if missing from top-level, check the last message metadata
  const lastMessage = messages[messages.length - 1];
  if (!personaId && lastMessage?.metadata?.personaId) {
    personaId = lastMessage.metadata.personaId;
  }
  if (!systemPrompt && lastMessage?.metadata?.systemPrompt) {
    systemPrompt = lastMessage.metadata.systemPrompt;
  }

  const supabase = await createClient();



  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // --- Start: Token Limit Check ---
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('openai_tokens, anthropic_tokens, local_tokens, max_openai_tokens, max_anthropic_tokens, max_local_tokens')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return new Response('User profile not found', { status: 404 });
  }

  const modelType = modelPref === 'anthropic' ? 'anthropic' : 
                   modelPref === 'local' ? 'local' : 'openai';
  
  const currentTokens = profile[`${modelType}_tokens` as keyof typeof profile] as number || 0;
  const maxTokens = profile[`max_${modelType}_tokens` as keyof typeof profile] as number || 100000;

  if (currentTokens >= maxTokens) {
    return new Response(JSON.stringify({ 
      error: 'Token limit exceeded', 
      message: `You have reached your ${modelType} token limit (${maxTokens}). Please contact an administrator.` 
    }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // --- End: Token Limit Check ---

  // Normalize messages for the AI model: ensure each has a 'content' string
  const normalizedMessages = messages.map((m: any) => {
    if (m.content) return m;
    let content = '';
    if (m.parts) {
      content = m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('\n');
    }
    return { ...m, content };
  });

  const model = resolveAiModel(modelPref || (process.env.AI_MODEL_PREFERENCE as string));

  // Get or create the chat session
  const chatId = await getOrCreateChat(personaId, user.id);

  // Save the user's latest message
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage && lastUserMessage.role === 'user') {
    // Robust content extraction for newest AI SDK versions (uses 'parts' instead of 'content')
    let userContent = lastUserMessage.content || '';
    if (!userContent && lastUserMessage.parts) {
      userContent = lastUserMessage.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('\n');
    }
    
    if (userContent) {
      await saveMessage(chatId, 'user', userContent);
    }
  }


  const result = streamText({
    model,
    messages: normalizedMessages,
    system: systemPrompt,
    temperature: 0.7,
    onFinish: async (event) => {
      // Save the assistant's response when finished
      await saveMessage(chatId, 'assistant', event.text);

      // --- Token Tracking Enhancement ---
      if (event.usage) {
        const totalTokens = event.usage.totalTokens || 0;
        const column = modelPref === 'anthropic' ? 'anthropic_tokens' : 
                      modelPref === 'local' ? 'local_tokens' : 'openai_tokens';

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ [column]: currentTokens + totalTokens })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating token usage:', updateError);
        }
      }
    }
  });
  
  return (result as any).toUIMessageStreamResponse();
}




