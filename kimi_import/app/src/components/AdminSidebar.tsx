import { motion } from 'framer-motion';
import { useStore } from '@/store';
import type { AdminPageType } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  Store,
  Video,
  CreditCard,
  Wallet,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const menuItems: { id: AdminPageType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'All Users', icon: Users },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'creators', label: 'Creators', icon: Video },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminSidebar({ collapsed, onNavigate }: AdminSidebarProps) {
  const { currentPage, setCurrentPage, logout, user, getPendingPaymentsCount } = useStore();
  
  const pendingPayments = getPendingPaymentsCount();

  const handleNavigate = (page: AdminPageType) => {
    setCurrentPage(page);
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold"
            >
              Admin Panel
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-500/10">
              <span className="text-sm font-semibold text-slate-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <Badge variant="secondary" className="text-xs">Administrator</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isPayments = item.id === 'payments';
          const showBadge = isPayments && pendingPayments > 0;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                'sidebar-item w-full relative',
                isActive && 'active bg-slate-500/10 text-slate-700',
                collapsed && 'justify-center px-2'
              )}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-slate-700')} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {showBadge && (
                    <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                      {pendingPayments}
                    </Badge>
                  )}
                  {isActive && !showBadge && (
                    <ChevronRight className="h-4 w-4 text-slate-700 opacity-50" />
                  )}
                </>
              )}
              {collapsed && isActive && (
                <div className="absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-700" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border p-3 space-y-1">
        <motion.button
          onClick={() => handleNavigate('settings')}
          className={cn(
            'sidebar-item w-full',
            currentPage === 'settings' && 'active bg-slate-500/10 text-slate-700',
            collapsed && 'justify-center px-2'
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </motion.button>

        <motion.button
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
            collapsed && 'justify-center px-2'
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </div>
  );
}
