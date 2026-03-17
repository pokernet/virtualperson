import { createClient } from './server';

export async function saveMessage(chatId: string, role: 'user' | 'assistant' | 'system', content: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        chat_id: chatId,
        role,
        content
      }
    ]);

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function getChatHistory(chatId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data;
}

export async function getOrCreateChat(personaId: string, userId: string) {
  const supabase = await createClient();
  
  // Try to find an existing chat for this persona and user
  const { data: existingChat, error: findError } = await supabase
    .from('chats')
    .select('id')
    .eq('persona_id', personaId)
    .eq('user_id', userId)
    .single();

  if (existingChat) {
    return existingChat.id;
  }

  // If not found, create a new one
  const { data: newChat, error: insertError } = await supabase
    .from('chats')
    .insert([
      {
        persona_id: personaId,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating chat:', insertError);
    throw insertError;
  }

  return newChat.id;
}
