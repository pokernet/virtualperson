import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import ChatInterface from '@/components/ChatInterface'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Await the params to get the ID safely
  const resolvedParams = await params;

  // Fetch the persona data to ensure the user owns it and get the System Prompt
  const { data: persona, error } = await supabase
    .from('ai_personas')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !persona || persona.user_id !== user.id) {
    redirect('/dashboard') // Unauthorized or not found
  }

  // Fetch chat history
  const { data: chatData } = await supabase
    .from('chats')
    .select('id')
    .eq('persona_id', persona.id)
    .eq('user_id', user.id)
    .single();

  let initialMessages: any[] = [];
  if (chatData) {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatData.id)
      .order('created_at', { ascending: true });
    
    if (messages) {
      initialMessages = messages.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      }));
    }
  }


  // If no initial messages, provide a welcome one
  if (initialMessages.length === 0) {
    initialMessages = [
      {
        id: 'welcome-msg',
        role: 'assistant' as const,
        content: `Hello. I'm here. It's good to talk to you.`
      }
    ];
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <ChatInterface 
        personaId={persona.id} 
        personaName={persona.name} 
        avatarUrl={persona.avatar_url}
        systemPrompt={persona.system_prompt} 
        initialMessages={initialMessages}
      />
    </div>
  )

}

