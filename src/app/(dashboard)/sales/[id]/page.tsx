import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { formatPKR, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import ReceiptButton from './ReceiptButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function SaleDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  
  const { data: sale } = await supabase
    .from('sales')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!sale) {
    return <div className="text-danger p-6 font-bold">Sale not found.</div>;
  }

  const { data: items } = await supabase
    .from('sale_items')
    .select('*, products(name)')
    .eq('sale_id', params.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div>
          <h2 className="text-3xl font-heading font-bold text-text-primary">Sale Details</h2>
          <p className="text-sm text-text-secondary font-mono">
            {sale.sale_number || sale.id} &bull; {formatDate(sale.created_at)}
          </p>
        </div>
        <div>
          <ReceiptButton sale={sale} items={items || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-surface p-6 border border-border rounded-lg space-y-4">
          <h3 className="font-heading font-medium text-lg text-text-primary border-b border-border pb-2">Customer Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Name</span>
              <span className="text-text-primary font-medium">{sale.customer_name || 'Walk-in Customer'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Phone</span>
              <span className="text-text-primary font-medium">{sale.customer_phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-bg-surface p-6 border border-border rounded-lg space-y-4">
          <h3 className="font-heading font-medium text-lg text-text-primary border-b border-border pb-2">Payment Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Status</span>
              <Badge variant="outline">{sale.payment_status || 'Paid'}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Method</span>
              <span className="text-text-primary font-medium">{sale.payment_method || 'Cash'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-medium text-lg text-text-primary">Line Items</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-text-muted">Product</TableHead>
                <TableHead className="text-right text-text-muted">Qty</TableHead>
                <TableHead className="text-right text-text-muted">Unit Price</TableHead>
                <TableHead className="text-right text-text-muted">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items && items.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="text-text-primary">{item.products?.name || 'Unknown'}</TableCell>
                  <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono">{formatPKR(item.unit_price)}</TableCell>
                  <TableCell className="text-right font-mono">{formatPKR(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-6 border-t border-border flex justify-end">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-mono text-text-primary">{formatPKR(sale.subtotal || sale.total_amount)}</span>
            </div>
            {(sale.discount > 0) && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Discount</span>
                <span className="font-mono text-text-primary">{formatPKR(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span className="text-text-primary">Total Amount</span>
              <span className="font-mono text-accent-primary">{formatPKR(sale.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Amount Paid</span>
              <span className="font-mono text-success">{formatPKR(sale.amount_paid || sale.total_amount)}</span>
            </div>
            {(sale.total_amount - (sale.amount_paid || sale.total_amount) > 0) && (
              <div className="flex justify-between text-sm text-danger font-medium">
                <span>Remaining Balance</span>
                <span className="font-mono">{formatPKR(sale.total_amount - (sale.amount_paid || sale.total_amount))}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
