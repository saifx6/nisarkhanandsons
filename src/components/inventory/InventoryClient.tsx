'use client';
import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPKR } from '@/lib/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function InventoryClient({ initialProducts, isAdmin }: { initialProducts: Product[], isAdmin: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.color?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = categoryFilter ? p.category === categoryFilter : true;
      
      let matchStock = true;
      if (stockFilter === 'in') matchStock = p.quantity_in_stock > p.low_stock_threshold;
      if (stockFilter === 'low') matchStock = p.quantity_in_stock > 0 && p.quantity_in_stock <= p.low_stock_threshold;
      if (stockFilter === 'out') matchStock = p.quantity_in_stock === 0;

      return matchSearch && matchCat && matchStock;
    });
  }, [initialProducts, searchTerm, categoryFilter, stockFilter]);

  return (
    <div className="bg-bg-surface border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">Inventory Hub</h2>
          <p className="text-text-secondary text-sm">Manage products and stock levels.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => router.push('/inventory/add')} className="bg-accent-primary text-black hover:bg-accent-dim min-h-[44px] w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        )}
      </div>
      
      <div className="p-4 flex flex-col gap-3 bg-bg-elevated/50">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <Input 
            placeholder="Search by SKU, name, brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full bg-bg-surface border-border text-text-primary focus-visible:ring-accent-primary min-h-[44px]"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 min-h-[44px] px-3 py-2 bg-bg-surface border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
          >
            <option value="">All Categories</option>
            <option value="Floor Tile">Floor Tile</option>
            <option value="Wall Tile">Wall Tile</option>
            <option value="Border Tile">Border Tile</option>
            <option value="Outdoor Tile">Outdoor Tile</option>
            <option value="Mosaic">Mosaic</option>
          </select>

          <select 
            value={stockFilter} 
            onChange={(e) => setStockFilter(e.target.value)}
            className="flex-1 min-h-[44px] px-3 py-2 bg-bg-surface border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
          >
            <option value="">All Stock Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[100px] text-text-muted">SKU</TableHead>
              <TableHead className="text-text-muted">Name & Details</TableHead>
              <TableHead className="text-text-muted">Category</TableHead>
              <TableHead className="text-text-muted">Stock</TableHead>
              <TableHead className="text-right text-text-muted">Selling Price</TableHead>
              <TableHead className="w-[100px] text-right text-text-muted">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={6} className="text-center h-48 text-text-muted">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => {
                let statusBadge = <Badge className="bg-success text-black border-none pointer-events-none hover:bg-success">In Stock</Badge>;
                if (p.quantity_in_stock === 0) statusBadge = <Badge className="bg-danger text-text-primary border-none pointer-events-none hover:bg-danger">Out of Stock</Badge>;
                else if (p.quantity_in_stock <= p.low_stock_threshold) statusBadge = <Badge className="bg-warning text-black border-none pointer-events-none hover:bg-warning">Low Stock</Badge>;

                return (
                  <TableRow 
                    key={p.id} 
                    className="border-border hover:bg-bg-hover cursor-pointer"
                    onClick={() => router.push(`/inventory/${p.id}`)}
                  >
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell>
                      <div className="font-medium text-text-primary">{p.name}</div>
                      <div className="text-xs text-text-secondary mt-1">{p.brand} &bull; {p.size} &bull; {p.finish} &bull; {p.color}</div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{p.category}</TableCell>
                    <TableCell className="font-mono text-sm">{p.quantity_in_stock} {p.unit}</TableCell>
                    <TableCell className="text-right font-mono text-accent-primary">{formatPKR(p.selling_price)}</TableCell>
                    <TableCell className="text-right">{statusBadge}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
