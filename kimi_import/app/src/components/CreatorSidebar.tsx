import { motion } from 'framer-motion';
import { useStore, useSubscription } from '@/store';
import type { CreatorPageType } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Video,
  Mic,
  Calendar,
  Share2,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Crown,
  CreditCard,
} from 'lucide-react';

interface CreatorSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const menuItems: { id: CreatorPageType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scripts', label: 'AI Scripts', icon: FileText },
  { id: 'videos', label: 'Video Generator', icon: Video },
  { id: 'voices', label: 'Voice Generator', icon: Mic },
  { id: 'scheduler', label: 'Scheduler', icon: Calendar },
  { id: 'social-media', label: 'Social Media', icon: Share2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function CreatorSidebar({ collapsed, onNavigate }: CreatorSidebarProps) {
  const { currentPage, setCurrentPage, logout, user } = useStore();
  const { plan, isFree } = useSubscription();

  const handleNavigate = (page: CreatorPageType) => {
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Video className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent"
            >
              ChatCart Studio
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
              <span className="text-sm font-semibold text-violet-500">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <Badge variant={isFree ? 'secondary' : 'default'} className="text-xs">
                  {isFree ? 'Free' : plan}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                'sidebar-item w-full',
                isActive && 'active bg-violet-500/10 text-violet-600',
                collapsed && 'justify-center px-2'
              )}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-violet-500')} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-violet-500 opacity-50" />
                  )}
                </>
              )}
              {collapsed && isActive && (
                <div className="absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-500" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Subscription CTA for Free Users */}
      {!collapsed && isFree && (
        <div className="p-3">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock unlimited AI videos and scripts.
            </p>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-xs"
              onClick={() => handleNavigate('subscription')}
            >
              View Plans
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="border-t border-border p-3 space-y-1">
        <motion.button
          onClick={() => handleNavigate('settings')}
          className={cn(
            'sidebar-item w-full',
            currentPage === 'settings' && 'active bg-violet-500/10 text-violet-600',
            collapsed && 'justify-center px-2'
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </motion.button>
        
        <motion.button
          onClick={() => handleNavigate('subscription')}
          className={cn(
            'sidebar-item w-full',
            currentPage === 'subscription' && 'active bg-violet-500/10 text-violet-600',
            collapsed && 'justify-center px-2'
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Subscription</span>}
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
