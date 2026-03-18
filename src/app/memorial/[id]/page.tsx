import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import MemorialView from '@/components/MemorialView';
import { getOrCreateMemorial } from '../actions';

interface MemorialPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemorialPage({ params }: MemorialPageProps) {
  const { id: personaId } = await params;
  const supabase = await createClient();

  // 1. Get Authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Fetch Persona
  const { data: persona, error: personaError } = await supabase
    .from('ai_personas')
    .select('*')
    .eq('id', personaId)
    .single();

  if (personaError || !persona) return notFound();

  // 3. Get or Create Memorial
  const memorial = await getOrCreateMemorial(personaId);

  // 4. Fetch Tributes
  const { data: messages } = await supabase
    .from('memorial_messages')
    .select('*')
    .eq('memorial_id', memorial.id)
    .order('created_at', { ascending: false });

  // 5. Fetch Images
  const { data: images } = await supabase
    .from('memorial_images')
    .select('*')
    .eq('memorial_id', memorial.id)
    .order('created_at', { ascending: false });

  const isOwner = persona.user_id === user.id;

  return (
    <MemorialView 
      memorial={memorial}
      persona={persona}
      messages={messages || []}
      images={images || []}
      isOwner={isOwner}
    />
  );
}
