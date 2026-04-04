import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthProvider } from "@/components/auth/AuthProvider";

import { UIProvider } from '@/context/ui-context';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <div className="flex h-screen overflow-hidden bg-bg-base">
          <Sidebar />
          {/* Main content area needs padding-bottom on mobile to not hide content under BottomNav */}
          <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
            <Topbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
        <BottomNav />
      </UIProvider>
    </AuthProvider>
  );
}
