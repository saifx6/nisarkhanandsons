import { createClient } from '@/lib/supabase-server';
import SalesList from '@/components/sales/SalesList';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const supabase = createClient();
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <SalesList initialSales={sales || []} />
    </div>
  );
}
