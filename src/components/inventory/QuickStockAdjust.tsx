'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { adjustStockAction } from '@/app/actions/inventory';

export default function QuickStockAdjust({ productId, currentStock }: { productId: string, currentStock: number }) {
  const [val, setVal] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAdjust = async (type: 'add' | 'subtract') => {
    const amount = parseInt(val);
    if (!amount || amount <= 0) return;
    
    setLoading(true);
    const newStock = type === 'add' ? currentStock + amount : Math.max(0, currentStock - amount);
    
    try {
      await adjustStockAction(productId, newStock, currentStock);
      
      toast({ title: 'Stock Updated', description: `New stock level is ${newStock}` });
      setVal('');
      router.refresh();
    } catch(err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text-secondary">Quick Adjust</p>
      <div className="flex items-center gap-2">
        <Input 
          type="number" 
          value={val} 
          min="1"
          onChange={(e) => setVal(e.target.value)} 
          placeholder="Qty" 
          className="w-20 bg-bg-elevated border-border text-text-primary text-center font-mono"
        />
        <Button size="sm" onClick={() => handleAdjust('subtract')} disabled={loading || !val} className="px-3 bg-bg-elevated text-text-primary border border-border hover:bg-danger hover:border-danger transition-colors font-mono hover:text-white">-</Button>
        <Button size="sm" onClick={() => handleAdjust('add')} disabled={loading || !val} className="px-3 bg-bg-elevated text-text-primary border border-border hover:bg-success hover:border-success transition-colors font-mono hover:text-black">+</Button>
      </div>
    </div>
  )
}
