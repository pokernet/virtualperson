'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(userId: string, data: any) {
  const supabase = await createClient();
  
  // Security Check: Only xroot0@gmail.com can call this
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== 'xroot0@gmail.com') {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.full_name,
      account_status: data.account_status,
      max_openai_tokens: data.max_openai_tokens,
      max_anthropic_tokens: data.max_anthropic_tokens,
      max_local_tokens: data.max_local_tokens,
      openai_tokens: data.openai_tokens, // Allow manual adjustment
      anthropic_tokens: data.anthropic_tokens,
      local_tokens: data.local_tokens,
    })
    .eq('id', userId);

  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateSystemSettings(key: string, value: any) {
  const supabase = await createClient();
  
  // Security Check
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== 'xroot0@gmail.com') {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('system_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;
  
  revalidatePath('/admin/settings');
  return { success: true };
}
