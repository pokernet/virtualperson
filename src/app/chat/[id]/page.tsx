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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1.5rem',
        marginBottom: '1rem',
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/dashboard" style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
            }}>
            ← Back
            </Link>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '500' }}>{persona.name}</h1>
        </div>
        
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
            Powered by GPT-4o
        </div>
      </header>

      <ChatInterface 
        personaId={persona.id} 
        personaName={persona.name} 
        systemPrompt={persona.system_prompt} 
      />
    </div>
  )
}
