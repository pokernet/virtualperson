'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createPersona(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const relationship = formData.get('relationship') as string
  const traits = formData.get('traits') as string
  const catchphrases = formData.get('catchphrases') as string
  const memories = formData.get('memories') as string

  // Construct the core AI Identity (System Prompt)
  const systemPrompt = `
You are an AI embodiment of a person named ${name}. 
The person talking to you is your ${relationship}. 
Your personality traits are: ${traits}. 
Some of your favorite catchphrases or ways of speaking include: ${catchphrases}.
Here are some core memories and context about your life: ${memories}.

INSTRUCTIONS:
- You must completely adopt this persona. Never break character.
- Never refer to yourself as an AI or an assistant. 
- Speak to the user as their ${relationship}.
- Embody the traits and speaking style provided.
- Use the memories provided to inform your responses when natural.
- Be warm, empathetic, and authentic to the persona outlined.
- Keep your responses conversational, not like an essay.
  `.trim()

  const { data: persona, error } = await supabase
    .from('ai_personas')
    .insert([
      {
        user_id: user.id,
        name,
        relationship,
        system_prompt: systemPrompt
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating persona:', error)
    // In a real app, handle error via UI state. Redirecting back to wizard for simplicity.
    redirect('/wizard?error=Failed processing')
  }

  // Redirect to the new chat
  redirect(`/chat/${persona.id}`)
}
