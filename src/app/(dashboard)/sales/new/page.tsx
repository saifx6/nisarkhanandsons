import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import SalesWizard from '@/components/sales/SalesWizard';

export const dynamic = 'force-dynamic';

export default async function NewSalePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  const isAdmin = profile?.role === 'admin';
  const tableSource = isAdmin ? 'products' : 'products_public';
  
  // Only grab products that are active and have stock
  const { data: products } = await supabase
    .from(tableSource)
    .select('*')
    .eq('is_active', true)
    .gt('quantity_in_stock', 0)
    .order('name');
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-heading font-bold text-text-primary">Record New Sale</h2>
        <p className="text-sm text-text-secondary">Process a customer order. Stock will be automatically deducted.</p>
      </div>
      <SalesWizard products={products || []} />
    </div>
  );
}
