'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUI } from '@/context/ui-context';

export function Topbar() {
  const { profile } = useAuth();
  const { toggleSidebar } = useUI();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      alert(`Global search for "${searchQuery}" is under construction. Please use the search within Inventory or Sales modules.`);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 relative z-40">
      {/* Left: Hamburger (tablet/mobile only) + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger – shown on tablet (md-lg) only; for mobile the BottomNav handles this */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-hover"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden sm:block w-full max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search inventory, sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-bg-elevated border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2 sm:gap-4 relative shrink-0">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-hover"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
        </button>

        {showNotifications && (
          <div className="absolute top-14 right-0 w-[min(320px,90vw)] bg-bg-surface border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col z-50">
            <div className="p-3 border-b border-border bg-bg-elevated flex justify-between items-center">
              <span className="font-medium text-text-primary text-sm">Notifications</span>
              <span className="text-xs text-accent-primary cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>Mark all as read</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div
                className="p-3 border-b border-border hover:bg-bg-hover cursor-pointer transition-colors"
                onClick={() => { setShowNotifications(false); router.push('/reports'); }}
              >
                <div className="text-sm text-text-primary mb-1">Weekly sales report generated</div>
                <div className="text-xs text-text-muted">2 hours ago</div>
              </div>
              <div
                className="p-3 border-b border-border hover:bg-bg-hover cursor-pointer transition-colors"
                onClick={() => { setShowNotifications(false); router.push('/inventory?stock=out'); }}
              >
                <div className="text-sm text-warning mb-1">Low stock alert for 3 items</div>
                <div className="text-xs text-text-muted">5 hours ago</div>
              </div>
            </div>
            <div
              className="p-2 text-center text-sm text-accent-primary hover:bg-bg-hover cursor-pointer border-t border-border transition-colors"
              onClick={() => { setShowNotifications(false); router.push('/settings'); }}
            >
              View Notification Settings
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary truncate max-w-[100px] md:max-w-none">{profile?.full_name || '...'}</p>
            <p className="text-xs text-text-secondary capitalize">{profile?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-secondary shrink-0">
            <UserIcon size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
