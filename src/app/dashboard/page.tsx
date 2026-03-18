import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's AI personas
  const { data: personas } = await supabase
    .from('ai_personas')
    .select('id, name, relationship, created_at, avatar_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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

