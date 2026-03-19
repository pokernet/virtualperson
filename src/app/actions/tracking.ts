'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function trackVisitor() {
  try {
    const supabase = await createClient();
    
    // Call the RPC function to increment the visitor count safely
    const { error } = await supabase.rpc('increment_site_visitor');
    
    if (error) {
      console.error('Error tracking visitor:', error);
    }
  } catch (error) {
    console.error('Failed to execute trackVisitor:', error);
  }
}
