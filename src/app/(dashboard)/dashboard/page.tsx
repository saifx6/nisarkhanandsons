import { createClient } from '@/lib/supabase-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPKR } from '@/lib/formatters';
import { Banknote, TrendingUp, AlertCircle, Package } from 'lucide-react';
import OverviewChart from '@/components/dashboard/OverviewChart';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [salesReq, productsReq] = await Promise.all([
    supabase.from('sales').select('total_amount, created_at'),
    supabase.from('products_public').select('quantity_in_stock, low_stock_threshold').eq('is_active', true)
  ]);

  const sales = salesReq.data || [];
  const products = productsReq.data || [];

  const monthlySales = sales.filter(s => new Date(s.created_at) >= startOfMonth);
  const monthlyRevenue = monthlySales.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const totalSalesCount = monthlySales.length;

  const lowStockCount = products.filter(p => p.quantity_in_stock <= p.low_stock_threshold && p.quantity_in_stock > 0).length;
  const outOfStockCount = products.filter(p => p.quantity_in_stock === 0).length;

  // Chart data for last 7 days
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayStart = new Date(d.setHours(0,0,0,0)).getTime();
    const dayEnd = new Date(d.setHours(23,59,59,999)).getTime();
    
    const daySales = sales.filter(s => {
      const t = new Date(s.created_at).getTime();
      return t >= dayStart && t <= dayEnd;
    });
    
    chartData.push({
      name: dayName,
      revenue: daySales.reduce((sum, s) => sum + Number(s.total_amount), 0)
    });
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">Operational Overview</h2>
        <p className="text-text-secondary text-sm mt-1">Summary and metrics for Nisar Khan &amp; Sons.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-text-secondary">Monthly Revenue</CardTitle>
            <Banknote className="w-4 h-4 text-accent-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-text-primary">{formatPKR(monthlyRevenue)}</div>
            <p className="text-xs text-text-muted mt-1">+20% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-text-secondary">Sales Count (Month)</CardTitle>
            <TrendingUp className="w-4 h-4 text-accent-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-text-primary">+{totalSalesCount}</div>
            <p className="text-xs text-text-muted mt-1">Invoices generated</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-warning">Low Stock Alerts</CardTitle>
            <AlertCircle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-text-primary">{lowStockCount}</div>
            <p className="text-xs text-text-muted mt-1">Items nearing depletion</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border-danger/50 shadow-sm shadow-danger/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-danger">Out of Stock</CardTitle>
            <Package className="w-4 h-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-danger">{outOfStockCount}</div>
            <p className="text-xs text-text-muted mt-1">Items requiring immediate restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-5 bg-bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-text-primary">Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2 bg-bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/sales/new" className="block p-4 border border-border rounded-lg bg-bg-hover hover:bg-bg-elevated transition-colors cursor-pointer group">
              <h4 className="font-heading font-medium text-text-primary group-hover:text-accent-primary transition-colors">Record New Sale</h4>
              <p className="text-sm text-text-secondary mt-1">Initiate the checkout workflow for a customer.</p>
            </Link>
            <Link href="/inventory/add" className="block p-4 border border-border rounded-lg bg-bg-hover hover:bg-bg-elevated transition-colors cursor-pointer group">
              <h4 className="font-heading font-medium text-text-primary group-hover:text-accent-primary transition-colors">Add New Product</h4>
              <p className="text-sm text-text-secondary mt-1">Expand catalog with new inventory arrivals.</p>
            </Link>
            <Link href="/inventory" className="block p-4 border border-danger/20 rounded-lg bg-danger/5 cursor-pointer">
              <h4 className="font-heading font-medium text-danger">Review Critical Stock</h4>
              <p className="text-sm text-text-secondary mt-1">View {outOfStockCount} items currently out of stock.</p>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
