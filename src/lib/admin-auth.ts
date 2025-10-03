
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const getServerSession = cache(async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return { isAuthenticated: false, user: null };
    }

    return { 
      isAuthenticated: true, 
      user: session.user,
      session 
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { isAuthenticated: false, user: null };
  }
});

export async function requireAuth() {
  const { isAuthenticated, user } = await getServerSession();
  
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function validateAdminAccess(requiredUid?: string) {
  const { isAuthenticated, user } = await getServerSession();
  
  if (!isAuthenticated) {
    return { hasAccess: false, reason: 'Not authenticated' };
  }
  
  // If a specific UID is required (from RLS policies), check it
  if (requiredUid && user?.id !== requiredUid) {
    return { hasAccess: false, reason: 'Insufficient permissions' };
  }
  
  return { hasAccess: true, user };
}
