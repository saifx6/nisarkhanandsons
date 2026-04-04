'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Users, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUI } from '@/context/ui-context';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
  { name: 'Inventory', href: '/inventory', icon: Package, roles: ['admin', 'staff'] },
  { name: 'Sales', href: '/sales', icon: ShoppingCart, roles: ['admin', 'staff'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
];

function SidebarContent({ collapsed = false, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col h-full pt-6 pb-4">
      {/* Header row */}
      <div className={`mb-8 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
        {!collapsed && (
          <h1 className="font-heading font-bold text-base tracking-wide text-accent-primary uppercase leading-tight">
            NK <span className="text-text-primary">&</span> Sons
          </h1>
        )}
        {collapsed && (
          <span className="text-accent-primary font-bold text-xl font-heading">NK</span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-bg-hover"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (profile && !item.roles.includes(profile.role)) return null;
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 rounded-md transition-colors min-h-[44px] ${
                collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
              } ${
                isActive
                  ? 'bg-accent-glow text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <Icon size={20} className={`shrink-0 ${isActive ? 'text-accent-primary' : 'text-text-muted'}`} />
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 mt-6">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`flex w-full items-center gap-3 py-2 text-danger hover:bg-bg-hover rounded-md transition-colors min-h-[44px] ${
            collapsed ? 'justify-center px-2' : 'px-3'
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUI();

  return (
    <>
      {/* 
        Desktop (xl 1280px+): Full 240px sidebar, always visible
        Laptop (lg 1024-1279px): 64px collapsed icon rail, always visible
        Tablet/Mobile (<lg): Hidden static sidebar, handled by overlay below
      */}

      {/* Icon-Rail: laptop only (lg to xl) */}
      <aside className="hidden lg:flex xl:hidden w-16 bg-bg-surface border-r border-border flex-col shrink-0">
        <SidebarContent collapsed={true} />
      </aside>

      {/* Full sidebar: desktop xl+ */}
      <aside className="hidden xl:flex w-64 bg-bg-surface border-r border-border flex-col shrink-0">
        <SidebarContent collapsed={false} />
      </aside>

      {/* Overlay: tablet + mobile (below lg) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-bg-surface border-r border-border shadow-2xl transition-transform duration-300 ease-in-out lg:hidden`}
        style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <SidebarContent collapsed={false} onClose={closeSidebar} />
      </aside>
    </>
  );
}
