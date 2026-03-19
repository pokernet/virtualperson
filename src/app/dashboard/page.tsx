import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's AI personas (limit 30)
  const { data: personas, error: personaError } = await supabase
    .from('ai_personas')
    .select('id, name, relationship, created_at, avatar_url, is_public, age, sex')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  if (personaError) {
    console.error('Error fetching personas:', personaError)
  }

  // Fetch the user's profile for token usage
  const { data: profile } = await supabase
    .from('profiles')
    .select('openai_tokens, anthropic_tokens, local_tokens, account_status')
    .eq('id', user.id)
    .single()

  return (
    <DashboardClient 
      personas={personas} 
      userEmail={user.email} 
      profile={profile} 
    />
  )
}

