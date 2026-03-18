import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import WizardClient from './WizardClient'

interface WizardPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function WizardPage({ searchParams }: WizardPageProps) {
  const { id } = await searchParams;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let personaData = null;
  if (id) {
    const { data, error } = await supabase
      .from('ai_personas')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      personaData = data;
    }
  }

  return <WizardClient personaData={personaData} user={user} />;
}
