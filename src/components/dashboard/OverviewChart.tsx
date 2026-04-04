'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OverviewChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-text-muted">No sales data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D35" vertical={false} />
        <XAxis dataKey="name" stroke="#8A8A93" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis 
          stroke="#8A8A93" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(val) => {
            if (val >= 1000000) return `Rs ${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `Rs ${(val / 1000).toFixed(1)}k`;
            return val;
          }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1E1E24', borderColor: '#2D2D35', borderRadius: '8px' }}
          itemStyle={{ color: '#39FF14' }}
          formatter={(value: any) => [`PKR ${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <Area type="monotone" dataKey="revenue" stroke="#39FF14" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
