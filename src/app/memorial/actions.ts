'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getOrCreateMemorial(personaId: string) {
  const supabase = await createClient();

  // Try to find existing memorial
  const { data: memorial, error } = await supabase
    .from('memorials')
    .select('*')
    .eq('persona_id', personaId)
    .single();

  if (memorial) return memorial;

  // If not found, only create if the user is authenticated (owner check happens in RLS)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Create one
  const { data: newMemorial, error: createError } = await supabase
    .from('memorials')
    .insert({ persona_id: personaId })
    .select()
    .single();

  if (createError) throw createError;
  return newMemorial;
}

export async function lightCandle(memorialId: string) {
  const supabase = await createClient();
  
  // Atomic increment using RPC is ideal, but for now we'll do a simple update
  // In a real app, use: await supabase.rpc('increment_candle', { m_id: memorialId });
  
  const { data: memorial } = await supabase
    .from('memorials')
    .select('candle_count')
    .eq('id', memorialId)
    .single();

  if (!memorial) return;

  const { error } = await supabase
    .from('memorials')
    .update({ candle_count: (memorial.candle_count || 0) + 1 })
    .eq('id', memorialId);

  if (error) throw error;
  revalidatePath(`/memorial/${memorialId}`);
}

export async function postTribute(memorialId: string, content: string, authorName?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('memorial_messages')
    .insert({
      memorial_id: memorialId,
      user_id: user?.id || null,
      author_name: authorName || (user ? 'Authenticated User' : 'Anonymous'),
      content,
      is_approved: false // Tributes need approval by default
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/memorial/${memorialId}`);
  return data;
}

export async function updateBio(memorialId: string, bio: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('memorials')
    .update({ bio })
    .eq('id', memorialId);

  if (error) throw error;
  revalidatePath(`/memorial/${memorialId}`);
}

export async function uploadMemorialImage(memorialId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('image') as File;
  if (!file) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${memorialId}/${Math.random()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('memorials')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('memorials')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from('memorial_images')
    .insert({
      memorial_id: memorialId,
      url: publicUrl
    });

  if (dbError) throw dbError;
  revalidatePath(`/memorial/${memorialId}`);
}

export async function deleteMemorialImage(memorialId: string, imageId: string, imageUrl: string) {
  const supabase = await createClient();

  // 1. Delete from DB
  const { error: dbError } = await supabase
    .from('memorial_images')
    .delete()
    .eq('id', imageId);

  if (dbError) throw dbError;

  // 2. Delete from Storage
  // Extract path from public URL
  const path = imageUrl.split('/memorials/').pop();
  if (path) {
    await supabase.storage.from('memorials').remove([path]);
  }

  revalidatePath(`/memorial/${memorialId}`);
}

export async function updateMemorialDates(memorialId: string, birthDate: string, deathDate: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('memorials')
    .update({ 
      birth_date: birthDate || null, 
      death_date: deathDate || null 
    })
    .eq('id', memorialId);

  if (error) throw error;
  revalidatePath(`/memorial/${memorialId}`);
}

export async function togglePersonaPublic(personaId: string, isPublic: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ai_personas')
    .update({ is_public: isPublic })
    .eq('id', personaId);

  if (error) throw error;
  revalidatePath('/dashboard');
  revalidatePath('/public');
}

export async function approveTribute(memorialId: string, messageId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('memorial_messages')
    .update({ is_approved: true })
    .eq('id', messageId);

  if (error) throw error;
  revalidatePath(`/memorial/${memorialId}`);
}
