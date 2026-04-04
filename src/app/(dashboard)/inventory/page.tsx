import { createClient } from '@/lib/supabase-server';
import InventoryClient from '@/components/inventory/InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile, error: profileErr } = await supabase.from('user_profiles').select('role').eq('id', user?.id).single();
  
  const isAdmin = profile?.role === 'admin';
  const tableSource = isAdmin ? 'products' : 'products_public';
  
  const { data: products, error: prodErr } = await supabase
    .from(tableSource)
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <InventoryClient initialProducts={products || []} isAdmin={isAdmin} />
    </div>
  );
}
