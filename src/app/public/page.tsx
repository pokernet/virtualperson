import { createClient } from '@/utils/supabase/server';
import PublicDashboardClient from './PublicDashboardClient';

export default async function PublicDashboardPage() {
  const supabase = await createClient();

  // Fetch all public personas
  const { data: personas, error } = await supabase
    .from('ai_personas')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public personas:', JSON.stringify(error, null, 2));
  }

  return <PublicDashboardClient personas={personas || []} />;
}
