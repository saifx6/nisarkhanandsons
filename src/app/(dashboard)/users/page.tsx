import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import UserManagementClient from '@/components/users/UserManagementClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  
  // Strict admin check
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch all user profiles
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-6">
      <UserManagementClient initialUsers={profiles || []} />
    </div>
  );
}
