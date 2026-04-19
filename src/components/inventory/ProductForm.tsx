'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createProductAction, updateProductAction } from '@/app/actions/inventory';

export default function ProductForm({ initialData, isAdmin }: { initialData?: Product, isAdmin: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Generating a random SKU if none
  const generateSKU = () => `NKS-${Math.floor(1000 + Math.random() * 9000)}`;

  const [formData, setFormData] = useState({
    sku: initialData?.sku || generateSKU(),
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    category: initialData?.category || 'Floor Tile',
    size: initialData?.size || '',
    finish: initialData?.finish || 'Matte',
    color: initialData?.color || '',
    unit: 'Box' as const,
    pieces_per_box: initialData?.pieces_per_box || 1,
    quantity_in_stock: initialData?.quantity_in_stock || 0,
    low_stock_threshold: initialData?.low_stock_threshold || 10,
    cost_price: initialData?.cost_price || 0,
    selling_price: initialData?.selling_price || 0,
    description: initialData?.description || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await updateProductAction(initialData.id, formData, initialData);
        toast({ title: "Product Updated", description: "The product details have been saved." });
      } else {
        await createProductAction(formData);
        toast({ title: "Product Added", description: `${formData.name} has been added to inventory.` });
      }
      
      router.push('/inventory');
      router.refresh();
      
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error saving product",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-bg-surface p-6 rounded-lg border border-border">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-text-secondary">SKU *</Label>
          <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-text-secondary">Product Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand" className="text-text-secondary">Brand *</Label>
          <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-text-secondary">Category *</Label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full h-10 px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary">
            <option value="Floor Tile">Floor Tile</option>
            <option value="Wall Tile">Wall Tile</option>
            <option value="Border Tile">Border Tile</option>
            <option value="Outdoor Tile">Outdoor Tile</option>
            <option value="Mosaic">Mosaic</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size" className="text-text-secondary">Tile Size * (e.g. 60x60 cm)</Label>
          <Input id="size" name="size" value={formData.size} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="finish" className="text-text-secondary">Finish *</Label>
          <select id="finish" name="finish" value={formData.finish} onChange={handleChange} required className="w-full h-10 px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary">
            <option value="Matte">Matte</option>
            <option value="Glossy">Glossy</option>
            <option value="Polished">Polished</option>
            <option value="Textured">Textured</option>
            <option value="Rustic">Rustic</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-text-secondary">Color</Label>
          <Input id="color" name="color" value={formData.color} onChange={handleChange} className="bg-bg-elevated border-border text-text-primary" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit" className="text-text-secondary">Unit of Measure *</Label>
          <select id="unit" name="unit" value={formData.unit} onChange={handleChange} required className="w-full h-10 px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary">
            <option value="Box">Box</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pieces_per_box" className="text-text-secondary">Pieces per Box *</Label>
          <Input id="pieces_per_box" name="pieces_per_box" type="number" min="1" list="pieces_suggestions" value={formData.pieces_per_box} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary font-mono" />
          <datalist id="pieces_suggestions">
            <option value="6"></option>
            <option value="8"></option>
            <option value="10"></option>
            <option value="12"></option>
            <option value="16"></option>
            <option value="18"></option>
            <option value="24"></option>
          </datalist>
        </div>
      </div>

      <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="quantity_in_stock" className="text-text-secondary">Quantity in Stock *</Label>
          <Input id="quantity_in_stock" name="quantity_in_stock" type="number" min="0" value={formData.quantity_in_stock} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary font-mono" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="low_stock_threshold" className="text-text-secondary">Low Stock Threshold *</Label>
          <Input id="low_stock_threshold" name="low_stock_threshold" type="number" min="0" value={formData.low_stock_threshold} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary font-mono" />
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <Label htmlFor="cost_price" className="text-warning">Cost Price (PKR) *</Label>
            <Input id="cost_price" name="cost_price" type="number" min="0" value={formData.cost_price} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary font-mono" />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="selling_price" className="text-accent-primary">Selling Price (PKR) *</Label>
          <Input id="selling_price" name="selling_price" type="number" min="0" value={formData.selling_price} onChange={handleChange} required className="bg-bg-elevated border-border text-text-primary font-mono" />
        </div>
      </div>

      <div className="space-y-2 border-t border-border pt-6">
        <Label htmlFor="description" className="text-text-secondary">Description / Notes</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="bg-bg-elevated border-border text-text-primary min-h-[100px]" />
      </div>

      <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-border">
        <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover min-h-[44px]">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-accent-primary text-black hover:bg-accent-dim min-h-[44px]">
          {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>

    </form>
  )
}
