import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useStore, useCurrency } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function DashboardPage() {
  const { 
    data, 
    activities, 
    getRevenue, 
    getTotalOrders, 
    getPendingOrders, 
    getTotalProducts,
    orders,
    posts,
    isLoading,
    setLoading,
    setCurrentPage,
  } = useStore();
  
  const { formatPrice } = useCurrency();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const stats = [
    {
      title: 'Total Products',
      value: getTotalProducts(),
      icon: Package,
      trend: '+12%',
      trendUp: true,
      color: 'bg-blue-500',
      onClick: () => setCurrentPage('products'),
    },
    {
      title: 'Total Orders',
      value: getTotalOrders(),
      icon: ShoppingCart,
      trend: '+8%',
      trendUp: true,
      color: 'bg-violet-500',
      onClick: () => setCurrentPage('orders'),
    },
    {
      title: 'Revenue',
      value: formatPrice(getRevenue('NGN') / (useStore.getState().user?.currency === 'NGN' ? 1 : 0.00065)),
      icon: TrendingUp,
      trend: '+23%',
      trendUp: true,
      color: 'bg-emerald-500',
      onClick: () => setCurrentPage('analytics'),
    },
    {
      title: 'Pending Orders',
      value: getPendingOrders(),
      icon: Clock,
      trend: '-5%',
      trendUp: false,
      color: 'bg-amber-500',
      onClick: () => setCurrentPage('orders'),
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').slice(0, 3);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingCart;
      case 'product':
        return Package;
      case 'post':
        return Sparkles;
      case 'automation':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'product':
        return 'bg-violet-100 text-violet-600';
      case 'post':
        return 'bg-pink-100 text-pink-600';
      case 'automation':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentPage('products')}>
            <Package className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button className="gradient-primary" onClick={() => setCurrentPage('automation')}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card 
              className="cursor-pointer card-hover overflow-hidden"
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trendUp ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={stat.trendUp ? 'text-emerald-500' : 'text-red-500'}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Revenue over the last 30 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('analytics')}>
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Sales']}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Order volume over the last 30 days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('analytics')}>
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('orders')}>
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.productName} × {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          order.status === 'delivered' ? 'status-delivered' :
                          order.status === 'pending' ? 'status-pending' :
                          order.status === 'processing' ? 'status-processing' :
                          order.status === 'shipped' ? 'status-shipped' :
                          'status-cancelled'
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity & Scheduled Posts */}
        <div className="space-y-6">
          {/* Scheduled Posts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledPosts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No scheduled posts</p>
                  </div>
                ) : (
                  scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100">
                        <Sparkles className="h-4 w-4 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{post.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {post.scheduledAt && new Date(post.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 4).map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
