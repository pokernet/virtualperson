'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function deletePersona(personaId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('ai_personas')
    .delete()
    .eq('id', personaId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting persona:', error)
    return { error: 'Failed to delete persona' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
