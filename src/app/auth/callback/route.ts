import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  console.log('Auth Callback Triggered:', { origin, next: searchParams.get('next') });

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const next = searchParams.get('next') || '/dashboard'
      console.log('Auth Successful, Redirecting to:', `${origin}${next}`);
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Auth Callback Error:', error.message);
    }
  }

  // return the user to an error page with instructions
  console.log('Auth Failed, Redirecting to Login');
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
