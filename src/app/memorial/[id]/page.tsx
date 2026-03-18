import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import MemorialView from '@/components/MemorialView';
import { getOrCreateMemorial } from '../actions';

interface MemorialPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemorialPage({ params }: MemorialPageProps) {
  const { id: personaId } = await params;
  const supabase = await createClient();

  // 1. Get Authentication (don't redirect guest)
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch Persona
  const { data: persona, error: personaError } = await supabase
    .from('ai_personas')
    .select('*')
    .eq('id', personaId)
    .single();

  if (personaError || !persona) return notFound();

  // 3. Security Check: Only allow if public OR if owner
  const isOwner = user ? persona.user_id === user.id : false;
  
  if (!persona.is_public && !isOwner) {
    // If private and not owner, redirect to login or show not found
    if (!user) redirect('/login');
    return notFound();
  }

  // 4. Get or Create Memorial
  const memorial = await getOrCreateMemorial(personaId);

  if (!memorial) {
    if (isOwner) {
       // This shouldn't happen for owners as getOrCreateMemorial would create it
       return notFound();
    }
    // Guest visiting uninitialized public profile
    return (
      <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-primary)', color: 'white', minHeight: '100vh' }}>
        <h1 style={{ marginBottom: '1rem' }}>{persona.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {persona.relationship}
        </p>
        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-tertiary)', borderRadius: '24px', maxWidth: '500px', margin: '3rem auto' }}>
          <p>The memorial for {persona.name} is currently being prepared.</p>
          <Link href="/public" style={{ color: 'var(--accent-primary)', display: 'block', marginTop: '1rem' }}>
            Back to Public Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 5. Fetch Tributes
  const { data: messages } = await supabase
    .from('memorial_messages')
    .select('*')
    .eq('memorial_id', memorial.id)
    .order('created_at', { ascending: false });

  // 6. Fetch Images
  const { data: images } = await supabase
    .from('memorial_images')
    .select('*')
    .eq('memorial_id', memorial.id)
    .order('created_at', { ascending: false });

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
