'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ShoppingCart, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPKR } from '@/lib/formatters';
import { createSaleAction } from '@/app/actions/sales';

interface LineItem {
  tempId: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  selected_product?: Product;
}

export default function SalesWizard({ products }: { products: Product[] }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [items, setItems] = useState<LineItem[]>([
    { tempId: crypto.randomUUID(), product_id: '', quantity: 1, unit_price: 0 }
  ]);

  const addLineItem = () => {
    setItems([...items, { tempId: crypto.randomUUID(), product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeLineItem = (tempId: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.tempId !== tempId));
    }
  };

  const updateLineItem = (tempId: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.tempId !== tempId) return item;
      
      const updated = { ...item, [field]: value };
      
      // Auto-fill price if product changes
      if (field === 'product_id') {
        const prod = products.find(p => p.id === value);
        if (prod) {
          updated.selected_product = prod;
          updated.unit_price = prod.selling_price;
          // default quantity remains to what they typed or 1, but we enforce max later
        } else {
          updated.selected_product = undefined;
          updated.unit_price = 0;
        }
      }
      return updated;
    }));
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validItems = items.filter(i => i.product_id && i.quantity > 0 && i.unit_price > 0);
    if (validItems.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please add at least one valid product.' });
      return;
    }

    for (const item of validItems) {
      if (item.selected_product && item.quantity > item.selected_product.quantity_in_stock) {
        toast({ 
          variant: 'destructive', 
          title: 'Stock Error', 
          description: `Insufficient stock for ${item.selected_product.name}. Max available is ${item.selected_product.quantity_in_stock}`
        });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        p_customer_name: customerName || null,
        p_customer_phone: customerPhone || null,
        p_items: validItems.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price: i.unit_price
        }))
      };

      await createSaleAction(payload);
      
      toast({ title: 'Sale Successfully Recorded!', description: `Transaction recorded securely.` });
      router.push('/sales');
      router.refresh();

    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Transaction Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Info Section */}
      <div className="bg-bg-surface p-6 border border-border rounded-lg space-y-4">
        <h3 className="text-lg font-heading font-medium text-text-primary flex items-center gap-2">
          <User size={18} className="text-accent-primary" /> Customer Info (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-text-secondary">Customer Name</Label>
            <Input 
              id="customerName" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              placeholder="e.g. John Doe"
              className="bg-bg-elevated border-border text-text-primary focus-visible:ring-accent-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-text-secondary">Phone Number</Label>
            <Input 
              id="customerPhone" 
              value={customerPhone} 
              onChange={(e) => setCustomerPhone(e.target.value)} 
              placeholder="e.g. 0300 1234567"
              className="bg-bg-elevated border-border text-text-primary focus-visible:ring-accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="bg-bg-surface p-6 border border-border rounded-lg space-y-4">
        <h3 className="text-lg font-heading font-medium text-text-primary flex items-center gap-2">
          <ShoppingCart size={18} className="text-accent-primary" /> Line Items
        </h3>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.tempId} className="flex flex-col md:flex-row gap-4 items-start md:items-end pb-4 border-b border-border/50">
              <div className="flex-1 w-full space-y-2">
                <Label className="text-text-secondary">Product</Label>
                <select 
                  value={item.product_id}
                  onChange={(e) => updateLineItem(item.tempId, 'product_id', e.target.value)}
                  className="w-full h-10 px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name} ({p.size}) | In Stock: {p.quantity_in_stock}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-24 space-y-2">
                <Label className="text-text-secondary">Qty</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.tempId, 'quantity', parseInt(e.target.value) || 0)}
                  className="bg-bg-elevated border-border text-text-primary font-mono text-center focus-visible:ring-accent-primary"
                  required
                />
              </div>

              <div className="w-full md:w-40 space-y-2">
                <Label className="text-text-secondary">Unit Price (PKR)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(item.tempId, 'unit_price', parseFloat(e.target.value) || 0)}
                  className="bg-bg-elevated border-border text-text-primary font-mono text-right focus-visible:ring-accent-primary"
                  required
                />
              </div>
              
              <div className="w-full md:w-auto h-10 flex items-center justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => removeLineItem(item.tempId)}
                  disabled={items.length === 1}
                  className="border-danger/50 text-danger hover:bg-danger hover:text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={addLineItem} 
          className="w-full border-dashed border-border text-text-primary hover:bg-bg-hover hover:text-accent-primary"
        >
          <Plus size={16} className="mr-2" /> Add Another Item
        </Button>
      </div>

      {/* Checkout Summary */}
      <div className="bg-bg-elevated p-6 border border-border rounded-lg flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_20px_rgba(30,30,35,0.7)]">
        <div>
          <p className="text-text-secondary text-sm">Total Amount</p>
          <p className="text-4xl font-mono font-bold text-accent-primary">{formatPKR(totalAmount)}</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={loading}
            className="w-full md:w-auto border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-accent-primary text-black font-bold tracking-wide hover:bg-accent-dim hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
          >
            {loading ? 'PROCESSING...' : 'COMPLETE SALE'}
          </Button>
        </div>
      </div>

    </form>
  )
}
