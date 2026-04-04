'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Menu } from 'lucide-react';
import { useUI } from '@/context/ui-context';

export function BottomNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useUI();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Inventory', icon: Package, href: '/inventory' },
    { label: 'Sales', icon: ShoppingCart, href: '/sales' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-bg-surface md:hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 ${
              isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-[10px] sm:text-xs font-heading">{item.label}</span>
          </Link>
        );
      })}
      
      {/* More Button triggers Sidebar overlay on Mobile */}
      <button
        onClick={toggleSidebar}
        className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 text-text-secondary hover:text-text-primary"
      >
        <Menu size={20} className="mb-1" />
        <span className="text-[10px] sm:text-xs font-heading">More</span>
      </button>
    </nav>
  );
}
