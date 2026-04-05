'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  productId: string;
  productName: string;
  isActive: boolean;
}

import { deleteProductAction } from '@/app/actions/inventory';

export default function DeleteProductButton({ productId, productName, isActive }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await deleteProductAction(productId, isActive);

      toast({
        title: isActive ? 'Product Deactivated' : 'Product Restored',
        description: isActive
          ? `"${productName}" is now hidden from inventory.`
          : `"${productName}" is now active again.`,
      });
      router.refresh();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) {
    return (
      <Button
        onClick={handleToggle}
        disabled={loading}
        variant="outline"
        className="w-full border-accent-primary/50 text-accent-primary hover:bg-accent-primary hover:text-black"
      >
        <RotateCcw size={14} className="mr-2" />
        {loading ? 'Restoring...' : 'Restore Product'}
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-danger/50 text-danger hover:bg-danger hover:text-white"
        >
          <Trash2 size={14} className="mr-2" /> Deactivate Product
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-bg-surface border border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text-primary font-heading">Deactivate Product?</AlertDialogTitle>
          <AlertDialogDescription className="text-text-secondary">
            This will hide <span className="text-text-primary font-semibold">&quot;{productName}&quot;</span> from the active
            inventory. All historical sales data is preserved. You can restore it at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-bg-elevated border-border text-text-primary hover:bg-bg-hover">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggle}
            disabled={loading}
            className="bg-danger hover:bg-danger/80 text-white"
          >
            {loading ? 'Processing...' : 'Yes, Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
