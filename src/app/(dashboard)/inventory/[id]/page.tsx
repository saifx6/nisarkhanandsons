import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/inventory/ProductForm';
import { ProductLog } from '@/types';
import { formatPKR, formatDate } from '@/lib/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import QuickStockAdjust from '@/components/inventory/QuickStockAdjust';
import DeleteProductButton from '@/components/inventory/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  const isAdmin = profile?.role === 'admin';
  
  const { data: product } = await supabase
    .from(isAdmin ? 'products' : 'products_public')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    return <div className="text-danger p-6 font-bold">Product not found.</div>;
  }

  const { data: logs } = await supabase
    .from('product_logs')
    .select('*, user_profiles(full_name)')
    .eq('product_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-heading font-bold text-text-primary">{product.name}</h2>
            {!product.is_active && <Badge variant="outline" className="text-danger border-danger">Deactivated</Badge>}
          </div>
          <p className="text-sm text-text-secondary font-mono">{product.sku} &bull; {product.brand || 'Unbranded'}</p>
        </div>
        <div className="text-right">
          <p className="text-accent-primary font-mono text-xl font-bold">{formatPKR(product.selling_price)}</p>
          <p className="text-sm text-text-secondary">per {product.unit}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border border-border bg-bg-surface p-6 rounded-lg space-y-6">
          <div>
            <p className="text-sm text-text-secondary mb-1">Current Stock</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono font-bold text-text-primary">{product.quantity_in_stock}</span>
              <span className="text-text-muted text-sm pb-1">{product.unit}s</span>
            </div>
          </div>
          
          {isAdmin && (
            <div className="pt-4 border-t border-border space-y-3">
              <QuickStockAdjust productId={product.id} currentStock={product.quantity_in_stock} />
              <div className="pt-2">
                <DeleteProductButton
                  productId={product.id}
                  productName={product.name}
                  isActive={product.is_active}
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Category</span>
              <span className="text-text-primary font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Size</span>
              <span className="text-text-primary font-medium">{product.size}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Finish</span>
              <span className="text-text-primary font-medium">{product.finish}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Color</span>
              <span className="text-text-primary font-medium">{product.color || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          {isAdmin ? (
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="bg-bg-elevated border-border mb-4">
                <TabsTrigger value="edit" className="data-[state=active]:bg-bg-hover data-[state=active]:text-accent-primary">Edit Details</TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-bg-hover data-[state=active]:text-accent-primary">Change History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit">
                <ProductForm initialData={product} isAdmin={isAdmin} />
              </TabsContent>
              
              <TabsContent value="logs">
                <div className="bg-bg-surface border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-heading font-medium text-lg text-text-primary mb-4">Edit Log</h3>
                  {logs && logs.length > 0 ? (
                    <div className="space-y-4">
                      {logs.map((log: ProductLog) => (
                        <div key={log.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-text-primary">{log.user_profiles?.full_name || 'Unknown User'}</span>
                            <span className="text-text-muted font-mono">{formatDate(log.created_at)}</span>
                          </div>
                          <p className="text-xs text-text-secondary capitalize">Action: <span className="text-accent-primary font-mono">{log.change_type}</span></p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm">No changes recorded yet.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-bg-surface border border-border p-6 rounded-lg text-text-secondary">
              <h3 className="font-heading font-medium text-lg text-text-primary mb-2">Description</h3>
              <p className="text-sm whitespace-pre-wrap">{product.description || 'No description provided.'}</p>
              
              <div className="mt-8 p-4 bg-bg-elevated border border-border rounded text-sm">
                <p>You have read-only access to inventory as a Staff member.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
