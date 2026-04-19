'use client';
import { useRouter } from 'next/navigation';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sale } from '@/types';
import { formatPKR, formatDate } from '@/lib/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SalesList({ initialSales }: { initialSales: Sale[] }) {
  const router = useRouter();

  const handleDownloadCSV = () => {
    const salesData = initialSales || [];

    // Define CSV headers
    const headers = ['Sale ID', 'Date', 'Customer Name', 'Customer Phone', 'Total Amount'];
    
    // Map data to CSV rows
    const csvData = salesData.map(sale => [
      sale.id,
      new Date(sale.created_at).toLocaleString(),
      `"${sale.customer_name || 'Walk-in Customer'}"`,
      sale.customer_phone || 'N/A',
      sale.total_amount
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-bg-surface border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">Sales Workflow</h2>
          <p className="text-text-secondary text-sm">View and manage all sales transactions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            onClick={handleDownloadCSV} 
            variant="outline" 
            className="border-accent-primary text-accent-primary hover:bg-accent-primary/10 transition-colors min-h-[44px]"
          >
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
          <Button onClick={() => router.push('/sales/new')} className="bg-accent-primary text-black hover:bg-accent-dim min-h-[44px]">
            <Plus className="mr-2 h-4 w-4" /> Record New Sale
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[100px] text-text-muted">Sale ID</TableHead>
              <TableHead className="text-text-muted">Date</TableHead>
              <TableHead className="text-text-muted">Customer Name</TableHead>
              <TableHead className="text-text-muted">Customer Phone</TableHead>
              <TableHead className="text-right text-text-muted">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSales.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="text-center h-48 text-text-muted">
                  No sales recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              initialSales.map((sale) => (
                <TableRow 
                  key={sale.id} 
                  className="border-border hover:bg-bg-hover cursor-pointer"
                  onClick={() => router.push(`/sales/${sale.id}`)}
                >
                  <TableCell className="font-mono text-xs">{sale.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-text-primary font-mono">{formatDate(sale.created_at)}</TableCell>
                  <TableCell className="text-text-primary">{sale.customer_name || 'Walk-in Customer'}</TableCell>
                  <TableCell className="text-text-secondary font-mono">{sale.customer_phone || 'N/A'}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-accent-primary">{formatPKR(sale.total_amount)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
