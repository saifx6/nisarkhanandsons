import { createClient } from './supabase-server';

export async function requireAuth() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  return user;
}

export async function requireAdmin() {
  const supabase = createClient();
  const user = await requireAuth();
  
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return { user, profile };
}
