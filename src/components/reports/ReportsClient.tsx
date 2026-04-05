'use client';
import { useState } from 'react';
import { formatDate } from '@/lib/formatters';
import { History, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LogRecord {
  id: string;
  product_id: string;
  changed_by: string | null;
  change_type: string;
  old_value: unknown;
  new_value: unknown;
  created_at: string;
  user_profiles?: { full_name: string };
  products?: { name: string; sku: string };
}

export default function ReportsClient({ initialLogs }: { initialLogs: LogRecord[] }) {
  const [logs] = useState<LogRecord[]>(initialLogs);

  const getActionTheme = (action: string) => {
    switch(action.toUpperCase()) {
      case 'CREATE': return { color: 'bg-accent-primary/20 text-accent-primary border-accent-primary/30', icon: <Activity size={12} className="mr-1" /> };
      case 'UPDATE': return { color: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: <History size={12} className="mr-1" /> };
      case 'ADJUST': return { color: 'bg-warning/20 text-warning border-warning/30', icon: <AlertTriangle size={12} className="mr-1" /> };
      case 'DELETE': return { color: 'bg-danger/20 text-danger border-danger/30', icon: <ShieldCheck size={12} className="mr-1" /> };
      default: return { color: 'bg-bg-elevated text-text-secondary border-border', icon: null };
    }
  };

  return (
    <div className="bg-bg-surface border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-heading font-bold text-text-primary">Audit Log & Reports</h2>
        <p className="text-text-secondary text-sm">System-wide immutable history of inventory adjustments and actions.</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-text-muted">Timestamp</TableHead>
              <TableHead className="text-text-muted">User</TableHead>
              <TableHead className="text-text-muted">Action Type</TableHead>
              <TableHead className="text-text-muted">Target Product</TableHead>
              <TableHead className="text-text-muted">Delta / Changes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="text-center h-48 text-text-muted">
                  No system logs generated yet.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const theme = getActionTheme(log.change_type);
                const oldVal = log.old_value as { quantity_in_stock?: number; selling_price?: number } | null;
                const newVal = log.new_value as { quantity_in_stock?: number; selling_price?: number } | null;
                
                // Format diffs directly inside table cell
                let diffText = 'Multiple fields modified';
                if (log.change_type === 'UPDATE' || log.change_type === 'ADJUST') {
                   // Usually quantity differences or pricing differences
                   try {
                     if (oldVal?.quantity_in_stock !== undefined && newVal?.quantity_in_stock !== undefined) {
                        diffText = `Qty: ${oldVal.quantity_in_stock} → ${newVal.quantity_in_stock}`;
                     } else if (oldVal?.selling_price !== newVal?.selling_price) {
                        diffText = `Price changed | See raw diffs for details.`;
                     }
                   } catch { /* Suppress */ }
                } else if (log.change_type === 'CREATE') {
                   diffText = 'Record Initialized';
                }

                return (
                  <TableRow key={log.id} className="border-border hover:bg-bg-hover">
                    <TableCell className="font-mono text-xs text-text-secondary whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-text-primary">
                      {log.user_profiles?.full_name || log.changed_by?.slice(0, 8) || 'SYSTEM'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center text-xs font-mono px-2 py-1 border rounded w-fit ${theme.color}`}>
                        {theme.icon} {log.change_type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-text-primary font-mono">
                      {log.products?.name ? `${log.products.sku} | ${log.products.name}` : log.product_id.slice(0,8)}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary font-mono">
                      {diffText}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
