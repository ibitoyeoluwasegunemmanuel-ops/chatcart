import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, toggleSidebar, sidebarCollapsed, orders, posts } = useStore();
  const [isDark, setIsDark] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const notifications = pendingOrders + scheduledPosts;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>

          {/* Search */}
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden sm:block overflow-hidden"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 pr-8"
                    autoFocus
                    onBlur={() => setShowSearch(false)}
                  />
                </div>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {pendingOrders > 0 && (
                <DropdownMenuItem className="flex items-start gap-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-amber-600 text-lg">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pendingOrders} Pending Orders</p>
                    <p className="text-xs text-muted-foreground">
                      Orders awaiting processing
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              {scheduledPosts > 0 && (
                <DropdownMenuItem className="flex items-start gap-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-blue-600 text-lg">@</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{scheduledPosts} Scheduled Posts</p>
                    <p className="text-xs text-muted-foreground">
                      Posts ready to be published
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              {notifications === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No new notifications</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => useStore.getState().setCurrentPage('settings')}>
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => useStore.getState().setCurrentPage('settings')}>
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => useStore.getState().logout()}
                className="text-destructive focus:text-destructive"
              >
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
