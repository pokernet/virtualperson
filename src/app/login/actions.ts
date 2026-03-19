'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  
  if (error) {
    // We encode the URI component to ensure it's safely passed in the URL
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
        data: {
            full_name: formData.get('full_name') as string
        }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  // Get the base URL from headers for the redirect
  const { headers } = await import('next/headers')
  const host = (await headers()).get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const redirectTo = `${protocol}://${host}/auth/callback?next=/login/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    return redirect('/login/forgot-password?error=' + encodeURIComponent(error.message))
  }

  return redirect('/login/forgot-password?success=true')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return redirect('/login/reset-password?error=' + encodeURIComponent(error.message))
  }

  return redirect('/login?error=' + encodeURIComponent('Password updated successfully. You can now login.'))
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // Get the base URL from headers for the redirect
  const { headers } = await import('next/headers')
  const host = (await headers()).get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const redirectTo = `${protocol}://${host}/auth/callback?next=/dashboard`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    redirect(data.url)
  }
}
