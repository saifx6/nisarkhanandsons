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
  boxes: number;
  pieces: number;
  selected_product?: Product;
}

function formatQtyDisplay(quantity: number, piecesPerBox: number): string {
  const boxes = Math.floor(quantity / piecesPerBox);
  const remainderPieces = quantity % piecesPerBox;
  if (boxes > 0 && remainderPieces > 0) return `${boxes} Boxes + ${remainderPieces} Pieces`;
  if (boxes > 0) return `${boxes} Boxes`;
  return `${remainderPieces} Pieces`;
}

export default function SalesWizard({ products }: { products: Product[] }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [items, setItems] = useState<LineItem[]>([
    { tempId: crypto.randomUUID(), product_id: '', boxes: 0, pieces: 0 }
  ]);

  const addLineItem = () => {
    setItems([...items, { tempId: crypto.randomUUID(), product_id: '', boxes: 0, pieces: 0 }]);
  };

  const removeLineItem = (tempId: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.tempId !== tempId));
    }
  };

  const updateProduct = (tempId: string, productId: string) => {
    setItems(items.map(item => {
      if (item.tempId !== tempId) return item;
      const prod = products.find(p => p.id === productId);
      return {
        ...item,
        product_id: productId,
        selected_product: prod,
        boxes: 0,
        pieces: 0,
      };
    }));
  };

  const updateBoxes = (tempId: string, value: number) => {
    setItems(items.map(item => {
      if (item.tempId !== tempId) return item;
      return { ...item, boxes: isNaN(value) || value < 0 ? 0 : Math.floor(value) };
    }));
  };

  const updatePieces = (tempId: string, value: number, maxPieces: number) => {
    setItems(items.map(item => {
      if (item.tempId !== tempId) return item;
      const clamped = isNaN(value) || value < 0 ? 0 : Math.min(Math.floor(value), maxPieces);
      return { ...item, pieces: clamped };
    }));
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item.selected_product) return sum;
      const ppb = item.selected_product.pieces_per_box;
      const pricePerPiece = item.selected_product.selling_price / ppb;
      const totalPieces = item.boxes * ppb + item.pieces;
      return sum + totalPieces * pricePerPiece;
    }, 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter(i => i.product_id && (i.boxes > 0 || i.pieces > 0) && i.selected_product);
    if (validItems.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please add at least one product with a quantity greater than 0.' });
      return;
    }

    for (const item of validItems) {
      if (!item.selected_product) continue;
      const ppb = item.selected_product.pieces_per_box;
      const totalPieces = item.boxes * ppb + item.pieces;
      const boxesNeeded = Math.ceil(totalPieces / ppb);
      if (boxesNeeded > item.selected_product.quantity_in_stock) {
        toast({ 
          variant: 'destructive', 
          title: 'Stock Error', 
          description: `Insufficient stock for ${item.selected_product.name}. Max available is ${item.selected_product.quantity_in_stock} boxes.`
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
          boxes: i.boxes,
          pieces: i.pieces,
          pieces_per_box: i.selected_product!.pieces_per_box,
          selling_price: i.selected_product!.selling_price,
        }))
      };

      await createSaleAction(payload);
      
      toast({ title: 'Sale Successfully Recorded!', description: `Transaction recorded securely.` });
      router.push('/sales');
      router.refresh();

    } catch (err) {
      toast({ variant: 'destructive', title: 'Transaction Failed', description: (err as Error).message });
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
        
        <div className="space-y-6">
          {items.map((item) => {
            const prod = item.selected_product;
            const ppb = prod?.pieces_per_box ?? 1;
            const maxPieces = ppb - 1;
            const pricePerPiece = prod ? prod.selling_price / ppb : 0;
            const totalPieces = item.boxes * ppb + item.pieces;
            const lineSubtotal = totalPieces * pricePerPiece;

            return (
              <div key={item.tempId} className="flex flex-col gap-4 pb-4 border-b border-border/50">
                {/* Product selector */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                  <div className="flex-1 w-full space-y-2">
                    <Label className="text-text-secondary">Product</Label>
                    <select 
                      value={item.product_id}
                      onChange={(e) => updateProduct(item.tempId, e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      required
                    >
                      <option value="">Select a product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.sku} - {p.name} ({p.size}) - {p.pieces_per_box} pcs/box | In Stock: {p.quantity_in_stock}
                        </option>
                      ))}
                    </select>
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

                {/* Quantity inputs row */}
                {prod && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    {/* Boxes input */}
                    <div className="space-y-2">
                      <Label className="text-text-secondary text-xs">Boxes</Label>
                      <Input 
                        type="number" 
                        min="0"
                        step="1"
                        value={item.boxes}
                        onChange={(e) => updateBoxes(item.tempId, parseInt(e.target.value))}
                        className="bg-bg-elevated border-border text-text-primary font-mono text-center focus-visible:ring-accent-primary"
                      />
                      <p className="text-xs text-text-muted">{formatPKR(prod.selling_price)}/box</p>
                    </div>

                    {/* Pieces input */}
                    <div className="space-y-2">
                      <Label className="text-text-secondary text-xs">Pieces (0–{maxPieces})</Label>
                      <Input 
                        type="number" 
                        min="0"
                        max={maxPieces}
                        step="1"
                        value={item.pieces}
                        onChange={(e) => updatePieces(item.tempId, parseInt(e.target.value), maxPieces)}
                        className="bg-bg-elevated border-border text-text-primary font-mono text-center focus-visible:ring-accent-primary"
                      />
                      <p className="text-xs text-text-muted">{formatPKR(pricePerPiece)}/pc</p>
                    </div>

                    {/* Total pieces (read-only) */}
                    <div className="space-y-2">
                      <Label className="text-text-secondary text-xs">Total Pieces</Label>
                      <div className="h-10 px-3 flex items-center bg-bg-elevated/50 border border-border/50 rounded-md font-mono text-text-primary text-sm">
                        {totalPieces}
                      </div>
                      <p className="text-xs text-text-muted">
                        {formatQtyDisplay(totalPieces, ppb)}
                      </p>
                    </div>

                    {/* Line subtotal (read-only) */}
                    <div className="space-y-2">
                      <Label className="text-text-secondary text-xs">Subtotal</Label>
                      <div className="h-10 px-3 flex items-center justify-end bg-bg-elevated/50 border border-border/50 rounded-md font-mono text-accent-primary text-sm font-medium">
                        {formatPKR(lineSubtotal)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
