import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/inventory/ProductForm';

export const dynamic = 'force-dynamic';

export default async function AddProductPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/dashboard'); // or a proper unauthorized page

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-heading font-bold text-text-primary">Add New Product</h2>
        <p className="text-sm text-text-secondary">Enter tile details to add to inventory.</p>
      </div>
      <ProductForm isAdmin={true} />
    </div>
  );
}
