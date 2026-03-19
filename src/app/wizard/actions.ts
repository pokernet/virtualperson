'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createPersona(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const id = formData.get('id') as string | null
  try {
    const name = formData.get('name') as string
    const relationship = formData.get('relationship') as string
    const traits = formData.get('traits') as string
    const catchphrases = formData.get('catchphrases') as string
    const memories = formData.get('memories') as string
    const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
    const sex = formData.get('sex') as string | null
    
    const avatarFile = formData.get('avatar') as File | null
    let avatarUrl = formData.get('existing_avatar_url') as string | null

    // Handle avatar upload if a new file is provided
    if (avatarFile && avatarFile.size > 0 && typeof avatarFile !== 'string') {
        try {
            const fileExt = avatarFile.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile)

            if (uploadError) {
                console.error('Error uploading avatar:', uploadError)
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath)
                avatarUrl = publicUrl
            }
        } catch (uploadCatch) {
            console.error('Catch error in upload:', uploadCatch)
        }
    }

    // Construct the core AI Identity (System Prompt)
    const systemPrompt = `
You are an AI embodiment of a person named ${name}. 
${age ? `You are ${age} years old.` : ''}
${sex ? `Your biological sex/gender is ${sex}.` : ''}
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

    let result;
    if (id) {
        // UPDATE
        result = await supabase
        .from('ai_personas')
        .update({
            name,
            relationship,
            traits,
            catchphrases,
            memories,
            system_prompt: systemPrompt,
            avatar_url: avatarUrl,
            age,
            sex
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
    } else {
        // INSERT
        result = await supabase
        .from('ai_personas')
        .insert([
            {
            user_id: user.id,
            name,
            relationship,
            traits,
            catchphrases,
            memories,
            system_prompt: systemPrompt,
            avatar_url: avatarUrl,
            age,
            sex
            }
        ])
        .select()
        .single()
    }

    const { data: persona, error } = result

    if (error) {
        console.error('Error processing persona:', error)
        redirect(`/wizard${id ? `?id=${id}` : ''}&error=Failed processing`)
    }

    // Redirect to the chat
    redirect(`/chat/${persona.id}`)
  } catch (outerError: any) {
    if (outerError?.digest?.includes('NEXT_REDIRECT')) {
        throw outerError; // re-throw intentional redirects
    }
    console.error('Critical error in createPersona:', outerError)
    redirect(`/wizard${id ? `?id=${id}` : ''}&error=Internal Error`)
  }
}


