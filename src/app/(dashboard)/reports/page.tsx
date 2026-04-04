import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ReportsClient from '@/components/reports/ReportsClient';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch all audit logs
  // Supabase automatically maps referenced IDs if relationships exist.
  // We try mapped relational queries. If it fails due to exact naming, we fallback.
  const { data: logs, error } = await supabase
    .from('product_logs')
    .select(`
      *,
      user_profiles:changed_by (full_name),
      products:product_id (name, sku)
    `)
    .order('created_at', { ascending: false });

  // If strict relationship fails, grab basic
  const finalLogs = error ? await supabase.from('product_logs').select('*').order('created_at', { ascending: false }).then(r => r.data) : logs;

  return (
    <div className="space-y-6">
      <ReportsClient initialLogs={finalLogs || []} />
    </div>
  );
}
